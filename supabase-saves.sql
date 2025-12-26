-- ============================================
-- Supabase Enhanced Features Setup Script (v3)
-- User Saves (Favorites)
-- ============================================

-- 1. Create User Saves Table
CREATE TABLE IF NOT EXISTS user_saves (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id) -- Prevent duplicate saves
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_user_saves_user_id ON user_saves(user_id);
CREATE INDEX IF NOT EXISTS idx_user_saves_post_id ON user_saves(post_id);

-- Enable RLS
ALTER TABLE user_saves ENABLE ROW LEVEL SECURITY;

-- Policies for Saves
-- Users can only read/insert/delete their own saves
DROP POLICY IF EXISTS "Users can view own saves" ON user_saves;
DROP POLICY IF EXISTS "Users can insert own saves" ON user_saves;
DROP POLICY IF EXISTS "Users can delete own saves" ON user_saves;

CREATE POLICY "Users can view own saves"
  ON user_saves FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saves"
  ON user_saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saves"
  ON user_saves FOR DELETE
  USING (auth.uid() = user_id);

-- 2. Status Check
SELECT 
  'Table user_saves created successfully' AS status,
  (SELECT COUNT(*) FROM user_saves) AS saves_count;
