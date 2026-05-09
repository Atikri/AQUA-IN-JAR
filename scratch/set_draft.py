import os

for i in range(11, 32):
    filepath = rf"D:\AQUA-IN-JAR\content\aquas-field\reading-notes\May{i}.md"
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Replace draft: false with draft: true in front matter
        if "draft: false" in content:
            new_content = content.replace("draft: false", "draft: true", 1)
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated {filepath} to draft: true")
