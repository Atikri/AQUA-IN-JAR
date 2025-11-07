---
title: "Aqua's Game"
date: 2025-01-27
description: "收录了一些可互动的小游戏~"
---

## 🎮 小游戏列表

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0;">
  
  <div style="
    padding: 24px;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.5);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
  " onclick="window.location.href='/random-aqua/todo-list/'" 
     onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.1)'"
     onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
    <h3 style="margin: 0 0 12px 0; font-size: 1.3rem;">📝 待办清单</h3>
    <p style="margin: 0; opacity: 0.8; font-size: 0.95rem;">简洁优雅的待办清单工具，帮你管理每日任务</p>
  </div>

  <div style="
    padding: 24px;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.5);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
  " onclick="randomArticle()" 
     onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.1)'"
     onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
    <h3 style="margin: 0 0 12px 0; font-size: 1.3rem;">🎲 随机探索</h3>
    <p style="margin: 0; opacity: 0.8; font-size: 0.95rem;">随机浏览网站中的任意一篇文章，发现意外的惊喜</p>
  </div>

</div>

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
            '/aquas-field/daily/Chinese-Cabbage/',
            '/aquas-field/daily/duel52/',
            '/aquas-field/daily/How-to-Improve-Your-Teeth-and-Oral-Microbiome-for-Brain-and-Body-Health-Dr-Staci-Whitman/',
            '/aquas-field/daily/Mandible-Line/',
            '/aquas-field/daily/切东西谨记慢慢慢/',
            '/aquas-field/daily/墨水屏supernote推荐/',
            '/aquas-field/daily/油拔法Oil-Pulling/',
            '/aquas-field/daily/眼肌锻炼放松额头/',
            '/aquas-field/daily/等等我先拍张照/',
            '/aquas-field/daily/给拉丁美洲小朋友们上课/',
            '/aquas-field/daily/编织手机套/',
            '/aquas-field/daily/芝麻油/',
            '/aquas-field/daily/菌菌菌君/',
            '/aquas-field/mysterious-sea-area/财务记录模板/',
            '/aquas-field/mysterious-sea-area/Hugo-原始碼資料夾結構/',
            '/aquas-field/mysterious-sea-area/theme-website/',
            '/aquas-field/mysterious-sea-area/to-be-transported/',
            '/aqua-inspiration/測試不可能的事改變我人生的17-個問題/',
            '/podcast-music/AGA-Miss-u-goodbye-instrument/',
            '/podcast-music/red-and-white-instrumental/',
            '/podcast-music/墙纸/',
            '/podcast-music/我们都被忘了/',
            '/notification-jar/AQUA-IN-JAR/',
            '/notification-jar/电子报订阅/',
            '/notification-jar/联系我contact-with-me/'
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


