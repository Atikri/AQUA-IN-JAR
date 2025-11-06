# 点赞功能快速设置指南

## 🚀 5分钟快速开始

### 步骤 1: 创建 Supabase 项目（2分钟）

1. 访问 https://supabase.com 并登录
2. 点击 **"New Project"**
3. 填写项目信息，等待创建完成

### 步骤 2: 设置数据库（1分钟）

1. 在 Supabase 项目控制台，点击左侧 **SQL Editor**
2. 点击 **New Query**
3. 打开项目中的 `supabase-setup.sql` 文件
4. **重要**：只复制 SQL 代码部分（从 `-- Supabase 点赞功能...` 开始的所有内容），**不要复制任何 markdown 代码块标记**（如 ```sql 或 ```）
5. 粘贴到 SQL Editor
6. 点击 **Run** 执行

### 步骤 3: 获取 API 密钥（1分钟）

1. 在 Supabase 控制台，点击 **Settings** (⚙️)
2. 选择 **API**
3. 复制以下两个值：
   - **Project URL** (例如: `https://xxxxx.supabase.co`)
   - **anon public key** (长字符串)

### 步骤 4: 配置网站（1分钟）

编辑 `static/js/like-config.js` 文件：

```javascript
window.LIKE_CONFIG = {
  supabaseUrl: 'https://你的项目.supabase.co',  // 粘贴 Project URL
  supabaseKey: '你的anon-key'                    // 粘贴 anon key
};
```

### 步骤 5: 测试

1. 启动本地服务器：`hugo server`
2. 访问任意文章页面
3. 点击点赞按钮
4. 在 Supabase 控制台的 **Table Editor** 查看 `post_likes` 表

## ✅ 完成！

现在你的点赞功能已经支持跨设备同步了！

## 📝 详细文档

更多信息请查看：[LIKE_FEATURE_SETUP.md](./LIKE_FEATURE_SETUP.md)

## ⚠️ 注意事项

- Supabase 免费版有使用限制，但对于个人博客完全够用
- anon key 可以安全地暴露在前端代码中
- 如果需要更严格的权限控制，可以修改数据库策略

