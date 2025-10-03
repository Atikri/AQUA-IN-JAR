import os
import sys
import re
import json
import time
import hashlib
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple

import requests
import yaml
import feedparser
from bs4 import BeautifulSoup
from dateutil import parser as date_parser
import pytz


def load_config(path: str) -> Dict[str, Any]:
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)


def parse_datetime(value: Optional[str]) -> Optional[datetime]:
    if not value:
        return None
    try:
        return date_parser.parse(value)
    except Exception:
        return None


def fetch_url(url: str, timeout: int = 15) -> Optional[str]:
    try:
        headers = {
            "User-Agent": "DailyDigestBot/1.0 (+https://github.com/)"
        }
        resp = requests.get(url, headers=headers, timeout=timeout)
        if resp.status_code == 200:
            resp.encoding = resp.apparent_encoding or resp.encoding
            return resp.text
        return None
    except Exception:
        return None


def extract_main_text(html: str) -> str:
    soup = BeautifulSoup(html, "lxml")
    # remove scripts/styles
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()
    # try common article containers
    candidates = []
    for selector in [
        "article",
        "main",
        "div[itemprop='articleBody']",
        "div.post-content",
        "div.entry-content",
    ]:
        found = soup.select_one(selector)
        if found:
            candidates.append(found)
    node = candidates[0] if candidates else soup.body or soup
    text = node.get_text("\n", strip=True)
    # collapse excessive newlines
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def summarize_text(text: str, max_chars: int = 500) -> str:
    if len(text) <= max_chars:
        return text
    # simple heuristic: first two paragraphs or truncate
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    if paragraphs:
        acc = []
        total = 0
        for p in paragraphs:
            if total + len(p) + 2 > max_chars:
                break
            acc.append(p)
            total += len(p) + 2
        if acc:
            return "\n\n".join(acc)
    return text[: max_chars - 1] + "…"


def ai_summarize(provider: str, model: str, api_key: str, language: str, title: str, url: str, text: str, max_chars: int) -> Optional[str]:
    prompt = (
        f"请用{language}写一段适合每日简报的要点摘要，100~150字，包含关键信息，并避免标题党。\n"
        f"标题：{title}\n链接：{url}\n正文：\n{text[:4000]}"
    )
    try:
        if provider == "openai":
            try:
                from openai import OpenAI
            except Exception:
                return None
            client = OpenAI(api_key=api_key)
            resp = client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
            )
            content = resp.choices[0].message.content.strip()
            return summarize_text(content, max_chars)
        elif provider == "anthropic":
            try:
                import anthropic
            except Exception:
                return None
            client = anthropic.Anthropic(api_key=api_key)
            msg = client.messages.create(
                model=model,
                max_tokens=512,
                temperature=0.2,
                messages=[{"role": "user", "content": prompt}],
            )
            content = "".join([b.text for b in msg.content if getattr(b, "type", "") == "text"]) or str(msg.content)
            return summarize_text(content, max_chars)
        else:
            return None
    except Exception:
        return None


def get_items_from_rss(url: str) -> List[Dict[str, Any]]:
    parsed = feedparser.parse(url)
    items: List[Dict[str, Any]] = []
    for e in parsed.entries:
        link = getattr(e, "link", None)
        title = getattr(e, "title", None)
        summary = getattr(e, "summary", None)
        published = None
        if getattr(e, "published", None):
            published = parse_datetime(e.published)
        elif getattr(e, "updated", None):
            published = parse_datetime(e.updated)
        items.append({
            "title": title or "(无标题)",
            "link": link or "",
            "summary": BeautifulSoup(summary or "", "lxml").get_text(" ", strip=True),
            "published": published,
        })
    return items


def get_items_from_webpage(url: str, link_selector: str) -> List[Dict[str, Any]]:
    html = fetch_url(url)
    if not html:
        return []
    soup = BeautifulSoup(html, "lxml")
    items: List[Dict[str, Any]] = []
    for a in soup.select(link_selector):
        href = a.get("href")
        title = a.get_text(strip=True)
        if not href:
            continue
        if href.startswith("/"):
            from urllib.parse import urljoin
            href = urljoin(url, href)
        items.append({
            "title": title or "(无标题)",
            "link": href,
            "summary": "",
            "published": None,
        })
    return items


def filter_recent(items: List[Dict[str, Any]], hours: int, now: datetime) -> List[Dict[str, Any]]:
    if hours <= 0:
        return items
    cutoff = now - timedelta(hours=hours)
    recent = []
    for it in items:
        published: Optional[datetime] = it.get("published")
        if not published or published >= cutoff:
            recent.append(it)
    return recent


def build_markdown(date_str: str, title: str, items: List[Dict[str, Any]]) -> str:
    lines: List[str] = []
    lines.append("---")
    lines.append(f"title: {title}")
    lines.append(f"date: {date_str}")
    lines.append("type: posts")
    lines.append("draft: false")
    lines.append("tags: ['daily-digest']")
    lines.append("---\n")
    for it in items:
        lines.append(f"### {it['title']}")
        if it.get("link"):
            lines.append(f"- 链接: [{it['link']}]({it['link']})")
        if it.get("summary"):
            lines.append(f"- 摘要: {it['summary']}")
        lines.append("")
    return "\n".join(lines).strip() + "\n"


def main() -> int:
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    cfg_path = os.path.join(repo_root, "data", "news_sources.yaml")
    if not os.path.exists(cfg_path):
        print("Config not found:", cfg_path)
        return 2
    cfg = load_config(cfg_path)

    tz = pytz.timezone(cfg.get("settings", {}).get("timezone", "UTC"))
    now = datetime.now(tz)
    date_str = now.strftime("%Y-%m-%d")

    output_dir = os.path.join(repo_root, cfg["settings"].get("output_dir", "content/aquas-field/daily"))
    ensure_dir(output_dir)

    provider = cfg.get("ai", {}).get("provider", "none")
    language = cfg.get("settings", {}).get("language", "zh-CN")
    max_chars = int(cfg.get("settings", {}).get("max_summary_chars", 500))

    if provider == "openai":
        api_key = os.getenv(cfg.get("ai", {}).get("openai_api_key_env", "OPENAI_API_KEY"), "")
        model = cfg.get("ai", {}).get("openai_model", "gpt-4o-mini")
    elif provider == "anthropic":
        api_key = os.getenv(cfg.get("ai", {}).get("anthropic_api_key_env", "ANTHROPIC_API_KEY"), "")
        model = cfg.get("ai", {}).get("anthropic_model", "claude-3-5-sonnet-latest")
    else:
        api_key = ""
        model = ""

    all_items: List[Dict[str, Any]] = []
    for src in cfg.get("sources", []):
        s_type = src.get("type")
        url = src.get("url")
        max_items = int(src.get("max_items", 10))
        if not url:
            continue
        items: List[Dict[str, Any]] = []
        if s_type == "rss":
            items = get_items_from_rss(url)
        elif s_type == "webpage":
            selector = src.get("link_selector")
            if not selector:
                continue
            items = get_items_from_webpage(url, selector)
        else:
            continue
        if max_items > 0:
            items = items[:max_items]
        all_items.extend(items)

    # filter by time window
    hours = int(cfg.get("settings", {}).get("hours_bounded", 48))
    all_items = filter_recent(all_items, hours, now)

    summarized: List[Dict[str, Any]] = []
    for it in all_items:
        title = it.get("title", "")
        link = it.get("link", "")
        base_summary = it.get("summary", "")
        full_text = base_summary
        if link:
            html = fetch_url(link)
            if html:
                content_text = extract_main_text(html)
                # prefer content_text if it's substantially longer
                if len(content_text) > len(base_summary):
                    full_text = content_text
        if provider in ("openai", "anthropic") and api_key:
            ai_sum = ai_summarize(provider, model, api_key, language, title, link, full_text, max_chars)
            summary = ai_sum or summarize_text(full_text, max_chars)
        else:
            summary = summarize_text(full_text, max_chars)
        summarized.append({
            "title": title,
            "link": link,
            "summary": summary,
        })

    # build markdown
    title_tpl = cfg.get("settings", {}).get("title_template", "每日简报 · {date}")
    page_title = title_tpl.format(date=date_str)
    md = build_markdown(now.isoformat(), page_title, summarized)

    out_path = os.path.join(output_dir, f"{date_str}.md")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(md)
    print("Generated:", os.path.relpath(out_path, repo_root))
    return 0


if __name__ == "__main__":
    sys.exit(main())


