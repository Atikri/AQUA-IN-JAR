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
    min-height: 44px;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
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
            '/AQUA-IN-JAR/aquas-field/daily/',
            '/AQUA-IN-JAR/aquas-field/mysterious-sea-area/',
            '/AQUA-IN-JAR/aquas-field/reading-notes/',
            '/AQUA-IN-JAR/aquas-field/recipe/',
            '/AQUA-IN-JAR/podcast-music/',
            '/AQUA-IN-JAR/notification-jar/',
            '/AQUA-IN-JAR/aqua-inspiration/'
        ];
        
        // 添加具体的文章页面
        const specificArticles = [
            '/AQUA-IN-JAR/aquas-field/daily/东方明珠电视塔/',
            '/AQUA-IN-JAR/aquas-field/daily/Chinese-Cabbage/',
            '/AQUA-IN-JAR/aquas-field/daily/duel52/',
            '/AQUA-IN-JAR/aquas-field/daily/How-to-Improve-Your-Teeth-and-Oral-Microbiome-for-Brain-and-Body-Health-Dr-Staci-Whitman/',
            '/AQUA-IN-JAR/aquas-field/daily/Mandible-Line/',
            '/AQUA-IN-JAR/aquas-field/daily/切东西谨记慢慢慢/',
            '/AQUA-IN-JAR/aquas-field/daily/墨水屏supernote推荐/',
            '/AQUA-IN-JAR/aquas-field/daily/油拔法Oil-Pulling/',
            '/AQUA-IN-JAR/aquas-field/daily/眼肌锻炼放松额头/',
            '/AQUA-IN-JAR/aquas-field/daily/等等我先拍张照/',
            '/AQUA-IN-JAR/aquas-field/daily/给拉丁美洲小朋友们上课/',
            '/AQUA-IN-JAR/aquas-field/daily/编织手机套/',
            '/AQUA-IN-JAR/aquas-field/daily/芝麻油/',
            '/AQUA-IN-JAR/aquas-field/daily/菌菌菌君/',
            '/AQUA-IN-JAR/aquas-field/mysterious-sea-area/财务记录模板/',
            '/AQUA-IN-JAR/aquas-field/mysterious-sea-area/Hugo-原始碼資料夾結構/',
            '/AQUA-IN-JAR/aquas-field/mysterious-sea-area/theme-website/',
            '/AQUA-IN-JAR/aquas-field/mysterious-sea-area/to-be-transported/',
            '/AQUA-IN-JAR/aqua-inspiration/測試不可能的事改變我人生的17-個問題/',
            '/AQUA-IN-JAR/podcast-music/AGA-Miss-u-goodbye-instrument/',
            '/AQUA-IN-JAR/podcast-music/red-and-white-instrumental/',
            '/AQUA-IN-JAR/podcast-music/墙纸/',
            '/AQUA-IN-JAR/podcast-music/我们都被忘了/',
            '/AQUA-IN-JAR/notification-jar/AQUA-IN-JAR/',
            '/AQUA-IN-JAR/notification-jar/电子报订阅/',
            '/AQUA-IN-JAR/notification-jar/联系我contact-with-me/'
        ];
        
        const allArticles = [...articles, ...specificArticles];
        const validArticles = allArticles.filter(url => url && url.trim() !== '');
        
        if (validArticles.length > 0) {
            const randomIndex = Math.floor(Math.random() * validArticles.length);
            const randomUrl = validArticles[randomIndex];
            console.log('Random article selected:', randomUrl); // 调试日志
            window.location.href = randomUrl;
        } else {
            console.error('No valid articles found');
            alert('暂时没有可用的文章，请稍后再试！');
        }
    }
    
    // 绑定按钮点击事件
    const button = document.querySelector('button[onclick="randomArticle()"]');
    if (button) {
        button.onclick = (e) => {
            e.preventDefault();
            console.log('Random Aqua button clicked'); // 调试日志
            getRandomArticle();
        };
        
        // 添加触摸事件支持
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            console.log('Random Aqua button touched'); // 调试日志
            getRandomArticle();
        });
    }
    
    // 全局函数，供其他地方调用
    window.randomArticle = getRandomArticle;
});
</script>


