---
title: "Random Exploration"
date: 2025-01-27
description: "Roll the dice and find a random article from the archive."
slug: "random-exploration"
---

<div style="text-align: center; margin: 40px 0;">
  <button style="
    padding: 16px 32px;
    font-size: 1.2rem;
    background: var(--primary-color, #66ccff);
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transition: transform 0.2s ease;
  " onclick="randomArticle()" 
  onmouseover="this.style.transform='scale(1.05)'" 
  onmouseout="this.style.transform='scale(1)'">
    🎲 Random Travel
  </button>
  <p style="margin-top: 16px; opacity: 0.7;">Click to teleport to a random page!</p>
</div>

<script>
// Random Aqua 功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有文章链接
    function getRandomArticle() {
        // Hardcoded list moved from previous location
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
            '/notification-jar/联系我（contact with me）/'
        ];
        
        const allArticles = [...articles, ...specificArticles];
        const validArticles = allArticles.filter(url => url && url.trim() !== '');
        
        if (validArticles.length > 0) {
            const randomIndex = Math.floor(Math.random() * validArticles.length);
            const randomUrl = validArticles[randomIndex];
            console.log('Random article selected:', randomUrl); 
            window.location.href = randomUrl;
        } else {
            console.error('No valid articles found');
            alert('暂时没有可用的文章，请稍后再试！');
        }
    }
    
    // 全局函数，供其他地方调用
    window.randomArticle = getRandomArticle;
});
</script>
