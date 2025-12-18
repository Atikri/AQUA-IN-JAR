import os
import feedparser
import re
from pathlib import Path
from datetime import datetime

# Try to import OpenAI, but don't crash if it's missing
try:
    from openai import OpenAI
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False

# Configuration
RSS_URL = "https://feeds.simplecast.com/lZf6yQ8T" # Confirmed Simplecast feed for Mel Robbins
OUTPUT_DIR = Path(r"d:\AQUA-IN-JAR\content\aquas-field\mysterious-sea-area\secret-chamber\the-mel-robbins-podcast")
API_KEY = os.getenv("OPENAI_API_KEY")

def clean_filename(title):
    # Remove invalid characters and replace spaces with hyphens
    return re.sub(r'[\\/*?:"<>|]', "", title).replace(" ", "-").lower()[:50]

def analyze_with_ai(title, description, show_notes):
    """
    Analyzes the podcast content using OpenAI to generate a structured summary.
    """
    if not API_KEY or not HAS_OPENAI:
        return f"**[AI Analysis Pending - API Key Missing or OpenAI module not found]**\n\nTo enable automatic analysis, please set 'OPENAI_API_KEY' environment variable and install openai package.\n\n### Original Show Notes\n{show_notes}"
    
    client = OpenAI(api_key=API_KEY)
    
    prompt = f"""
    You are an expert content strategist and life coach.
    Please analyze the following podcast episode description and show notes for 'The Mel Robbins Podcast'.
    
    Episode Title: {title}
    
    Context:
    {description}
    {show_notes[:2000]} # Truncate to avoid token limits if notes are huge

    Your task is to write a comprehensive blog post about this episode.
    The output must use the following Markdown structure strictly:

    ## Main Topic
    [Describe the main topic of the episode in 1-2 paragraphs]

    ## Key Points Discussed
    [List 3-5 key points discussed in the episode]

    ## Detailed Information
    [Provide a deep dive into the content, explaining the concepts in detail]

    ## Practical Exercises & Tips
    [Provide actionable advice, exercises, or tips that can be applied in daily life based on the episode]

    Make the tone engaging, empowering, and easy to read.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o", # Or gpt-3.5-turbo if preferred for cost
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes podcasts."},
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"**Error during AI Analysis:** {str(e)}\n\n### Original Show Notes\n{show_notes}"

def fetch_and_process():
    print(f"Fetching RSS feed from {RSS_URL}...")
    feed = feedparser.parse(RSS_URL)
    
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    print(f"Found {len(feed.entries)} episodes.")
    
    msgs = []
    # Process the latest episode only for "update" behavior, 
    # but we scan the top 3 to catch up if needed.
    for entry in feed.entries[:1]: 
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
        description = getattr(entry, 'description', '')
        summary = getattr(entry, 'summary', '')
        content_encoded = ""
        if hasattr(entry, 'content'):
            content_encoded = entry.content[0].value
            
        # Combine available text for the AI
        full_context = f"{description}\n\n{summary}\n\n{content_encoded}"
        
        # AI Analysis
        analysis = analyze_with_ai(entry.title, description, full_context)
        
        # Write Markdown
        # Note: We use the Spotify link if available, or the link from the feed
        link = entry.link
        
        markdown_content = f"""---
title: "{entry.title.replace('"', "'")}"
date: {date_str}
description: "{getattr(entry, 'subtitle', 'New episode analysis')}"
tags: ["podcast", "mel-robbins"]
cascade:
  password: "0126"
---

{analysis}

---
**[Listen to the Episode]({link})**
"""
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(markdown_content)
        
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
