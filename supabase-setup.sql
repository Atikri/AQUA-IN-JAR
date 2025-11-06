-- ============================================
-- Supabase 点赞功能数据库设置脚本
-- ============================================
-- 使用方法：
-- 1. 在 Supabase 控制台打开 SQL Editor
-- 2. 复制下面所有 SQL 代码（从 CREATE TABLE 开始）
-- 3. 粘贴到 SQL Editor 中
-- 4. 点击 Run 执行
-- 
-- ⚠️ 注意：不要复制 markdown 代码块标记（```sql 或 ```）
-- ============================================

-- 创建点赞表
CREATE TABLE IF NOT EXISTS post_likes (
  id BIGSERIAL PRIMARY KEY,
  post_id TEXT UNIQUE NOT NULL,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);

-- 启用 Row Level Security (RLS)
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- 删除旧策略（如果存在）
DROP POLICY IF EXISTS "Allow public read access" ON post_likes;
DROP POLICY IF EXISTS "Allow public insert" ON post_likes;
DROP POLICY IF EXISTS "Allow public update" ON post_likes;

-- 设置策略：允许所有人读取
CREATE POLICY "Allow public read access"
  ON post_likes FOR SELECT
  USING (true);

-- 设置策略：允许所有人插入（如果不存在）
CREATE POLICY "Allow public insert"
  ON post_likes FOR INSERT
  WITH CHECK (true);

-- 设置策略：允许所有人更新
CREATE POLICY "Allow public update"
  ON post_likes FOR UPDATE
  USING (true);

-- 创建或替换更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 删除旧触发器（如果存在）
DROP TRIGGER IF EXISTS update_post_likes_updated_at ON post_likes;

-- 创建更新时间触发器
CREATE TRIGGER update_post_likes_updated_at
  BEFORE UPDATE ON post_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 验证设置
SELECT 
  'Table created successfully' AS status,
  COUNT(*) AS existing_records
FROM post_likes;

