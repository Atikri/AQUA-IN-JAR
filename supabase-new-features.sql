-- ============================================
-- Supabase Enhanced Features Setup Script (v2 - Fix for existing policies)
-- Stats (Views) and Comments
-- ============================================

-- 1. Create Post Stats Table (for Views and potentially other stats)
CREATE TABLE IF NOT EXISTS post_stats (
  id BIGSERIAL PRIMARY KEY,
  post_id TEXT UNIQUE NOT NULL,
  view_count INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_post_stats_post_id ON post_stats(post_id);

-- Enable RLS (safe to run multiple times)
ALTER TABLE post_stats ENABLE ROW LEVEL SECURITY;

-- Policies for Stats
-- Drop existing policies first to avoid "already exists" errors
DROP POLICY IF EXISTS "Allow public read access stats" ON post_stats;
DROP POLICY IF EXISTS "Allow public insert stats" ON post_stats;
DROP POLICY IF EXISTS "Allow public update stats" ON post_stats;

CREATE POLICY "Allow public read access stats"
  ON post_stats FOR SELECT
  USING (true);

-- Upsert policy
CREATE POLICY "Allow public insert stats"
  ON post_stats FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update stats"
  ON post_stats FOR UPDATE
  USING (true);

-- 2. Create Comments Table
CREATE TABLE IF NOT EXISTS post_comments (
  id BIGSERIAL PRIMARY KEY,
  post_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT, -- Optional, not exposed publicly
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT true, -- Auto-approve for now
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for comments by post
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);

-- Enable RLS
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- Policies for Comments
-- Drop existing policies first
DROP POLICY IF EXISTS "Allow public read access approved comments" ON post_comments;
DROP POLICY IF EXISTS "Allow public insert comments" ON post_comments;

CREATE POLICY "Allow public read access approved comments"
  ON post_comments FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Allow public insert comments"
  ON post_comments FOR INSERT
  WITH CHECK (true);

-- 3. Stored Procedures for atomic increments
-- Increment view count safely
CREATE OR REPLACE FUNCTION increment_view_count(p_id TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO post_stats (post_id, view_count, updated_at)
  VALUES (p_id, 1, NOW())
  ON CONFLICT (post_id)
  DO UPDATE SET
    view_count = post_stats.view_count + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- 4. Status Check
SELECT 
  'Tables created successfully' AS status,
  (SELECT COUNT(*) FROM post_stats) AS stats_count,
  (SELECT COUNT(*) FROM post_comments) AS comments_count;
