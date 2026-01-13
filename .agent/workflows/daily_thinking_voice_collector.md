---
description: Daily Thinking Voice Collector Agent - Collects 10 cutting-edge sound/music/tech items.
---

# Daily Thinking Voice Collector

This workflow simulates a "Collector Agent" that scours the web for the latest in sound technology, music therapy, and voice science, compiling a daily report.

## 1. Search for Information

// turbo
1. Search for the latest news and advancements.
Can you help me find 10 cutting-edge and diverse pieces of information from the last 24-48 hours related to the following topics:
    - **Cutting-edge sound & music technology** (AI voice, production tools, audio synthesis)
    - **Music Therapy & Medicine** (healing frequencies, clinical studies, neurological effects)
    - **Music & Exercise** (performance enhancement, rhythm psychology)
    - **Voice Science & Training** (vocal expression, health, new training methods)
    - **Stage Performance & Tech** (innovative equipment, live sound)
    - **Emotional Regulation via Sound**

    *Please ensure the selection is diverse (not just all AI news).*
    *Ensure you collect direct URLs to specific articles/studies, not just the homepage of the source.*

## 2. Compile the "Secret Chamber" Report

2. Create a daily report file.
Based on the 10 items found above, generate a Markdown file content.
**File Path**: `d:\AQUA-IN-JAR\content\aquas-field\mysterious-sea-area\secret-chamber\thinking-voice\{{ current_date }}.md` (Use format YYYY-MM-DD.md)

**Content Format**:
```markdown
---
title: "Thinking Voice Collection: {{ current_date }}"
date: "{{ current_date }}"
description: "Daily collection of cutting-edge sound and voice technology."
tags: ["thinking-voice", "sound-tech", "music-therapy", "innovation"]
---

# 🧠 Thinking Voice Collection

> A curated selection of sound, silence, and signal.

## 🔍 Today's Discoveries

*(For each of the 10 items)*

### 1. [Title of Item]
* **Tag**: #[TopicTag] (e.g., #MusicTherapy, #AIAudio)
* **Summary**: Brief summary of the innovation or news. Why is it important?
* **Source**: [Link to specific article (NOT the homepage)](URL)
* **Insight**: A one-sentence "agent" comment on why this matters for the "Thinking Voice" project.

... (Repeat for all 10 items) ...

---
*Collected by: The Collector Agent*
```

## 3. Save the File
3. Write the content to the file.
Use the `write_to_file` tool to save the generated markdown content to the specified path.
