---
title: "Random Aqua"
date: 2025-01-27
description: "随机浏览网站内容，发现意外的惊喜"
---


🎲点击下面的按钮，随机浏览网站中的任意一篇文章，发现意外的惊喜！

<div style="text-align: center; margin: 40px 0;">
  <button onclick="randomArticle()" style="
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 15px 30px;
    font-size: 18px;
    border-radius: 25px;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    transition: all 0.3s ease;
  " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.4)'" 
     onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(102, 126, 234, 0.3)'">
    🎲 随机探索
  </button>
</div>

## 如何使用

1. 点击"随机探索"按钮
2. 系统会随机选择网站中的一篇文章
3. 享受意外的发现之旅！

---

*每次点击都可能带来新的惊喜，就像在海洋中随机漂流一样。*

<script>
// Random Aqua 功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有文章链接
    function getRandomArticle() {
        // 这里需要从Hugo获取文章列表
        // 由于这是静态页面，我们需要通过其他方式获取文章列表
        const articles = [
            '/aquas-field/daily/',
            '/aquas-field/mysterious-sea-area/',
            '/aquas-field/reading-notes/',
            '/aquas-field/recipe/',
            '/podcast-music/',
            '/notification-jar/',
            '/aqua-inspiration/'
        ];
        
        // 添加具体的文章页面
        const specificArticles = [
            '/aquas-field/daily/东方明珠电视塔/',
            '/aquas-field/mysterious-sea-area/财务记录模板/',
            // 可以添加更多具体文章
        ];
        
        const allArticles = [...articles, ...specificArticles];
        const validArticles = allArticles.filter(url => url && url.trim() !== '');
        
        if (validArticles.length > 0) {
            const randomIndex = Math.floor(Math.random() * validArticles.length);
            const randomUrl = validArticles[randomIndex];
            window.location.href = randomUrl;
        } else {
            alert('暂时没有可用的文章，请稍后再试！');
        }
    }
    
    // 绑定按钮点击事件
    const button = document.querySelector('button[onclick="randomArticle()"]');
    if (button) {
        button.onclick = getRandomArticle;
    }
    
    // 全局函数，供其他地方调用
    window.randomArticle = getRandomArticle;
});
</script>
