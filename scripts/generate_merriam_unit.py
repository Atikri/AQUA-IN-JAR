"""
generate_merriam_unit.py
─────────────────────────────────────────────────────────────
每日自动从 Merriam-Webster's Vocabulary Builder PDF 提取一个单元，
生成 Hugo Markdown 文件，存放于 mysterious-sea-area/merriam-vocab/。

用法:
  python scripts/generate_merriam_unit.py           # 自动读 state 文件，生成下一个单元
  python scripts/generate_merriam_unit.py --unit 3  # 强制生成指定单元 (不改变 state)
"""

import os
import sys
import re
import json
import argparse
from datetime import datetime

import PyPDF2

# ─── 路径配置 ──────────────────────────────────────────────────────────────────
REPO_ROOT   = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PDF_PATH    = os.path.join(REPO_ROOT, "static", "file", "Merriam.pdf")
STATE_PATH  = os.path.join(REPO_ROOT, "data",   "merriam_state.json")
OUTPUT_DIR  = os.path.join(REPO_ROOT, "content", "aquas-field",
                           "mysterious-sea-area", "merriam-vocab")

# ─── 每个 Unit 的起始页码 (1-indexed) ─────────────────────────────────────────
UNIT_START_PAGES = {
     1: 10,  2: 70,  3: 129,  4: 188,  5: 247,
     6: 306,  7: 366,  8: 425,  9: 486, 10: 545,
    11: 605, 12: 664, 13: 723, 14: 783, 15: 844,
    16: 906, 17: 966, 18:1028, 19:1089, 20:1150,
    21:1211, 22:1270, 23:1329, 24:1388, 25:1448,
    26:1508, 27:1569, 28:1631, 29:1693, 30:1752,
}
TOTAL_UNITS = 30


# ─── State ────────────────────────────────────────────────────────────────────

def load_state() -> dict:
    if os.path.exists(STATE_PATH):
        with open(STATE_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"next_unit": 1, "generated": []}


def save_state(state: dict) -> None:
    os.makedirs(os.path.dirname(STATE_PATH), exist_ok=True)
    with open(STATE_PATH, "w", encoding="utf-8") as f:
        json.dump(state, f, ensure_ascii=False, indent=2)


# ─── PDF 提取 ──────────────────────────────────────────────────────────────────

def extract_unit_text(unit_num: int) -> str:
    """提取指定 Unit 的全部文本（到下一个 Unit 开始页，或文件末尾）."""
    start_page = UNIT_START_PAGES[unit_num]  # 1-indexed
    if unit_num < TOTAL_UNITS:
        end_page = UNIT_START_PAGES[unit_num + 1] - 1
    else:
        end_page = 1909

    with open(PDF_PATH, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        chunks = []
        for page_idx in range(start_page - 1, min(end_page, len(reader.pages))):
            page = reader.pages[page_idx]
            text = page.extract_text() or ""
            # Normalise tab/space runs that PyPDF2 leaves
            text = re.sub(r"\t", " ", text)
            text = re.sub(r" {2,}", " ", text)
            chunks.append(text.strip())
    return "\n\n".join(chunks)


# ─── 解析 ──────────────────────────────────────────────────────────────────────

def clean_line(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()


def is_word_line(s: str) -> bool:
    """True if the string looks like a single vocabulary word (all-lowercase, 1-2 words, no digits)."""
    s = s.strip()
    # single word or hyphenated word, or two-word phrase, all lowercase
    return bool(re.match(r'^[a-z][a-z\-]+(\s[a-z]+)?$', s)) and len(s.split()) <= 3 and len(s) <= 25


def parse_unit_from_pages(unit_num: int) -> dict:
    """
    Page-level parser — more accurate than trying to work on the joined text blob.
    Each page is classified as: unit_title | root_header | word_entry | quiz | other
    """
    start_page = UNIT_START_PAGES[unit_num]
    if unit_num < TOTAL_UNITS:
        end_page = UNIT_START_PAGES[unit_num + 1] - 1
    else:
        end_page = 1909

    ROOT_HEADER = re.compile(
        r'^([A-Z]{2,6}(?:/[A-Z]{2,6})?)\s+comes\b', re.IGNORECASE
    )
    QUIZ_RE = re.compile(r'^Quiz\s+\d', re.IGNORECASE)
    BULLET_RE = re.compile(r'^[•·]\s*')

    roots = []
    current_root_idx = -1

    with open(PDF_PATH, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page_idx in range(start_page - 1, min(end_page, len(reader.pages))):
            raw_text = reader.pages[page_idx].extract_text() or ""
            raw_text = re.sub(r'\t', ' ', raw_text)
            lines = [l.strip() for l in raw_text.splitlines() if l.strip()]
            if not lines:
                continue

            first = lines[0]

            # ── Unit title page (e.g. "Unit 1") ──
            if re.match(r'^Unit\s+\d+\s*$', first, re.IGNORECASE):
                continue

            # ── Quiz page ──
            if QUIZ_RE.match(first) or QUIZ_RE.match(lines[1] if len(lines) > 1 else ""):
                continue

            # ── Root header page ──
            # Pattern: first content line is "XYZ comes from..."
            # OR first line is the root name alone and second has "comes from"
            root_match = ROOT_HEADER.match(first)
            if not root_match and len(lines) > 1:
                combined = first + " " + lines[1]
                root_match = ROOT_HEADER.match(combined)
            if root_match:
                root_name = root_match.group(1).upper()
                origin_text = " ".join(lines).strip()
                roots.append({"root": root_name, "origin": origin_text, "words": []})
                current_root_idx = len(roots) - 1
                continue

            # ── Word entry page ──
            # Heuristic: first line is the word (lowercase, short), rest is definition + example
            if is_word_line(first) and current_root_idx >= 0:
                word_str = first

                # Collect definition lines (until bullet example OR until a line that starts the explanation)
                definition_parts = []
                example_parts = []
                explanation_parts = []
                state = "def"

                for line in lines[1:]:
                    if BULLET_RE.match(line):
                        state = "example"
                        example_parts.append(BULLET_RE.sub("", line).strip())
                        continue
                    if state == "def":
                        definition_parts.append(line)
                    elif state == "example":
                        # example can span multiple lines
                        if line.endswith(",") or (example_parts and not example_parts[-1].endswith(".")):
                            example_parts.append(line)
                        else:
                            state = "explanation"
                            explanation_parts.append(line)
                    else:
                        explanation_parts.append(line)

                roots[current_root_idx]["words"].append({
                    "word": word_str,
                    "definition": " ".join(definition_parts).strip(),
                    "book_example": " ".join(example_parts).strip(),
                    "explanation": " ".join(explanation_parts).strip(),
                })
                continue

            # ── Other page (answers, intro text, etc.) ── skip

    return {"roots": roots}


def parse_unit(raw: str) -> dict:
    """
    把 Unit 原文解析成结构化数据。

    返回:
        {
          "roots": [
              {
                "root": "BEN",
                "origin": "comes from the Latin...",
                "words": [
                    {
                        "word": "benediction",
                        "definition": "A short blessing said...",
                        "book_example": "The priest raised his hand...",
                        "explanation": "Benediction comes from...",
                    }, ...
                ]
              }, ...
          ]
        }
    """
    lines = [clean_line(l) for l in raw.splitlines() if clean_line(l)]

    # 用于识别词根标题行（全大写 2-4 字母，或 "ROOTS" 类单行）
    ROOT_HEADER = re.compile(r"^([A-Z]{2,6})(?:\s*/\s*[A-Z]{2,6})*\s+comes\b", re.IGNORECASE)
    # 词条行特征：首行为一个或几个小写单词，后接定义（句点/逗号/空格）
    WORD_DEF    = re.compile(r"^([a-z][a-z\-]+(?:\s+[a-z]+)?)\s+((?:[A-Z][^•\n].{5,}))")
    BULLET      = re.compile(r"^[•·\-]\s*")
    QUIZ        = re.compile(r"^Quiz\s+\d", re.IGNORECASE)

    roots = []
    current_root = None
    current_word = None
    in_quiz = False

    i = 0
    while i < len(lines):
        line = lines[i]

        # ── skip the Unit header line itself ──
        if re.match(r"^Unit\s+\d+\s*$", line, re.IGNORECASE):
            i += 1
            continue

        # ── Quiz 区块跳过 ──
        if QUIZ.match(line):
            in_quiz = True
        if in_quiz:
            # 下一个词根出现时退出 quiz 跳过
            next_root_found = (i + 1 < len(lines) and
                               ROOT_HEADER.match(lines[i + 1]))
            if next_root_found:
                in_quiz = False
            i += 1
            continue

        # ── 词根标题 ──
        if ROOT_HEADER.match(line):
            # 保存上一个词
            if current_word and current_root is not None:
                roots[current_root]["words"].append(current_word)
                current_word = None

            # 词根说明可能跨多行
            root_text = line
            j = i + 1
            while j < len(lines) and not ROOT_HEADER.match(lines[j]) and not WORD_DEF.match(lines[j]):
                root_text += " " + lines[j]
                j += 1

            # 提取词根名（第一个大写单词）
            root_name_match = re.match(r"^([A-Z]{2,6}(?:\s*/\s*[A-Z]{2,6})*)", root_text)
            root_name = root_name_match.group(1).strip() if root_name_match else "?"

            roots.append({"root": root_name, "origin": clean_line(root_text), "words": []})
            current_root = len(roots) - 1
            i = j
            continue

        # ── 单词条目 ──
        m = WORD_DEF.match(line)
        if m and current_root is not None and not in_quiz:
            # 保存上一个词
            if current_word:
                roots[current_root]["words"].append(current_word)

            word_str = m.group(1).strip()
            definition = m.group(2).strip()

            current_word = {
                "word": word_str,
                "definition": definition,
                "book_example": "",
                "explanation": "",
            }
            i += 1
            continue

        # ── 书中例句 (bullet) ──
        if current_word and BULLET.match(line):
            ex = BULLET.sub("", line).strip()
            current_word["book_example"] = ex
            i += 1
            continue

        # ── 解释段落 ──
        if current_word and line and not QUIZ.match(line):
            if current_word["explanation"]:
                current_word["explanation"] += " " + line
            else:
                current_word["explanation"] = line
            i += 1
            continue

        i += 1

    # 收尾
    if current_word and current_root is not None:
        roots[current_root]["words"].append(current_word)

    return {"roots": roots}


# ─── Markdown 生成 ─────────────────────────────────────────────────────────────

EMOJI_MAP = {
    0: "🌱", 1: "🔥", 2: "⚡", 3: "🎯", 4: "💎",
    5: "🌊", 6: "🧠", 7: "🌟",
}


def build_markdown(unit_num: int, parsed: dict, date_str: str) -> str:
    root_names = " · ".join(r["root"] for r in parsed["roots"])
    title = f"Unit {unit_num:02d} · {root_names}"

    lines = [
        "---",
        f'title: "{title}"',
        f"date: \"{date_str}\"",
        f"weight: {unit_num}",
        f"tags: [\"vocabulary\", \"merriam\", \"english\", \"unit-{unit_num:02d}\"]",
        "---",
        "",
        f"[← 回到词汇总览](../)",
        "",
        f"## 📚 Unit {unit_num} 词根总览",
        "",
    ]

    # 词根速览表
    lines.append("| 词根 | 来源 |")
    lines.append("|---|---|")
    for r in parsed["roots"]:
        origin_short = r["origin"][:80] + "…" if len(r["origin"]) > 80 else r["origin"]
        lines.append(f"| **{r['root']}** | {origin_short} |")
    lines.append("")

    # 每个词根的单词
    for idx, root_data in enumerate(parsed["roots"]):
        emoji = EMOJI_MAP.get(idx, "📖")
        lines.append("---")
        lines.append("")
        lines.append(f"## {emoji} 词根 · {root_data['root']}")
        lines.append("")
        lines.append(f"> {root_data['origin']}")
        lines.append("")

        if not root_data["words"]:
            lines.append("*(本词根暂无解析词条)*")
            lines.append("")
            continue

        for w in root_data["words"]:
            lines.append(f"### `{w['word']}`")
            lines.append("")
            if w["definition"]:
                lines.append(f"**释义**: {w['definition']}")
                lines.append("")
            if w["book_example"]:
                lines.append(f"> 📖 **书中例句**: *{w['book_example']}*")
                lines.append("")
            if w["explanation"]:
                lines.append(f"{w['explanation']}")
                lines.append("")

    # 页脚导航
    lines.append("---")
    lines.append("")
    nav = []
    if unit_num > 1:
        nav.append(f"[← Unit {unit_num-1:02d}](../unit-{unit_num-1:02d}/)")
    nav.append("[📖 总览](../)")
    if unit_num < TOTAL_UNITS:
        nav.append(f"[Unit {unit_num+1:02d} →](../unit-{unit_num+1:02d}/)")
    lines.append("  |  ".join(nav))
    lines.append("")

    return "\n".join(lines)


# ─── 主流程 ────────────────────────────────────────────────────────────────────

def generate(unit_num: int) -> str:
    """提取并生成指定 Unit 的 Markdown，返回输出文件路径。"""
    print(f"[Merriam] 解析 Unit {unit_num} (page-level parser) ...")
    parsed = parse_unit_from_pages(unit_num)

    word_count = sum(len(r["words"]) for r in parsed["roots"])
    print(f"[Merriam] 发现 {len(parsed['roots'])} 个词根，{word_count} 个单词")

    date_str = datetime.now().strftime("%Y-%m-%d")
    md = build_markdown(unit_num, parsed, date_str)

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    out_path = os.path.join(OUTPUT_DIR, f"unit-{unit_num:02d}.md")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(md)

    print(f"[Merriam] OK: {os.path.relpath(out_path, REPO_ROOT)}")
    return out_path



def main():
    parser = argparse.ArgumentParser(description="Merriam Vocab Unit Generator")
    parser.add_argument("--unit", type=int, default=None,
                        help="强制生成指定 Unit（不更新进度文件）")
    args = parser.parse_args()

    if args.unit is not None:
        # 手动模式：生成指定 Unit，不修改 state
        if args.unit < 1 or args.unit > TOTAL_UNITS:
            print(f"错误：Unit 编号需在 1-{TOTAL_UNITS} 之间")
            sys.exit(1)
        generate(args.unit)
    else:
        # 自动模式：读取进度，生成下一个 Unit，推进进度
        state = load_state()
        unit_num = state.get("next_unit", 1)
        if unit_num < 1 or unit_num > TOTAL_UNITS:
            unit_num = 1

        try:
            generate(unit_num)
            
            # 更新进度
            generated = state.get("generated", [])
            if unit_num not in generated:
                generated.append(unit_num)
            next_unit = unit_num + 1 if unit_num < TOTAL_UNITS else 1
            state["next_unit"] = next_unit
            state["generated"] = generated
            save_state(state)
            print(f"[Merriam] 进度已更新，下次将生成 Unit {next_unit}")
        except Exception as e:
            print(f"[Merriam] ERROR during generation: {e}")
            sys.exit(1)


if __name__ == "__main__":
    main()
