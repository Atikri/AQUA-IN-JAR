from pypdf import PdfReader
import sys

reader = PdfReader(r"D:\AQUA-IN-JAR\knowledge\Daily Laws.pdf")
found_may = False
text_to_print = []

for i, page in enumerate(reader.pages):
    text = page.extract_text()
    if "May: The Supposed Nonplayers of Power" in text or "May" in text and "Nonplayers" in text:
        text_to_print.append(text)
        found_may = True
        # also print next page to be sure
        if i + 1 < len(reader.pages):
            text_to_print.append(reader.pages[i+1].extract_text())
        break

print("\n---PAGE BREAK---\n".join(text_to_print).encode("utf-8", "ignore").decode("utf-8"))
