# 点赞功能设置指南 - Supabase 集成

本文档说明如何设置跨设备同步的点赞功能。

## 📋 概述

点赞功能使用 Supabase 作为后端数据库，实现：
- ✅ 跨设备同步点赞数据
- ✅ 所有用户看到的点赞数一致
- ✅ 数据持久化，不会因清除缓存而丢失
- ✅ 防止重复点赞（基于浏览器指纹）

## 🚀 设置步骤

### 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com/)
2. 注册/登录账号（免费）
3. 点击 "New Project" 创建新项目
4. 填写项目信息：
   - **Name**: `aqua-in-jar-likes` (或你喜欢的名称)
   - **Database Password**: 设置一个强密码（保存好）
   - **Region**: 选择离你最近的区域
5. 等待项目创建完成（约2分钟）

### 2. 创建数据库表

在 Supabase 项目控制台中：

1. 进入 **SQL Editor**
2. 点击 **New Query**
3. **推荐方式**：打开项目中的 `supabase-setup.sql` 文件，复制所有 SQL 代码（不要复制 markdown 代码块标记）
4. **或者**：直接复制下面的 SQL 代码（只复制 SQL，不包含 ```sql 标记）：

```sql
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

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_likes_updated_at
  BEFORE UPDATE ON post_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

⚠️ **重要提示**：如果从上面的代码块复制，请确保：
- 只复制 SQL 代码本身
- **不要复制**开头的 ```sql 标记
- **不要复制**结尾的 ``` 标记
- 只复制从 `-- 创建点赞表` 开始到 `EXECUTE FUNCTION` 结束的 SQL 代码

### 3. 获取 API 密钥

1. 在 Supabase 项目控制台中，点击左侧菜单的 **Settings** (⚙️)
2. 选择 **API**
3. 找到以下信息：
   - **Project URL**: 类似 `https://xxxxx.supabase.co`
   - **anon/public key**: 类似 `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 4. 配置网站

有两种方式配置：

#### 方式一：使用配置文件（推荐用于开发）

在 `static/js/like-config.js` 中配置（此文件已创建，需要你填入自己的值）：

```javascript
window.LIKE_CONFIG = {
  supabaseUrl: 'https://your-project.supabase.co',
  supabaseKey: 'your-anon-key-here'
};
```

#### 方式二：在页面中直接配置（推荐用于生产）

在 `layouts/partials/head.html` 中，在加载 `like-button.js` 之前添加：

```html
<script>
  window.LIKE_CONFIG = {
    supabaseUrl: 'https://your-project.supabase.co',
    supabaseKey: 'your-anon-key-here'
  };
</script>
```

⚠️ **注意**：anon key 是公开的，可以安全地暴露在前端代码中。Supabase 使用 Row Level Security 来保护数据。

### 5. 验证设置

1. 访问你的网站
2. 打开任意文章页面
3. 点击点赞按钮
4. 在 Supabase 控制台的 **Table Editor** 中查看 `post_likes` 表，应该能看到新记录

## 🔧 故障排除

### 点赞数不更新

1. 检查浏览器控制台是否有错误
2. 确认 Supabase URL 和 Key 配置正确
3. 检查 Supabase 项目的 API 是否启用
4. 确认数据库表已创建且策略正确

### CORS 错误

如果遇到跨域错误，在 Supabase 项目设置中：
1. 进入 **Settings** > **API**
2. 在 **Allowed CORS origins** 中添加你的网站域名
3. 例如：`https://tikri.site`

### 无法点赞

1. 检查 Row Level Security 策略是否正确设置
2. 确认策略允许 INSERT 和 UPDATE 操作

## 📊 查看统计数据

在 Supabase 控制台的 **Table Editor** 中，你可以：
- 查看所有文章的点赞数
- 手动编辑点赞数（如果需要）
- 查看数据更新时间

## 🔒 安全说明

- **anon key** 是公开的，设计用于前端使用
- Row Level Security (RLS) 策略确保数据安全
- 每个用户只能点赞一次（基于浏览器指纹）
- 如果需要更严格的安全控制，可以添加用户认证

## 💡 高级功能（可选）

如果需要更高级的功能，可以考虑：

1. **用户认证**：集成 Supabase Auth，实现基于用户ID的点赞
2. **实时同步**：使用 Supabase Realtime 实现实时点赞数更新
3. **分析统计**：在 Supabase 中创建视图，统计热门文章

## 📝 更新日志

- 2025-01-XX: 初始版本，支持基本点赞功能

