-- Enable Row Level Security
ALTER TABLE IF EXISTS post_likes ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow anyone to READ (Select)
CREATE POLICY "Public Read Access"
ON post_likes FOR SELECT
TO anon
USING (true);

-- Policy 2: Allow anyone to INSERT (Create new row)
-- Note: This allows anyone to create a row for a post.
CREATE POLICY "Public Insert Access"
ON post_likes FOR INSERT
TO anon
WITH CHECK (true);

-- Policy 3: Allow anyone to UPDATE counts
-- Note: Ideally this should be a stored procedure to increment safely, 
-- but for a simple blog, allowing UPDATE is common if less secure against tampering.
CREATE POLICY "Public Update Access"
ON post_likes FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);
