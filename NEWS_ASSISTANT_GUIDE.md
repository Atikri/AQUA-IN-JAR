## 每日简报助手使用指南

本项目提供两种生成每日简报的方法：

- 自动抓取：按配置定时抓取 RSS/网页，汇总摘要成 Markdown，写入 `content/aquas-field/daily/`。
- 手动挑选：你每天把想收录的链接发给助理，由助理生成摘要并产出 Markdown。

---

### 一、自动抓取（推荐先用 RSS）
1) 配置数据源：编辑 `data/news_sources.yaml`
```yaml
sources:
  - name: Hacker News – Frontpage
    type: rss
    url: https://hnrss.org/frontpage
    max_items: 10

  - name: NATS MultiBriefs
    type: webpage
    url: https://multibriefs.com/briefs/nats/
    # 三选一尝试（先用第一条，不行换下一条再测）
    link_selector: 'a[href*="read more"]'
    # 或: 'div#content a[href^="/briefs/nats/"]'
    # 或: 'main a[href*="/briefs/nats/"]'
    max_items: 10

settings:
  language: zh-CN    # 摘要语言（可改 zh-TW / en）
  timezone: Asia/Shanghai
  output_dir: content/aquas-field/daily
  title_template: "每日简报 · {date}"
  hours_bounded: 48 # 只保留近 N 小时条目（<=0 则不过滤）
  max_summary_chars: 500

ai:
  provider: none          # none / openai / anthropic
  openai_model: gpt-4o-mini
  anthropic_model: claude-3-5-sonnet-latest
  openai_api_key_env: OPENAI_API_KEY
  anthropic_api_key_env: ANTHROPIC_API_KEY
```

2) 本地运行（Windows PowerShell）
```bash
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python scripts/daily_digest.py
```
产出：`content/aquas-field/daily/YYYY-MM-DD.md`

3) 启用 AI 摘要（可选）
```bash
# 二选一或都设置
setx OPENAI_API_KEY "<your_key>"
setx ANTHROPIC_API_KEY "<your_key>"
```
然后在 `data/news_sources.yaml` 把 `ai.provider` 设为 `openai` 或 `anthropic`。

4) GitHub Actions 定时任务
- 工作流：`.github/workflows/daily-digest.yml`（每天 UTC 01:00 / 北京时间 09:00）
- 在仓库 Secrets 添加：`OPENAI_API_KEY` / `ANTHROPIC_API_KEY`（若启用 AI 摘要）

---

### 二、手动挑选链接 → 生成当日简报
当你希望亲自挑选条目或某些站点不便自动抓取时，使用此流程。

1) 把当天链接按模板发给助理（示例）：
```
日期：2025-10-03
语言：zh-CN  # 可选 zh-TW / en
风格：资讯类型，带来源标注

链接：
- 标题（可选）：<自拟标题，留空自动提取>
  URL：https://multibriefs.com/briefs/nats/
- URL：https://issuu.com/natsinc/docs/inter_nos_-_fall_2025_newsletter?fr=xKAE9_zU1NQ
```

2) 助理输出：
- 在 `content/aquas-field/daily/YYYY-MM-DD.md` 写入一篇简报。
- 样式默认：
  - 每条含：标题、来源、要点式摘要、原文链接。
  - 可按需求增加：作者、发布时间、栏目、关键词等。

3) 示例来源引用（可直接粘贴）：
- `https://multibriefs.com/briefs/nats/`
- `https://issuu.com/natsinc/docs/inter_nos_-_fall_2025_newsletter?fr=xKAE9_zU1NQ`
- `https://issuu.com/natsinc/docs/inter_nos_-_spring_2025_newsletter?fr=xKAE9_zU1NQ`

---

### 三、常见问题（FAQ）
- 网页抓取不到？
  - 依次更换 `link_selector` 备选。
  - 优先寻找该站点是否有 RSS/Atom。
  - 部分站点需要滚动/JS 渲染，建议改为手动挑选方式。

- 摘要太短或太长？
  - 调整 `max_summary_chars`；或启用 AI 摘要以更智能压缩。

- Hugo 展示不对？
  - 确认 front matter 中 `type: posts` 与目标目录位置是否符合主题模板。

---

如需把新的平台加入自动抓取，告诉助理站点 URL 和理想的抓取数量/频率；如仅需当日精选，也可直接把链接列表按模板发来。


