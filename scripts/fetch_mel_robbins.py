import os
import feedparser
import requests
from datetime import datetime
import re
from pathlib import Path

# Configuration
RSS_URL = "https://feeds.megaphone.fm/melrobbins" # Official RSS for Mel Robbins Podcast
OUTPUT_DIR = Path(r"d:\AQUA-IN-JAR\content\aquas-field\mysterious-sea-area\secret-chamber\the-mel-robbins-podcast")
API_KEY = os.getenv("OPENAI_API_KEY") # User needs to set this

def clean_filename(title):
    # Remove invalid characters and replace spaces with hyphens
    return re.sub(r'[\\/*?:"<>|]', "", title).replace(" ", "-").lower()[:50]

def analyze_with_ai(title, description):
    """
    Mock function to simulate AI analysis.
    In a real scenario, this would call OpenAI/Gemini/Anthropic API.
    """
    if not API_KEY:
        return f"**[AI Analysis Pending - Configure API Key]**\n\nOriginal Description: {description}"
    
    # Example OpenAI call (commented out to avoid errors without key)
    # client = OpenAI(api_key=API_KEY)
    # response = client.chat.completions.create(
    #     model="gpt-4",
    #     messages=[
    #         {"role": "system", "content": "You are an expert analyst. Analyze this podcast episode description. Provide a summary, 3 key takeaways, and 5 thought-provoking questions."},
    #         {"role": "user", "content": f"Title: {title}\n\nDescription: {description}"}
    #     ]
    # )
    # return response.choices[0].message.content
    
    return f"**AI Analysis**\n\n(Simulated Output)\n\n**Summary:**\nThis episode covers...\n\n**Key Takeaways:**\n1. ...\n2. ...\n\n**Reflection Questions:**\n1. ..."

def fetch_and_process():
    print(f"Fetching RSS feed from {RSS_URL}...")
    feed = feedparser.parse(RSS_URL)
    
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    print(f"Found {len(feed.entries)} episodes.")
    
    # Process the latest entry for demo purposes (or loop for all)
    msgs = []
    for entry in feed.entries[:3]: # Just check top 3
        # Handle date
        if hasattr(entry, 'published_parsed'):
            date_obj = datetime(*entry.published_parsed[:6])
            date_str = date_obj.strftime("%Y-%m-%d")
        else:
            date_str = datetime.now().strftime("%Y-%m-%d")
            
        filename = f"{date_str}-{clean_filename(entry.title)}.md"
        filepath = OUTPUT_DIR / filename
        
        if filepath.exists():
            print(f"Skipping existing: {filename}")
            continue
            
        print(f"Processing: {entry.title}")
        
        # Get content
        description = getattr(entry, 'summary', '') or getattr(entry, 'description', '')
        
        # AI Analysis
        analysis = analyze_with_ai(entry.title, description)
        
        # Write Markdown
        content = f"""---
title: "{entry.title.replace('"', "'")}"
date: {date_str}
description: "AI Analysis of this episode."
tags: ["podcast", "mel-robbins", "ai-analysis"]
---

# Episode Analysis

{analysis}

## Official Show Notes

{description}

[Listen to Episode]({entry.link})
"""
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        
        msgs.append(f"Generated: {filename}")

    return msgs

if __name__ == "__main__":
    try:
        new_files = fetch_and_process()
        if new_files:
            print("\nSuccessfully updated:")
            for f in new_files:
                print(f)
        else:
            print("No new episodes to process.")
    except Exception as e:
        print(f"Error: {e}")
