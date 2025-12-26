(function () {
    'use strict';

    // Configuration
    const CONFIG = window.LIKE_CONFIG || {};
    const SUPABASE_URL = CONFIG.supabaseUrl;
    const SUPABASE_KEY = CONFIG.supabaseKey;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.warn('Supabase not configured for Comments');
        return;
    }

    const container = document.getElementById('comments-section');
    if (!container) return;

    // Get Post ID (Permalink)
    // Normalize to path only to match Like button and ensure localhost consistency
    let rawPostId = container.getAttribute('data-post-id');
    let postId = null;

    if (rawPostId) {
        try {
            const url = new URL(rawPostId);
            postId = url.pathname.replace(/\/$/, '');
        } catch (e) {
            postId = rawPostId.replace(/\/$/, '');
        }
    }

    if (!postId) return;

    const listEl = document.getElementById('comments-list');
    const formEl = document.getElementById('comment-form');
    const countEl = document.getElementById('comments-count');

    // Fetch Comments
    async function fetchComments() {
        try {
            const url = `${SUPABASE_URL}/rest/v1/post_comments?post_id=eq.${encodeURIComponent(postId)}&is_approved=eq.true&order=created_at.desc`;
            const response = await fetch(url, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });

            if (response.ok) {
                const comments = await response.json();
                renderComments(comments);
            }
        } catch (e) {
            console.error('Error fetching comments:', e);
            listEl.innerHTML = '<p style="opacity:0.6; text-align:center;">无法加载评论...</p>';
        }
    }

    // Render Comments
    function renderComments(comments) {
        if (countEl) countEl.textContent = `(${comments.length})`;

        if (comments.length === 0) {
            listEl.innerHTML = '<p style="opacity:0.6; text-align:center; padding: 20px;">暂无评论，来坐沙发吧！</p>';
            return;
        }

        listEl.innerHTML = comments.map(c => {
            const date = new Date(c.created_at).toLocaleString('zh-CN', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit'
            });
            const avatarChar = (c.author_name || 'A').charAt(0).toUpperCase();

            // Simple sanitation to prevent XSS
            const content = c.content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            const author = c.author_name.replace(/</g, "&lt;").replace(/>/g, "&gt;");

            return `
                <div class="comment-item">
                    <div class="comment-avatar">${avatarChar}</div>
                    <div class="comment-content">
                        <div class="comment-header">
                            <span class="comment-author">${author}</span>
                            <span class="comment-date">${date}</span>
                        </div>
                        <div class="comment-body">${content}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Handle Submit
    if (formEl) {
        formEl.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = formEl.querySelector('.submit-btn');
            const originalBtnText = btn.textContent;

            const name = document.getElementById('comment-name').value.trim();
            const email = document.getElementById('comment-email').value.trim();
            const content = document.getElementById('comment-content').value.trim();

            if (!name || !content) {
                alert('请填写昵称和评论内容');
                return;
            }

            btn.disabled = true;
            btn.textContent = '提交中...';

            try {
                const url = `${SUPABASE_URL}/rest/v1/post_comments`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({
                        post_id: postId,
                        author_name: name,
                        author_email: email, // Can be empty
                        content: content
                    })
                });

                if (response.ok) {
                    const newComments = await response.json();
                    document.getElementById('comment-content').value = ''; // Clear content
                    // Don't clear name/email for convenience? Maybe clear everything.

                    // Optimistically add to list (or re-fetch)
                    // Since we return representation, we can just prepend matches
                    // But easier to just re-fetch for now or manually inject
                    fetchComments();

                    alert('评论发表成功！');
                } else {
                    const err = await response.text();
                    console.error('Submit failed:', err);
                    alert('评论失败，请稍后重试');
                }
            } catch (e) {
                console.error('Error submitting component:', e);
                alert('网络错误，请重试');
            } finally {
                btn.disabled = false;
                btn.textContent = originalBtnText;
            }
        });
    }

    // Initialize
    fetchComments();

})();
