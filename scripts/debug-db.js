const SUPABASE_URL = 'https://igjkrqkdbvjcoxjnsfob.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnamtycWtkYnZqY294am5zZm9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzOTM1MDUsImV4cCI6MjA3Nzk2OTUwNX0.HcOJAExb89GxxC7LRO-64DdjPm2yaRPhtkmf33hJMPw';

async function checkDatabase() {
    console.log('🔍 Checking Supabase Connectivity...');

    try {
        // Check 1: List all comments to see what IDs exist
        console.log('\n--- Checking Comments Table ---');
        const response = await fetch(`${SUPABASE_URL}/rest/v1/post_comments?select=post_id,content`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Connection Successful. Found entries:', data.length);
            if (data.length > 0) {
                console.log('Existing Post IDs in DB:');
                data.forEach(d => console.log(`- ID: "${d.post_id}" | Content: ${d.content.substring(0, 20)}...`));
            } else {
                console.log('⚠️ No comments found in table.');
            }
        } else {
            console.error('❌ Error fetching comments:', response.status, await response.text());
        }

        // Check 2: List all Likes
        console.log('\n--- Checking Likes Table ---');
        const likeRes = await fetch(`${SUPABASE_URL}/rest/v1/post_likes?select=post_id,like_count`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        if (likeRes.ok) {
            const likes = await likeRes.json();
            likes.forEach(l => console.log(`- ID: "${l.post_id}" | Count: ${l.like_count}`));
        }
    } catch (e) {
        console.error('❌ Network Error:', e);
    }
}

checkDatabase();
