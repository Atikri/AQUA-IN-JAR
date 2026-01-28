(function () {
    'use strict';

    // UI Elements
    let sidebar, likeBtn, saveBtn, likeCountEl;
    let postId;

    // Supabase Config
    const CONFIG = window.LIKE_CONFIG;
    if (!CONFIG || !CONFIG.supabaseUrl) return;

    function init() {
        sidebar = document.querySelector('.interaction-sidebar');
        if (!sidebar) return;

        // Path normalization logic
        postId = getPostId(sidebar);
        if (!postId) return;

        likeBtn = sidebar.querySelector('.btn-like');
        // saveBtn = sidebar.querySelector('.btn-save'); 
        likeCountEl = likeBtn.querySelector('.interaction-count');

        // Binds
        if (likeBtn) likeBtn.addEventListener('click', handleLike);
        // if (saveBtn) saveBtn.addEventListener('click', handleSave);

        // Listen for Auth changes from auth.js
        // window.addEventListener('auth:change', (e) => {
        //    checkUserStatus(e.detail);
        // });

        // Initialize state
        loadLikeStats();
        // Wait a bit for auth to initialize or check immediately
        // if (window.UserSession) {
        //    checkUserStatus(window.UserSession);
        // }
    }

    function getPostId(el) {
        let rawId = el.getAttribute('data-post-id');
        if (!rawId) return null;
        try {
            // Always use relative path (e.g., /podcast-music/episode-1/)
            // We force a base to parse relative URLs if needed
            const url = new URL(rawId, window.location.origin);
            let path = url.pathname;
            // Ensure trailing slash for consistency with Hugo
            if (!path.endsWith('/')) path += '/';
            return path;
        } catch (e) {
            console.error('Invalid URL', e);
            return null;
        }
    }

    // --- Like Feature (Anonymous/Public) ---

    async function loadLikeStats() {
        try {
            const url = `${CONFIG.supabaseUrl}/rest/v1/post_likes?post_id=eq.${encodeURIComponent(postId)}&select=like_count`;
            const res = await fetch(url, {
                headers: {
                    'apikey': CONFIG.supabaseKey,
                    'Authorization': `Bearer ${CONFIG.supabaseKey}`
                },
                cache: 'no-store'
            });
            if (res.ok) {
                const data = await res.json();
                const count = data[0]?.like_count || 0;
                updateLikeUI(count);
            }

            // Check local "liked" state
            if (localStorage.getItem(`liked_${postId}`)) {
                likeBtn.classList.add('liked');
            }
        } catch (e) {
            console.error('[Like] Load failed', e);
        }
    }

    function updateLikeUI(count) {
        if (likeCountEl) likeCountEl.textContent = count;
    }

    async function handleLike() {
        if (likeBtn.classList.contains('liked')) {
            // Optional: Allow unlike? For now, sticking to "Heart once" pattern common in blogs
            // But let's show a message "Already liked"
            return;
        }

        // Optimistic update
        likeBtn.classList.add('liked');
        const curr = parseInt(likeCountEl.textContent) || 0;
        updateLikeUI(curr + 1);
        localStorage.setItem(`liked_${postId}`, 'true');

        // Api Call
        await incrementLikeAPI();
    }

    async function incrementLikeAPI() {
        // Simple increment logic (Insert if new, Update if exists)
        // Using upsert pattern via REST (simulating RPC for simplicity if RPC not available, 
        // but prefer RPC if we had it. The previous script used a manual check-then-update 
        // which is race-condition prone but works for low traffic)

        // Let's use the robust Fetch/Patch logic from previous file
        try {
            // 1. Check exist
            const chkUrl = `${CONFIG.supabaseUrl}/rest/v1/post_likes?post_id=eq.${encodeURIComponent(postId)}&select=like_count`;
            const checkRes = await fetch(chkUrl, {
                headers: {
                    'apikey': CONFIG.supabaseKey,
                    'Authorization': `Bearer ${CONFIG.supabaseKey}`
                },
                cache: 'no-store'
            });
            const existing = await checkRes.json();

            if (existing && existing.length > 0) {
                // Update
                const newCount = (existing[0].like_count || 0) + 1;
                await fetch(`${CONFIG.supabaseUrl}/rest/v1/post_likes?post_id=eq.${encodeURIComponent(postId)}`, {
                    method: 'PATCH',
                    headers: {
                        'apikey': CONFIG.supabaseKey,
                        'Authorization': `Bearer ${CONFIG.supabaseKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ like_count: newCount })
                });
            } else {
                // Insert
                await fetch(`${CONFIG.supabaseUrl}/rest/v1/post_likes`, {
                    method: 'POST',
                    headers: {
                        'apikey': CONFIG.supabaseKey,
                        'Authorization': `Bearer ${CONFIG.supabaseKey}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({ post_id: postId, like_count: 1 })
                });
            }
        } catch (e) {
            console.error('[Like] Increment failed', e);
        }
    }

    // --- Save Feature (Auth Required) ---
    // Removed as per user request (pending investigation)

    // Init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
