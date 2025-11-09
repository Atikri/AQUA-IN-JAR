# AQUA IN JAR 活动报名表单设置指南

## 📋 概述

我已经为你的 AQUA IN JAR 活动页面添加了一个报名表单。表单提交后，数据会发送到你的邮箱。

## 🎯 两种方案对比

### 方案一：Formspree（推荐）⭐

**优势：**
- ✅ 免费（每月50次提交）
- ✅ 设置简单，5分钟完成
- ✅ 表单嵌入在页面中，体验好
- ✅ 自动发送邮件到你的邮箱
- ✅ 支持自定义邮件格式

**费用：** 免费版每月50次提交，付费版 $10/月起（无限提交）

### 方案二：Google Forms

**优势：**
- ✅ 完全免费，无提交限制
- ✅ 数据存储在 Google 表格中
- ✅ 可以设置自动邮件通知

**劣势：**
- ❌ 需要跳转到 Google 表单页面（或嵌入 iframe，体验稍差）

---

## 🚀 方案一：Formspree 设置步骤（推荐）

### 步骤 1：注册 Formspree 账号

1. 访问 [https://formspree.io/](https://formspree.io/)
2. 点击右上角 "Sign Up" 注册账号
3. 可以使用 Google 账号快速注册

### 步骤 2：创建表单

1. 登录后，点击 "New Form" 创建新表单
2. 表单名称填写：`AQUA IN JAR 活动报名`
3. 点击 "Create Form"

### 步骤 3：获取表单 ID

1. 创建表单后，你会看到一个 Endpoint URL，格式如下：
   ```
   https://formspree.io/f/YOUR_FORM_ID
   ```
2. 复制 `YOUR_FORM_ID` 部分（就是 `/f/` 后面的那串字符）

### 步骤 4：配置表单代码

1. 打开文件：`layouts/shortcodes/aqua-jar-form.html`
2. 找到第 89 行左右的这一行：
   ```javascript
   const FORMSPREE_ENDPOINT = 'YOUR_FORMSPREE_ID';
   ```
3. 将 `YOUR_FORMSPREE_ID` 替换为你刚才复制的表单 ID
4. 例如，如果 Endpoint URL 是 `https://formspree.io/f/xjvqkzpn`，则改为：
   ```javascript
   const FORMSPREE_ENDPOINT = 'xjvqkzpn';
   ```

### 步骤 5：设置邮件通知（可选）

1. 在 Formspree 后台，进入你的表单设置
2. 找到 "Email Notifications" 部分
3. 输入你的邮箱地址（例如：aqutikri@gmail.com）
4. 保存设置

### 步骤 6：测试表单

1. 运行 `hugo server` 启动本地服务器
2. 访问活动报名页面
3. 填写表单并提交
4. 检查你的邮箱是否收到邮件

### 步骤 7：部署

1. 提交代码到 GitHub
2. 等待 GitHub Actions 自动部署
3. 在线上网站测试表单功能

---

## 🔄 方案二：Google Forms 设置步骤

如果你更喜欢使用 Google Forms，可以按照以下步骤：

### 步骤 1：创建 Google 表单

1. 访问 [Google Forms](https://forms.google.com/)
2. 点击 "空白表单" 创建新表单
3. 表单标题：`AQUA IN JAR 活动报名`

### 步骤 2：添加表单字段

根据活动信息，添加以下字段：

1. **姓名/昵称**（短答案，必填）
2. **联系方式**（短答案，必填）
3. **期望参与时间**（短答案，必填）
4. **感兴趣的活动**（复选框，可选）：
   - 卡片对抗焦虑
   - 500张拼图/飞行棋/Duel 52/打电动
   - 描绘时尚插画的基础姿势
   - 阅读书籍/食谱书刊
   - 身体拉伸/冥想体验
   - 芳香制作
   - 享用食物
5. **其他想说的话**（段落，可选）

### 步骤 3：设置邮件通知

1. 点击表单右上角的 "⚙️ 设置" 图标
2. 在 "通知" 部分，勾选 "收到新回复时发送电子邮件通知"
3. 输入你的邮箱地址

### 步骤 4：获取表单链接

1. 点击右上角的 "发送" 按钮
2. 复制表单链接
3. 或者点击 "嵌入" 获取 iframe 代码

### 步骤 5：在页面中嵌入表单

有两种方式：

#### 方式 A：直接链接（最简单）

修改 `content/notification-jar/AQUA IN JAR.md`，将表单短代码替换为：

```markdown
## 📝 活动报名

如果你想参与 AQUA IN JAR 活动，请点击下面的链接填写报名表单：

[👉 点击这里填写报名表单](你的Google表单链接)
```

#### 方式 B：嵌入 iframe（体验更好）

1. 在 Google Forms 中点击 "发送" → "嵌入"
2. 复制 iframe 代码
3. 创建一个新的短代码文件 `layouts/shortcodes/google-form.html`：

```html
<div class="google-form-container">
  <iframe 
    src="你的Google表单嵌入链接" 
    width="100%" 
    height="800" 
    frameborder="0" 
    marginheight="0" 
    marginwidth="0">
    正在加载表单...
  </iframe>
</div>

<style>
.google-form-container {
  max-width: 800px;
  margin: 2rem auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.google-form-container iframe {
  display: block;
  min-height: 800px;
}
</style>
```

4. 在 `AQUA IN JAR.md` 中使用：
```markdown
{{< google-form >}}
```

---

## 📧 邮件格式说明

使用 Formspree 时，你收到的邮件格式如下：

```
主题：AQUA IN JAR 活动报名 - [报名者姓名]

AQUA IN JAR 活动报名

姓名/昵称：[报名者姓名]
联系方式：[联系方式]
期望参与时间：[时间]
感兴趣的活动：[选择的活动]
其他留言：[留言内容]

---
提交时间：[提交时间]
```

---

## 🔧 常见问题

### Q1: 表单提交后没有收到邮件？

**解决方案：**
1. 检查垃圾邮件文件夹
2. 确认 Formspree 后台的邮件通知设置正确
3. 检查表单 ID 是否正确配置
4. 查看浏览器控制台是否有错误信息

### Q2: 如何修改表单字段？

编辑 `layouts/shortcodes/aqua-jar-form.html` 文件，修改 HTML 表单部分。

### Q3: 如何修改表单样式？

在 `layouts/shortcodes/aqua-jar-form.html` 文件的 `<style>` 标签中修改 CSS。

### Q4: Formspree 免费版够用吗？

免费版每月 50 次提交，对于一个月 1-2 位成员的活动来说完全够用。如果不够，可以考虑升级到付费版。

### Q5: 可以同时使用两种方案吗？

可以，但建议只使用一种，避免用户困惑。

---

## ✅ 检查清单

使用 Formspree 方案时，请确认：

- [ ] 已注册 Formspree 账号
- [ ] 已创建表单并获取表单 ID
- [ ] 已在代码中配置表单 ID
- [ ] 已设置邮件通知
- [ ] 已在本地测试表单提交
- [ ] 已收到测试邮件
- [ ] 已部署到线上并测试

---

## 📝 下一步

1. 选择你喜欢的方案（推荐 Formspree）
2. 按照对应方案的步骤完成设置
3. 测试表单功能
4. 部署到线上网站

如果遇到任何问题，请查看 Formspree 的官方文档：https://help.formspree.io/

