const SUPABASE_URL = 'https://igjkrqkdbvjcoxjnsfob.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnamtycWtkYnZqY294am5zZm9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzOTM1MDUsImV4cCI6MjA3Nzk2OTUwNX0.HcOJAExb89GxxC7LRO-64DdjPm2yaRPhtkmf33hJMPw';
// The ID must match what the frontend generates from .Permalink
// Hugo usually generates: baseURL + section + slug + /
const POST_ID = 'https://tikri.site/podcast-music/episode-1/';

async function addComment() {
    console.log('Adding test comment to:', POST_ID);

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/post_comments`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                post_id: POST_ID,
                author_name: 'Antigravity Test',
                content: '👋 Hello! This is a test comment from the new system. It works!'
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Comment added successfully:', data);
        } else {
            const err = await response.text();
            console.error('❌ Failed to add comment:', response.status, err);
        }
    } catch (e) {
        console.error('❌ Error:', e);
    }
}

addComment();
