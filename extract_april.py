import fitz  # PyMuPDF
import sys
import re

pdf_path = r"D:\AQUA-IN-JAR\knowledge\Daily Laws.pdf"
try:
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()

    # Find the section for APRIL 1
    # Usually it's formatting like APRIL 1 \n TITLE \n ... etc.
    # We will search for 'APRIL' and 'MAY ' to narrow down the text
    pattern = re.compile(r"(APRIL 1\s*\n.*?)(?=MAY 1\s*\n)", re.DOTALL)
    match = pattern.search(text)
    if match:
        april_text = match.group(1)
        with open(r"D:\temp_april.txt", "w", encoding="utf-8") as f:
            f.write(april_text)
        print("Successfully extracted April text to temp file.")
    else:
        print("Could not find APRIL 1 to MAY 1 section.")
except Exception as e:
    print(f"Error: {e}")
