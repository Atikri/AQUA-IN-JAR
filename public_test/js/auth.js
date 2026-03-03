(function () {
    'use strict';

    const CONFIG = window.LIKE_CONFIG || {};
    const SUPABASE_URL = CONFIG.supabaseUrl;
    const SUPABASE_KEY = CONFIG.supabaseKey;

    if (!SUPABASE_URL || !SUPABASE_KEY) return;

    // Helper to call Supabase Auth API directly (without SDK to keep it lightweight)
    // Or we can assume no SDK is present and just use REST.
    // Auth is tricky via pure REST without a library because of token refresh/state management.
    // However, loading the 100kb+ Supabase JS client might be overkill but reliable.
    // Let's use the CDN for Supabase JS client for reliable Auth management.

    // We will dynamically load Supabase JS if not present
    const SCRIPT_ID = 'supabase-js-sdk';
    if (!document.getElementById(SCRIPT_ID)) {
        const script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
        script.onload = initAuth;
        document.head.appendChild(script);
    } else {
        initAuth();
    }

    window.UserSession = null;

    async function initAuth() {
        if (!window.supabase) return;

        const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        window.sbClient = client;

        // 1. Handle Passwordless Login (Magic Link) Redirect
        // Supabase sends tokens in the URL hash (e.g. #access_token=...)
        // createClient automatically parses this, but we should ensure getSession is called.

        try {
            const { data: { session }, error } = await client.auth.getSession();
            if (error) console.warn('Auth Error:', error);

            if (session) {
                window.UserSession = session;
                updateAuthUI(session);
                // Clean URL if it has a hash to look cleaner
                if (window.location.hash && window.location.hash.includes('access_token')) {
                    history.replaceState(null, '', window.location.pathname + window.location.search);
                }
            }
        } catch (e) {
            console.error('Session check failed', e);
        }

        // 2. Listen for future changes (Sign out, Token refresh)
        client.auth.onAuthStateChange((_event, session) => {
            window.UserSession = session;
            updateAuthUI(session);
            window.dispatchEvent(new CustomEvent('auth:change', { detail: session }));
        });

        // Expose login function globally
        window.AuthActions = {
            async signInWithEmail(email) {
                const { error } = await client.auth.signInWithOtp({
                    email,
                    options: {
                        // Ensure this matches one of the Redirect URLs you set
                        emailRedirectTo: window.location.href
                    }
                });
                return { error };
            },
            async signOut() {
                const { error } = await client.auth.signOut();
                return { error };
            }
        };
    }

    function updateAuthUI(session) {
        const modal = document.getElementById('auth-modal');
        // Update sidebar state implicitly via event
        if (session) {
            if (modal) modal.classList.remove('show');
            // Toast or console
            console.log('Logged in as:', session.user.email);
        }
    }

    // Modal Creation Logic
    function createModal() {
        if (document.getElementById('auth-modal')) return;

        const div = document.createElement('div');
        div.id = 'auth-modal';
        div.className = 'auth-modal';
        div.innerHTML = `
            <div class="auth-card" style="position:relative;">
                <button class="auth-close" onclick="document.getElementById('auth-modal').classList.remove('show')">&times;</button>
                <h3>登录 / 注册</h3>
                <p style="opacity:0.7; margin-bottom: 20px;">登录以收藏文章</p>
                
                <form id="magic-link-form" style="text-align:left;">
                    <input type="email" id="auth-email" class="form-control" placeholder="your@email.com" required style="margin-bottom:12px;">
                    <button type="submit" class="submit-btn" style="width:100%;">发送登录链接 (Magic Link)</button>
                </form>
                <div id="auth-msg" style="margin-top:12px; font-size:0.9rem;"></div>
            </div>
        `;
        document.body.appendChild(div);

        const form = document.getElementById('magic-link-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const msg = document.getElementById('auth-msg');
            const email = document.getElementById('auth-email').value;

            btn.disabled = true;
            btn.textContent = '发送中...';
            msg.textContent = '';

            if (window.AuthActions) {
                const { error } = await window.AuthActions.signInWithEmail(email);
                if (error) {
                    msg.textContent = '错误: ' + error.message;
                    msg.style.color = 'red';
                } else {
                    msg.textContent = '✅ 登录链接已发送到你的邮箱，请查收！';
                    msg.style.color = 'green';
                }
            } else {
                msg.textContent = '无法加载登录组件，请刷新重试';
            }
            btn.disabled = false;
            btn.textContent = '发送登录链接';
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createModal);
    } else {
        createModal();
    }

})();
