import os
import re

html_path = r'd:\AQUA-IN-JAR\content\aquas-field\reading-notes\April1.md'
txt_path = r'd:\temp_april.txt'

try:
    with open(html_path, 'r', encoding='utf-8') as f:
        april1_content = f.read()

    toc_match = re.search(r'(<ul class=\'toc-drawer\'>.*?</ul>)', april1_content, re.DOTALL)
    toc_html = toc_match.group(1) if toc_match else ""

    with open(txt_path, 'r', encoding='utf-8') as f:
        text = f.read()

    chunks = text.split('APRIL ')
    for chunk in chunks[1:]:
        lines = chunk.strip().split('\n')
        lines = [l.strip() for l in lines if l.strip()]
        if not lines: continue
        day = lines[0]
        if day == '1': continue
        
        # Determine ending sections
        if lines[-1].lower() == 'oceanofpdf.com':
            lines.pop()
            
        # The last line should be the book reference
        reference = lines.pop()
        
        # Second line is the Title
        title = lines[1]
        
        # Find 'Daily Law:'
        dl_idx = -1
        for i in reversed(range(len(lines))):
            if lines[i].startswith('Daily Law:'):
                dl_idx = i
                break
                
        if dl_idx != -1:
            daily_law = " ".join(lines[dl_idx:])
            body_chunk = lines[2:dl_idx]
        else:
            daily_law = ""
            body_chunk = lines[2:]

        # Find Quote Author
        quote_author_idx = -1
        for i, line in enumerate(body_chunk):
            if i < 6 and (line.startswith('—') or line.startswith('-')):
                quote_author_idx = i
                break
                
        if quote_author_idx != -1:
            quote_text = " ".join(body_chunk[:quote_author_idx])
            quote_author = body_chunk[quote_author_idx]
            if quote_author.startswith('—'):
                 quote_author = '— ' + quote_author[1:].lstrip().upper()
            elif quote_author.startswith('-'):
                 quote_author = '— ' + quote_author[1:].lstrip().upper()
                 
            body_html = f"> {quote_text}\n> {quote_author}\n\n"
            rest_body = " ".join(body_chunk[quote_author_idx+1:])
        else:
            body_html = ""
            rest_body = " ".join(body_chunk)
            
        final_content = f"""---
title: "April {day}: {title}"
date: "2026-04-{int(day):02d}"
hiddenFromList: true
featured: false
draft: true
---

[The Daily Laws(outline)](http://tikri.site/aquas-field/reading-notes/The-Daily-Lawsoutline/)

{toc_html}

## {title}

{body_html}{rest_body}

> {daily_law}

{reference}
"""
        file_path = f"d:\\AQUA-IN-JAR\\content\\aquas-field\\reading-notes\\April{day}.md"
        with open(file_path, "w", encoding="utf-8") as out:
            out.write(final_content)
    print("Files for April 2 to 30 generated successfully.")

except Exception as e:
    print(f"Error: {e}")
