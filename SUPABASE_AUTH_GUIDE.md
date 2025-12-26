# How to Enable Email Authentication (Magic Link) in Supabase

This guide will walk you through enabling the Email provider so users can log in to your site using a "Magic Link" (a passwordless login link sent to their email).

### Step 1: Open Supabase Dashboard
1. Go to **[supabase.com/dashboard](https://supabase.com/dashboard)** and log in.
2. Select your project (likely named `AQUA IN JAR`).

### Step 2: Navigate to Auth Providers
1. In the left-hand sidebar menu, click on the **Authentication** icon (it looks like a users/group icon).
2. Under general "Configuration", click on **Providers**.

### Step 3: Enable Email
1. Find **Email** in the list of providers.
2. Ensure the **Status** toggle is set to **Enabled** (it usually is by default).
3. Click on **Email** to expand its settings.
4. Verify that **Enable Email Signup** is checked (this allows new users to register).
5. Verify that **Double Confirm Email Changes** is enabled (recommended for security).
6. Click **Save** if you made any changes.

### Step 4: Configure Site URL (Crucial for Redirection)
When users click the magic link in their email, Supabase needs to know where to send them back to (your website).

1. In the Authentication menu, click on **URL Configuration**.
2. **Site URL**:
   - Set this to your **Production URL**: `https://tikri.site`
3. **Redirect URLs**:
   - You need to add your localhost URL so login works while you are testing.
   - Click **Add URL**.
   - Enter: `http://localhost:1313/**` (Adding the wildcard `**` ensures it works on any subpath).
   - Also add: `https://tikri.site/**` just to be safe.
4. Click **Save**.

### Step 5: Run the Database Script (If you haven't yet)
To allow the "Save" feature to store data, you must run the SQL script I generated earlier.

1. Click on the **SQL Editor** icon in the left sidebar.
2. Click **New Query** (or open an empty one).
3. Copy the code below:

```sql
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
```

4. Paste it into the editor and click **Run**.

---

### 🎉 All Done!
Now, when you click the **Star Icon** on your website:
1. A login popup will appear.
2. Enter your email address.
3. Check your inbox for a "Magic Link".
4. Click the link, and you will be logged in and redirected back to your site!
