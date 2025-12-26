-- Refactor IDs to be Relative Paths (remove domain)
-- This ensures Localhost and Production always use the same ID: e.g. "/podcast-music/episode-1/"

-- 1. Updates Likes
UPDATE post_likes
SET post_id = REPLACE(post_id, 'https://tikri.site', '')
WHERE post_id LIKE 'https://tikri.site%';

-- Also handle localhost if any accidentally saved
UPDATE post_likes
SET post_id = REPLACE(post_id, 'http://localhost:1313', '')
WHERE post_id LIKE 'http://localhost:1313%';

-- 2. Update Comments
UPDATE post_comments
SET post_id = REPLACE(post_id, 'https://tikri.site', '')
WHERE post_id LIKE 'https://tikri.site%';

UPDATE post_comments
SET post_id = REPLACE(post_id, 'http://localhost:1313', '')
WHERE post_id LIKE 'http://localhost:1313%';


-- Verify results
SELECT * FROM post_likes WHERE post_id LIKE '/%';
SELECT * FROM post_comments WHERE post_id LIKE '/%';
