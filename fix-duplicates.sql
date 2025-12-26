-- =====================================================
-- FIX DUPLICATE IDS SCRIPT
-- This script safely merges duplicate like counts
-- =====================================================

BEGIN;

-- 1. Create a temporary table with the CORRECTED data
CREATE TEMP TABLE fixed_likes AS
SELECT 
  -- Remove both domains to get just the path
  REPLACE(REPLACE(post_id, 'https://tikri.site', ''), 'http://localhost:1313', '') as new_id,
  SUM(like_count) as total_likes,
  MIN(created_at) as first_created -- keep oldest timestamp
FROM post_likes
GROUP BY new_id;

-- 2. Clear the old messy table
TRUNCATE post_likes;

-- 3. Insert the clean, merged data back
INSERT INTO post_likes (post_id, like_count, created_at)
SELECT new_id, total_likes, first_created
FROM fixed_likes;

-- 4. Clean up Comments (Comments don't collision, so simple update is fine)
UPDATE post_comments
SET post_id = REPLACE(post_id, 'https://tikri.site', '')
WHERE post_id LIKE 'https://tikri.site%';

UPDATE post_comments
SET post_id = REPLACE(post_id, 'http://localhost:1313', '')
WHERE post_id LIKE 'http://localhost:1313%';

COMMIT;

-- Verify
SELECT * FROM post_likes LIMIT 10;
