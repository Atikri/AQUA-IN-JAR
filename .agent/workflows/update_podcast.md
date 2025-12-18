---
description: Update Mel Robbins Podcast Section
---

# Update Mel Robbins Podcast

This workflow fetches the latest episode from the Mel Robbins Podcast RSS feed, analyzes it using AI, and creates a new post in the `secret-chamber/the-mel-robbins-podcast` section.

## Prerequisites

1.  **Python Installed**: Ensure Python is installed and added to your PATH.
2.  **Dependencies**: Run `pip install -r requirements.txt` to install `feedparser` and `openai`.
3.  **API Key**: Set the `OPENAI_API_KEY` environment variable with your OpenAI API key.

## Steps

1.  Run the update script:
    ```powershell
    python d:\AQUA-IN-JAR\scripts\fetch_mel_robbins.py
    ```

2.  Check the output for new generated files.

3.  (Optional) Automate with Task Scheduler:
    - Open "Task Scheduler" in Windows.
    - Create a Basic Task.
    - Trigger: Daily.
    - Action: Start a Program.
    - Program/script: `python`
    - Arguments: `d:\AQUA-IN-JAR\scripts\fetch_mel_robbins.py`
