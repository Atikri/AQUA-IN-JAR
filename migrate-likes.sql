-- Migrate Likes from Old ID to New ID
UPDATE post_likes
SET post_id = 'https://tikri.site/podcast-music/episode-1/'
WHERE post_id = 'https://tikri.site/podcast-music/AQUA-IN-JAR-episode1/';

-- Verify
SELECT * FROM post_likes WHERE post_id = 'https://tikri.site/podcast-music/episode-1/';
