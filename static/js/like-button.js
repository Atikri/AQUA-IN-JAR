(function() {
    'use strict';

    // 获取当前文章的唯一标识（使用permalink）
    function getPostId() {
        const container = document.querySelector('.like-button-container');
        if (!container) return null;
        return container.getAttribute('data-post-id');
    }

    // 检查是否配置了 Supabase
    function isSupabaseConfigured() {
        return window.LIKE_CONFIG && 
               window.LIKE_CONFIG.supabaseUrl && 
               window.LIKE_CONFIG.supabaseKey;
    }

    // 生成浏览器指纹（用于防止重复点赞）
    async function getBrowserFingerprint() {
        // 使用简单的组合作为指纹
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Fingerprint', 2, 2);
        
        const fingerprint = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset(),
            canvas.toDataURL()
        ].join('|');
        
        // 使用简单的哈希函数
        let hash = 0;
        for (let i = 0; i < fingerprint.length; i++) {
            const char = fingerprint.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return 'fp_' + Math.abs(hash).toString(36);
    }

    // 从 Supabase 获取点赞数
    async function fetchLikeCountFromSupabase(postId) {
        if (!isSupabaseConfigured()) {
            return null;
        }

        try {
            const response = await fetch(
                `${window.LIKE_CONFIG.supabaseUrl}/rest/v1/post_likes?post_id=eq.${encodeURIComponent(postId)}&select=like_count`,
                {
                    method: 'GET',
                    headers: {
                        'apikey': window.LIKE_CONFIG.supabaseKey,
                        'Authorization': `Bearer ${window.LIKE_CONFIG.supabaseKey}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data && data.length > 0) {
                return data[0].like_count;
            }
            return 0;
        } catch (error) {
            console.error('Error fetching like count from Supabase:', error);
            return null;
        }
    }

    // 增加点赞数（Supabase）
    async function incrementLikeInSupabase(postId) {
        if (!isSupabaseConfigured()) {
            return false;
        }

        try {
            // 先尝试获取现有记录
            const checkResponse = await fetch(
                `${window.LIKE_CONFIG.supabaseUrl}/rest/v1/post_likes?post_id=eq.${encodeURIComponent(postId)}`,
                {
                    method: 'GET',
                    headers: {
                        'apikey': window.LIKE_CONFIG.supabaseKey,
                        'Authorization': `Bearer ${window.LIKE_CONFIG.supabaseKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const existing = await checkResponse.json();

            if (existing && existing.length > 0) {
                // 更新现有记录
                const newCount = (existing[0].like_count || 0) + 1;
                const updateResponse = await fetch(
                    `${window.LIKE_CONFIG.supabaseUrl}/rest/v1/post_likes?post_id=eq.${encodeURIComponent(postId)}`,
                    {
                        method: 'PATCH',
                        headers: {
                            'apikey': window.LIKE_CONFIG.supabaseKey,
                            'Authorization': `Bearer ${window.LIKE_CONFIG.supabaseKey}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=representation'
                        },
                        body: JSON.stringify({ like_count: newCount })
                    }
                );

                if (!updateResponse.ok) {
                    throw new Error(`Update failed: ${updateResponse.status}`);
                }

                const updated = await updateResponse.json();
                return updated[0].like_count;
            } else {
                // 创建新记录
                const insertResponse = await fetch(
                    `${window.LIKE_CONFIG.supabaseUrl}/rest/v1/post_likes`,
                    {
                        method: 'POST',
                        headers: {
                            'apikey': window.LIKE_CONFIG.supabaseKey,
                            'Authorization': `Bearer ${window.LIKE_CONFIG.supabaseKey}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=representation'
                        },
                        body: JSON.stringify({
                            post_id: postId,
                            like_count: 1
                        })
                    }
                );

                if (!insertResponse.ok) {
                    throw new Error(`Insert failed: ${insertResponse.status}`);
                }

                const inserted = await insertResponse.json();
                return inserted[0].like_count;
            }
        } catch (error) {
            console.error('Error incrementing like in Supabase:', error);
            return false;
        }
    }

    // 从 localStorage 获取点赞数据（后备方案）
    function getLikesData() {
        try {
            const data = localStorage.getItem('postLikes');
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error('Error reading likes data:', e);
            return {};
        }
    }

    // 保存点赞数据到 localStorage（后备方案）
    function saveLikesData(data) {
        try {
            localStorage.setItem('postLikes', JSON.stringify(data));
        } catch (e) {
            console.error('Error saving likes data:', e);
        }
    }

    // 获取指定文章的点赞数（优先从 Supabase，失败则使用 localStorage）
    async function getLikeCount(postId) {
        const supabaseCount = await fetchLikeCountFromSupabase(postId);
        if (supabaseCount !== null) {
            return supabaseCount;
        }
        // 后备方案：使用 localStorage
        const data = getLikesData();
        return data[postId] || 0;
    }

    // 增加点赞数
    async function incrementLike(postId) {
        const supabaseResult = await incrementLikeInSupabase(postId);
        if (supabaseResult !== false) {
            return supabaseResult;
        }
        // 后备方案：使用 localStorage
        const data = getLikesData();
        data[postId] = (data[postId] || 0) + 1;
        saveLikesData(data);
        return data[postId];
    }

    // 检查用户是否已经点赞过（使用浏览器指纹 + localStorage）
    async function hasLiked(postId) {
        try {
            const fingerprint = await getBrowserFingerprint();
            const key = `liked_${fingerprint}_${postId}`;
            return localStorage.getItem(key) === 'true';
        } catch (e) {
            // 如果获取指纹失败，使用旧的简单方法
            const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
            return likedPosts.includes(postId);
        }
    }

    // 标记用户已点赞
    async function markAsLiked(postId) {
        try {
            const fingerprint = await getBrowserFingerprint();
            const key = `liked_${fingerprint}_${postId}`;
            localStorage.setItem(key, 'true');
            // 也保存到旧的格式以兼容
            const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
            if (!likedPosts.includes(postId)) {
                likedPosts.push(postId);
                localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
            }
        } catch (e) {
            console.error('Error marking as liked:', e);
        }
    }

    // 更新UI显示
    function updateLikeUI(count, isLiked, isLoading = false) {
        const countElement = document.getElementById('like-count');
        const button = document.getElementById('like-btn');
        const messageElement = document.getElementById('like-message');

        if (countElement) {
            countElement.textContent = count;
        }

        if (button) {
            button.disabled = isLoading;
            if (isLiked) {
                button.classList.add('liked');
                if (messageElement) {
                    messageElement.textContent = '感谢你的点赞！';
                    messageElement.classList.add('show');
                    setTimeout(() => {
                        messageElement.classList.remove('show');
                    }, 2000);
                }
            } else {
                button.classList.remove('liked');
            }
        }
    }

    // 处理点赞点击
    async function handleLikeClick() {
        const postId = getPostId();
        if (!postId) return;

        const button = document.getElementById('like-btn');
        if (button) {
            button.disabled = true;
        }

        // 检查是否已经点赞过
        if (await hasLiked(postId)) {
            const messageElement = document.getElementById('like-message');
            if (messageElement) {
                messageElement.textContent = '你已经点赞过这篇文章了';
                messageElement.classList.add('show', 'error');
                setTimeout(() => {
                    messageElement.classList.remove('show', 'error');
                }, 2000);
            }
            if (button) {
                button.disabled = false;
            }
            return;
        }

        // 增加点赞数
        const newCount = await incrementLike(postId);
        await markAsLiked(postId);

        // 更新UI
        updateLikeUI(newCount, true, false);

        // 添加动画效果
        if (button) {
            button.classList.add('animate');
            setTimeout(() => {
                button.classList.remove('animate');
            }, 600);
        }
    }

    // 初始化
    async function initLikeButton() {
        const postId = getPostId();
        if (!postId) return;

        const button = document.getElementById('like-btn');
        if (!button) return;

        // 显示加载状态
        updateLikeUI(0, false, true);

        // 加载并显示当前点赞数
        const count = await getLikeCount(postId);
        const isLiked = await hasLiked(postId);
        updateLikeUI(count, isLiked, false);

        // 绑定点击事件
        button.addEventListener('click', handleLikeClick);
    }

    // DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLikeButton);
    } else {
        initLikeButton();
    }
})();
