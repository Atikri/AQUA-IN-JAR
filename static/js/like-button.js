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
            console.log('[Like] Supabase not configured, using localStorage');
            return null;
        }

        try {
            const url = `${window.LIKE_CONFIG.supabaseUrl}/rest/v1/post_likes?post_id=eq.${encodeURIComponent(postId)}&select=like_count`;
            console.log('[Like] Fetching like count from:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'apikey': window.LIKE_CONFIG.supabaseKey,
                    'Authorization': `Bearer ${window.LIKE_CONFIG.supabaseKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('[Like] HTTP error:', response.status, errorText);
                throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
            }

            const data = await response.json();
            console.log('[Like] Response data:', data);
            
            if (data && data.length > 0) {
                const count = data[0].like_count;
                console.log('[Like] Found like count:', count);
                return count;
            }
            console.log('[Like] No record found, returning 0');
            return 0;
        } catch (error) {
            console.error('[Like] Error fetching like count from Supabase:', error);
            return null;
        }
    }

    // 增加点赞数（Supabase）
    async function incrementLikeInSupabase(postId) {
        if (!isSupabaseConfigured()) {
            console.log('[Like] Supabase not configured, using localStorage');
            return false;
        }

        try {
            // 先检查记录是否存在
            const checkUrl = `${window.LIKE_CONFIG.supabaseUrl}/rest/v1/post_likes?post_id=eq.${encodeURIComponent(postId)}&select=like_count`;
            console.log('[Like] Checking existing record:', checkUrl);
            
            const checkResponse = await fetch(checkUrl, {
                method: 'GET',
                headers: {
                    'apikey': window.LIKE_CONFIG.supabaseKey,
                    'Authorization': `Bearer ${window.LIKE_CONFIG.supabaseKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!checkResponse.ok) {
                const errorText = await checkResponse.text();
                throw new Error(`Check failed: ${checkResponse.status}, ${errorText}`);
            }

            const existing = await checkResponse.json();
            console.log('[Like] Existing record:', existing);

            const baseUrl = `${window.LIKE_CONFIG.supabaseUrl}/rest/v1/post_likes`;
            
            if (existing && existing.length > 0) {
                // 记录存在，更新
                const currentCount = existing[0].like_count || 0;
                const newCount = currentCount + 1;
                console.log('[Like] Updating existing record:', currentCount, '->', newCount);

                const updateUrl = `${baseUrl}?post_id=eq.${encodeURIComponent(postId)}`;
                const updateResponse = await fetch(updateUrl, {
                    method: 'PATCH',
                    headers: {
                        'apikey': window.LIKE_CONFIG.supabaseKey,
                        'Authorization': `Bearer ${window.LIKE_CONFIG.supabaseKey}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({ like_count: newCount })
                });

                if (!updateResponse.ok) {
                    const errorText = await updateResponse.text();
                    console.error('[Like] Update failed:', updateResponse.status, errorText);
                    throw new Error(`Update failed: ${updateResponse.status}, ${errorText}`);
                }

                const updated = await updateResponse.json();
                console.log('[Like] Updated successfully:', updated);
                return updated[0]?.like_count || newCount;
            } else {
                // 记录不存在，插入
                console.log('[Like] Creating new record with count: 1');
                const insertResponse = await fetch(baseUrl, {
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
                });

                if (!insertResponse.ok) {
                    const errorText = await insertResponse.text();
                    console.error('[Like] Insert failed:', insertResponse.status, errorText);
                    throw new Error(`Insert failed: ${insertResponse.status}, ${errorText}`);
                }

                const inserted = await insertResponse.json();
                console.log('[Like] Inserted successfully:', inserted);
                return inserted[0]?.like_count || 1;
            }
        } catch (error) {
            console.error('[Like] Error incrementing like in Supabase:', error);
            console.error('[Like] Error details:', error.message);
            if (error.stack) {
                console.error('[Like] Stack:', error.stack);
            }
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
        console.log('[Like] Attempting to increment like for:', postId);
        const newCount = await incrementLike(postId);
        console.log('[Like] New count after increment:', newCount);
        
        if (newCount === false || newCount === undefined) {
            console.error('[Like] Failed to increment like');
            const messageElement = document.getElementById('like-message');
            if (messageElement) {
                messageElement.textContent = '点赞失败，请稍后重试';
                messageElement.classList.add('show', 'error');
                setTimeout(() => {
                    messageElement.classList.remove('show', 'error');
                }, 3000);
            }
            if (button) {
                button.disabled = false;
            }
            return;
        }

        await markAsLiked(postId);

        // 更新UI
        updateLikeUI(newCount, true, false);
        console.log('[Like] UI updated with count:', newCount);

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
        if (!postId) {
            console.log('[Like] No post ID found');
            return;
        }

        console.log('[Like] Initializing for post:', postId);

        const button = document.getElementById('like-btn');
        if (!button) {
            console.log('[Like] Like button not found');
            return;
        }

        // 显示加载状态
        updateLikeUI(0, false, true);

        // 加载并显示当前点赞数
        console.log('[Like] Loading like count...');
        const count = await getLikeCount(postId);
        const isLiked = await hasLiked(postId);
        console.log('[Like] Loaded count:', count, 'isLiked:', isLiked);
        updateLikeUI(count, isLiked, false);

        // 绑定点击事件
        button.addEventListener('click', handleLikeClick);
        console.log('[Like] Initialization complete');
    }

    // DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLikeButton);
    } else {
        initLikeButton();
    }
})();
