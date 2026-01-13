---
description: Daily Thinking Voice Guide Agent - Generates an in-depth educational guide.
---

# Daily Thinking Voice Guide

This workflow simulates a "Guide Agent" that creates a comprehensive daily guide for developing sound and voice skills, based on current trends.

## 1. Select Topic & Research

// turbo
1. Select a topic and research it.
   - If a topic is provided by the user, use that.
   - If NOT, search for a "Trending Sound/Voice Skill" or "Future Sound Career Path" to focus on today. (e.g., "Designing Audio for VR", "Vocal Biomarker Analysis", "Somatic Voice Therapy").
   - Research the selected topic to gather:
     - Key **Knowledge Points** (Theory)
     - Essential **Skills** (Practice)
     - Deep **Understanding** (Philosophy/Strategy)
     - A practical **MVP** (Minimum Viable Product) or exercise for the day.
     - *Ensure you collect direct URLs to specific articles or resources.*

## 2. Generate the Guide

2. Create the guide content.
Generate a Markdown file content based on the research.
**File Path**: `d:\AQUA-IN-JAR\content\aquas-field\mysterious-sea-area\secret-chamber\daily-guided\{{ current_date }}-{{ topic_slug }}.md`

**Content Format**:
```markdown
---
title: "Guide: [Topic Name]"
date: "{{ current_date }}"
description: "Daily in-depth guide on [Topic Name]."
tags: ["daily-guide", "thinking-voice", "education", "[TopicTag]"]
---

# 🎓 Daily Guide: [Topic Name]

> "To understand sound is to understand the movement of the soul."

## 1. The Landscape (Understanding)
*Why is this relevant now? What are the future trends?*
[Content here]

## 2. Core Pillars
### 🧠 Knowledge Points
- Point 1
- Point 2

### 🛠️ Skills Required
- Skill 1
- Skill 2

## 3. Step-by-Step Operational Guide (MVP)
*Goal: Achieve a [Specific Result] by the end of the day.*

**Step 1: Preparation (15 mins)**
[Instructions]

**Step 2: Execution (30 mins)**
[Instructions]

**Step 3: Review & Refine (15 mins)**
[Instructions]

## 4. Further Reading
* [Title](https://specific-article-url) (Direct link to the article/resource, NOT the homepage)
* [Title](https://specific-article-url)

---
*Guided by: The Guide Agent*
```

## 3. Save the File
3. Write the content to the file.
Use the `write_to_file` tool to save the generated markdown content to the specified path.
