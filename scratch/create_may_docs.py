import os

may_titles = [
    "May 1: Everyone Is a Player in the Game",
    "May 2: Take on the Toxic Types",
    "May 3: Judge Them on Their Behavior, Not on Their Words",
    "May 4: The Appearance of Naiveté",
    "May 5: Be Careful Whom You Offend",
    "May 6: See Through the False Front",
    "May 7: The Subtle-Superiority Strategy",
    "May 8: Look at Their Past",
    "May 9: See Through the Emotional Outburst",
    "May 10: Don’t Mistake Extra Conviction for Truth",
    "May 11: The Pattern",
    "May 12: Be Wary of the Noble Gesture",
    "May 13: Recognize Deep Narcissists before You Fall for Them",
    "May 14: The Grandiose Leader",
    "May 15: The Machiavellian Gift",
    "May 16: The Fake Traditionalist",
    "May 17: Deciphering the Shadow",
    "May 18: Look Beneath the Mask",
    "May 19: Demanding Equality",
    "May 20: The Unambitious Front",
    "May 21: The Aggressive Pleaser",
    "May 22: Determine the Strength of People’s Character",
    "May 23: Don’t Always Believe Your Eyes",
    "May 24: Easy Money",
    "May 25: Avoid the Drama Magnet",
    "May 26: The Sincerity Ploy",
    "May 27: Detect Their True Motives",
    "May 28: The Effective Truth",
    "May 29: Nothing Personal",
    "May 30: Everyone Wants More Power",
    "May 31: Know Who You’re Dealing With"
]

outline_lis = []
for i in range(1, 32):
    title = may_titles[i-1]
    outline_lis.append(f"        <li><a href='https://tikri.site/aquas-field/reading-notes/May{i}/'>{title}</a></li>")
outline_block_content = "\n".join(outline_lis)

outline_block = f"""[The Daily Laws(outline)](http://tikri.site/aquas-field/reading-notes/The-Daily-Lawsoutline/)

<ul class='toc-drawer'>
  <li class='drawer-item'>
     <details>
      <summary style='cursor: pointer; font-weight: bold; margin: 10px 0;'><a href="https://tikri.site/aquas-field/reading-notes/May/">May</a></summary>
      <ul>
{outline_block_content}
      </ul>
    </details>
  </li>
</ul>"""

# 1. Create May.md
may_md_content = f"""---
title: "May(The Supposed Nonplayers of Power)"
date: "2026-05-01"
hiddenFromList: false
featured: false
draft: false
---

{outline_block}

## 所谓不参与权力的游戏者 (The Supposed Nonplayers of Power)

## 识别有毒类型和伪装的权力策略
权力是一场社会游戏。为了学习和掌握它，你必须培养研究和了解人的能力。正如十七世纪伟大的思想家和朝臣Baltasar Gracián所写：“许多人花时间研究动物或植物的特性；而研究与我们同生共死的人的特性，该有多么重要！”要成为高级玩家，你也必须成为一名高级心理学家。你必须识别动机，看穿人们行为周围的迷雾。

例如，有些人认为他们可以通过采取与权力无关的行为来退出游戏。你必须小心这样的人，因为当他们在外表上表达这种观点时，他们通常是权力游戏中最熟练的玩家。他们就是我所谓的“所谓的不参与者 (supposed nonplayers)”。他们使用的策略巧妙地掩盖了其中的操纵本质。五月份将教你如何识别这些所谓的不参与者以及其他你希望保持距离的“有毒类型”。

## 作者的亲身经历
在写《权力的48条法则》之前，我曾经数过自己做过大约60种不同的工作。我尝试了很多不同的事情，在这些经历中，我看到了你能想象到的各种渴望权力的人，看到了各种操纵者。我观察他们的操作，观察他们的思考方式。

后来我开始在好莱坞担任各种导演的助理。正是在那里，我开始看到一些极其硬核的马基雅维利策略被用在演员和制片人身上。我会想：“哇，这让我想起文艺复兴时期的切萨雷·博吉亚，让我想起拿破仑的所作所为，让我想起Gracián的那句话。”我在不断积累这些经验，虽然当时我并不知道这些经验最终会变成什么。

## 权力的永恒本质
直到我36岁那年，在意大利从事一份新工作时，我的一位同事、图书包装和设计师Joost Elffers突然问我是否有什么写书的想法。我即兴提出了几个想法，其中一个最终变成了《权力的48条法则》。

我告诉Joost，在我的经验中，权力并没有改变。我们生活在一个非常“政治正确”的世界，电影导演和制片人展现出他们是这个星球上最友善、最开明、最进步的人的形象。但在关起门来之后，他们变成了狂热的操纵者，为了得到他们想要的东西会不择手段。

权力是永恒的。现在人们可能不会因为犯错而被斩首，取而代之的是被解雇。《权力的48条法则》的第一条法则是“永远不要抢主子的风头”。在过去，Nicolas Fouquet因为盖过了路易十四的风头，被终身监禁；而现在，你只是在不知道原因的情况下被解雇了。这只是一种不同形式的惩罚，但游戏还是一样的。

## 面对权力的三种人
在应对这场游戏时，世界上有三种类型的人。第一种我称之为“否认者 (deniers)”，即那些否认这种现实存在的人。他们几乎想假装我们是天使的后代，而不是灵长类动物。他们认为我在这里谈论的只是愤世嫉俗，这些法则并不真的存在，这些硬核策略可能被使用，但只是那些最卑鄙、最不道德的人在使用。
"""

with open(r"D:\AQUA-IN-JAR\content\aquas-field\reading-notes\May.md", "w", encoding="utf-8") as f:
    f.write(may_md_content)
    
print("Created May.md")

# 2. Create May11.md to May31.md
for i in range(11, 32):
    title = may_titles[i-1]
    content = f"""---
title: "{title}"
date: "2026-05-{i:02d}"
hiddenFromList: true
featured: false
draft: false
---

{outline_block}

## {title.split(': ', 1)[1] if ': ' in title else title}

> 
> — 

> Daily Law: 

---

## 实践建议

"""
    filepath = rf"D:\AQUA-IN-JAR\content\aquas-field\reading-notes\May{i}.md"
    if not os.path.exists(filepath):
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Created May{i}.md")

# Wait, I also need to update the title in the files that exist but might have the wrong title.
# I already updated the outline block in May1.md to May10.md, but maybe their titles in the front matter 
# need to be updated to match the PDF. Let's do that too just in case.

import re

for i in range(1, 11):
    title = may_titles[i-1]
    filepath = rf"D:\AQUA-IN-JAR\content\aquas-field\reading-notes\May{i}.md"
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            file_content = f.read()
        
        # update front matter title
        new_content = re.sub(r'title: ".*?"', f'title: "{title}"', file_content, count=1)
        
        if new_content != file_content:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated title in May{i}.md")
