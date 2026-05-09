from pypdf import PdfReader
import sys

def print_outline(outline_items, level=0):
    for item in outline_items:
        if isinstance(item, list):
            print_outline(item, level + 1)
        else:
            title = getattr(item, "title", str(item))
            if "May " in title or "MAY" in title:
                print("  " * level + title)
            elif "MAY" in title.upper():
                print("  " * level + title)
            elif level == 0:
                print("  " * level + title)

try:
    reader = PdfReader(r"D:\AQUA-IN-JAR\knowledge\Daily Laws.pdf")
    outline = reader.outline
    if outline:
        print_outline(outline)
    else:
        print("No outline found.")
except Exception as e:
    print(e)
