const SUPABASE_URL = 'https://igjkrqkdbvjcoxjnsfob.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnamtycWtkYnZqY294am5zZm9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzOTM1MDUsImV4cCI6MjA3Nzk2OTUwNX0.HcOJAExb89GxxC7LRO-64DdjPm2yaRPhtkmf33hJMPw';

const OLD_ID = 'https://tikri.site/podcast-music/AQUA-IN-JAR-episode1/';
const NEW_ID = 'https://tikri.site/podcast-music/episode-1/';

async function migrate() {
    console.log('Migrating likes from:', OLD_ID);
    console.log('To:', NEW_ID);

    // 1. Get Old Likes
    const resOld = await fetch(`${SUPABASE_URL}/rest/v1/post_likes?post_id=eq.${encodeURIComponent(OLD_ID)}&select=*`, {
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
        }
    });

    const oldData = await resOld.json();
    if (!oldData.length) {
        console.log('No old data found.');
        return;
    }
    const oldCount = oldData[0].like_count;
    console.log('Found Old Likes:', oldCount);

    // 2. Get New Likes
    const resNew = await fetch(`${SUPABASE_URL}/rest/v1/post_likes?post_id=eq.${encodeURIComponent(NEW_ID)}&select=*`, {
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
        }
    });

    const newData = await resNew.json();
    let newCount = 0;
    if (newData.length) {
        newCount = newData[0].like_count;
        console.log('Found New Likes (likely 0):', newCount);
    }

    const total = oldCount + newCount; /* simple sum, or just take max? let's sum */
    console.log('Setting New ID to total:', total);

    // 3. Upsert New ID
    if (newData.length > 0) {
        // Update
        await fetch(`${SUPABASE_URL}/rest/v1/post_likes?post_id=eq.${encodeURIComponent(NEW_ID)}`, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ like_count: total })
        });
    } else {
        // Insert
        await fetch(`${SUPABASE_URL}/rest/v1/post_likes`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({ post_id: NEW_ID, like_count: total })
        });
    }

    console.log('Migration done. You can simple delete the old record manually if you want.');
}

migrate();
