import fitz  # PyMuPDF
import re

pdf_path = r"D:\AQUA-IN-JAR\knowledge\Daily Laws.pdf"
try:
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()

    # Find the section introducing April
    # It might start with 'April\n' or similar, but ends at 'APRIL 1\n'
    pattern = re.compile(r"([^A-Z]*?April\n.*?)APRIL 1", re.DOTALL | re.IGNORECASE)
    match = pattern.search(text)
    if match:
        intro_text = match.group(1)
        # However, to be safe, just grab the 1000 characters before APRIL 1
        x_idx = text.find("APRIL 1\n")
        if x_idx != -1:
            snippet = text[max(0, x_idx - 6000) : x_idx]
            with open(r"D:\temp_april_intro.txt", "w", encoding="utf-8") as f:
                f.write(snippet)
            print("Successfully extracted intro.")
except Exception as e:
    print(f"Error: {e}")
