import calendar
import os

file_path = r'd:\AQUA-IN-JAR\content\aquas-field\reading-notes\The Daily Laws(outline).md'

frontmatter = """---
title: "The Daily Laws"
date: "2026-01-01"
hiddenFromList: false
featured: false
---
"""

intro = """
[《The Daily Laws: Meditations on Power and Human Nature》](https://www.amazon.com/Daily-Laws-Meditations-Seduction-Strategy/dp/0593299213)是一本综合性的每日反思集，内容选自作者Robert Greene的众多著作，重点探讨社会动态、职业精进和个人发展等主题。本书以一年为周期，提供每日指导，帮助读者摆脱天真，更现实地理解人性。书中融合了历史、心理学以及作者自身丰富的人生经历，提供了应对权力结构、掌握复杂技能以及通过诱惑和说服影响他人的策略。它鼓励读者转变视角，以科学家的超然好奇心观察世界，从而避免受到情感操纵。最终，本书旨在将读者培养成具有战略思维、能够实现独立自主并拥有崇高人生目标的[个体](https://tikri.site/podcast-music/episode-1/)。这本合集是一本实用的生活指南，旨在弥合哲学理念与具体行动之间的鸿沟。  

Robert Greene在引言中指出，人类大脑的进化初衷是为了让我们对环境保持高度敏锐，以便在危险的自然界中生存。然而在现代社会，由于物理威胁减少，我们的大脑开始转向内在，沉溺于幻想和天真之中。

引言的核心观点包括：  
- 破除文化幻象：现代文化向我们灌输了许多错误的观念，例如认为成功的关键在于名校背景或人脉、工作应该总是充满乐趣、或者创意是天生的才能。
- 激进的现实主义者：本书旨在逆转这些有毒的模式，通过二十五年关于权力、说服、战略和人类本性的研究，将读者转变为一名“激进的现实主义者” (radical realist)。
- 书籍结构：全书按月划分主题。前三个月旨在帮助你摆脱外部杂音，连接内心真实的职业召唤；接下来的月份则依次涵盖职场政治、说服技巧、战略思维以及人类本性的底层动机。
- 阅读建议：作者建议从头到尾完整阅读，并养成随手记笔记、将法则应用于实践的习惯。他将这本书比作一部“教养小说” (bildungsroman)，记录了一个天真的人在现实世界的教育下，剥离幻想并最终获得智慧的过程。

"""

calendar_html = []
months = list(calendar.month_name)[1:]
# Standard non-leap year days + handle Feb manually if needed or just use 2024 (leap)
# User request implies "January 1st to December 31st".
# I'll use 2024 to catch 29 days in Feb just to be thorough, it's safer to have 29 than 28 if it's generic.
# Actually, standard is 365? "The Daily Laws" has 366 meditations.
year = 2024 

for i, month in enumerate(months, 1):
    calendar_html.append(f'<details>')
    calendar_html.append(f'  <summary style="cursor: pointer; font-weight: bold; margin: 10px 0;">{month}</summary>')
    calendar_html.append(f'  <ul>')
    
    _, num_days = calendar.monthrange(year, i)
    
    for day in range(1, num_days + 1):
        calendar_html.append(f'    <li>{month} {day}</li>')
    
    calendar_html.append(f'  </ul>')
    calendar_html.append(f'</details>\n')

full_content = frontmatter + intro + "\n".join(calendar_html)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(full_content)

print("File generated successfully.")
