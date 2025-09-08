# Hugo + GitHub Pages 完整部署指南

## 项目概述

本指南详细记录了如何将Hugo静态网站部署到GitHub Pages，实现持续集成和自动部署的完整流程。

**最终成果**：网站地址 - https://Atikri.github.io/AQUA-IN-JAR/

## 📋 更新日志

详细的更新记录请查看：[CHANGELOG.md](./CHANGELOG.md)

**最新更新** (2025-01-09)：
- ✅ 添加分类系统（Notification Jar, AQUA Inspiration）
- ✅ 实现实时搜索功能
- ✅ 添加文章目录（TOC）
- ✅ 启用表情符号支持
- ✅ 优化响应式设计

---

## 第一部分：问题诊断与修复

### 1.1 初始问题分析

**发现的问题**：
1. **分支名称不匹配**：GitHub Actions监听`main`分支，但本地使用`master`分支
2. **baseURL配置错误**：hugo.yaml中的baseURL与GitHub Pages URL不一致
3. **GitHub Actions版本过时**：使用了已弃用的`actions/upload-pages-artifact@v2`
4. **缺少远程仓库配置**：本地Git仓库未设置origin远程地址

### 1.2 配置文件修复

#### 修复 hugo.yaml
```yaml
# 修复前
baseURL: https://aquatikri.org/

# 修复后
baseURL: https://Atikri.github.io/AQUA-IN-JAR/
languageCode: en-us 
title: AQUA IN JAR 
theme: dario
```

#### 修复 GitHub Actions 工作流 (.github/workflows/gh-pages.yml)
```yaml
# 修复分支监听
on:
  push:
    branches:
      - master # 从 main 改为 master

# 修复 baseURL
env:
  HUGO_BASEURL: "https://Atikri.github.io/AQUA-IN-JAR/"

# 修复版本问题
- name: Upload artifact
  uses: actions/upload-pages-artifact@v3  # 从 v2 升级到 v3
```

### 1.3 添加必要文件

#### 创建 .gitignore
```gitignore
# Hugo build output
public/
.hugo_build.lock

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Editor files
.vscode/
.idea/
*.swp
*.swo
*~

# Logs
*.log

# Node modules (if using any Node.js tools)
node_modules/

# Temporary files
*.tmp
*.temp
```

---

## 第二部分：Git仓库配置

### 2.1 设置远程仓库

```bash
# 检查当前远程仓库状态
git remote -v
# 输出：空（表示没有配置远程仓库）

# 添加GitHub远程仓库
git remote add origin https://github.com/Atikri/AQUA-IN-JAR.git

# 验证远程仓库配置
git remote -v
# 输出：
# origin  https://github.com/Atikri/AQUA-IN-JAR.git (fetch)
# origin  https://github.com/Atikri/AQUA-IN-JAR.git (push)
```

### 2.2 推送代码到GitHub

```bash
# 添加所有文件到暂存区
git add .

# 提交更改
git commit -m "初始化Hugo网站并配置GitHub Pages自动部署"

# 推送到GitHub（首次推送）
git push -u origin master
```

**输出结果**：
```
info: please complete authentication in your browser...
Enumerating objects: 70, done.
Delta compression using up to 8 threads
Compressing objects: 100% (58/58), done.
Writing objects: 100% (70/70), 985.85 KiB | 2.35 MiB/s, done.
Total 70 (delta 2), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (2/2), done.
To https://github.com/Atikri/AQUA-IN-JAR.git
 * [new branch]      master -> master
```

---

## 第三部分：GitHub Pages配置

### 3.1 在GitHub上配置Pages

1. **访问仓库设置**：
   - 进入：https://github.com/Atikri/AQUA-IN-JAR
   - 点击 **Settings** 标签

2. **配置Pages源**：
   - 在左侧菜单找到 **Pages**
   - 在 **Source** 部分选择 **"GitHub Actions"**
   - **Custom domain 留空**（不需要填写）
   - 点击 **Save**

### 3.2 首次部署问题解决

**遇到的问题**：
- GitHub Actions工作流失败
- 错误信息：使用了已弃用的 `actions/upload-artifact: v3`

**解决方案**：
```bash
# 修复工作流文件
git add .github/workflows/gh-pages.yml
git commit -m "修复GitHub Actions工作流：更新upload-pages-artifact到v3版本"
git push origin master
```

---

## 第四部分：项目结构说明

### 4.1 完整的项目结构

```
AQUA-IN-JAR/
├── .github/
│   └── workflows/
│       └── gh-pages.yml          # GitHub Actions工作流
├── .gitignore                    # Git忽略文件
├── content/                      # 网站内容
│   ├── _index.md                # 首页内容
│   └── posts/                   # 博客文章目录
│       ├── AQUA IN JAR.md
│       ├── Hugo 原始碼資料夾結構.md
│       ├── 让体液流起来（第一章）.md
│       └── 电子报订阅.md
├── themes/                      # Hugo主题
│   └── dario/                   # 使用的主题
├── layouts/                     # 自定义布局
│   ├── partials/
│   └── shortcodes/
├── static/                      # 静态资源
├── hugo.yaml                   # Hugo配置文件
├── README.md                   # 项目说明
├── DEPLOYMENT_GUIDE.md         # 部署指南
└── HUGO_GITHUB_PAGES_COMPLETE_GUIDE.md  # 本指南
```

### 4.2 关键文件说明

#### hugo.yaml（Hugo配置文件）
```yaml
baseURL: https://Atikri.github.io/AQUA-IN-JAR/
languageCode: en-us 
title: AQUA IN JAR 
theme: dario
```

#### GitHub Actions工作流
- **触发条件**：推送到master分支
- **构建环境**：Ubuntu latest
- **Hugo版本**：latest (extended)
- **部署目标**：GitHub Pages

---

## 第五部分：日常维护指南

### 5.1 添加新文章

#### 方法一：手动创建文件
1. **在 `content/posts/` 目录下创建新的Markdown文件**
2. **添加front matter（文件头部元数据）**：
```yaml
---
date: '2025-01-XX'  # 发布日期
title: '文章标题'    # 文章标题
draft: false        # 是否草稿（false=发布，true=草稿）
author: Tikri       # 作者（可选）
description: "文章描述"  # 文章描述（可选）
---
```

3. **编写文章内容**（使用Markdown语法）

#### 方法二：使用Hugo命令
```bash
# 创建新文章
hugo new posts/新文章标题.md

# 创建草稿文章
hugo new posts/草稿文章.md
# 然后编辑文件，将 draft: true 改为 draft: false
```

### 5.2 发布流程

```bash
# 1. 添加文件到Git
git add content/posts/新文章.md

# 2. 提交更改
git commit -m "添加新文章：文章标题"

# 3. 推送到GitHub
git push origin master

# 4. 等待自动部署（2-5分钟）
# 5. 访问网站查看效果
```

### 5.3 文章状态管理

#### 草稿 vs 发布
- **`draft: true`**：文章不会在网站上显示，仅本地可见
- **`draft: false`**：文章会在网站上显示

#### 检查文章状态
```bash
# 查看所有文章（包括草稿）
hugo server -D

# 查看已发布文章
hugo server
```

### 5.4 本地测试

```bash
# 启动本地服务器
hugo server -D

# 访问本地网站
# http://localhost:1313
```

**参数说明**：
- `-D`：包含草稿文章
- 不加 `-D`：只显示已发布文章

---

## 第六部分：常见问题解决

### 6.1 部署失败

**检查步骤**：
1. 进入GitHub仓库的 **Actions** 标签
2. 查看失败的工作流日志
3. 根据错误信息进行修复

**常见错误**：
- **权限问题**：确保仓库是公开的
- **文件路径错误**：检查文件是否在正确位置
- **语法错误**：检查Markdown文件的front matter格式

### 6.2 网站无法访问

**可能原因**：
1. **缓存问题**：等待5-10分钟让GitHub Pages更新
2. **URL错误**：确保使用正确的URL格式
3. **Pages设置错误**：检查Settings → Pages配置

### 6.3 文章不显示

**检查项目**：
1. **draft状态**：确保 `draft: false`
2. **文件位置**：确保文件在 `content/posts/` 目录
3. **front matter格式**：检查YAML格式是否正确
4. **文件名**：避免使用特殊字符

---

## 第七部分：高级功能

### 7.1 自定义域名

如果需要使用自定义域名：
1. 在GitHub Pages设置中添加Custom domain
2. 在域名服务商处配置CNAME记录
3. 在 `static/` 目录创建 `CNAME` 文件

### 7.2 图片管理

**推荐做法**：
- 将图片放在 `static/images/` 目录
- 在文章中使用相对路径：`![图片描述](/images/图片名.jpg)`

### 7.3 主题自定义

**安全做法**：
- 不要直接修改 `themes/dario/` 中的文件
- 在 `layouts/` 目录中创建同名文件进行覆盖
- 在 `static/` 目录中添加自定义CSS

---

## 第八部分：最佳实践

### 8.1 内容管理

1. **定期备份**：定期推送代码到GitHub
2. **版本控制**：每次修改都提交有意义的commit信息
3. **测试先行**：本地测试后再推送

### 8.2 性能优化

1. **图片优化**：压缩图片文件大小
2. **内容精简**：避免过长的文章
3. **定期清理**：删除不需要的草稿文件

### 8.3 安全考虑

1. **敏感信息**：不要在代码中硬编码敏感信息
2. **访问控制**：合理设置仓库权限
3. **定期更新**：保持Hugo和主题版本更新

---

## 总结

通过以上步骤，我们成功实现了：

✅ **Hugo网站配置**：正确设置baseURL和主题
✅ **GitHub Actions自动化**：实现持续集成和部署
✅ **Git仓库管理**：建立远程仓库连接
✅ **GitHub Pages部署**：网站成功上线
✅ **问题解决**：修复版本兼容性问题

**网站地址**：https://Atikri.github.io/AQUA-IN-JAR/

**后续维护**：只需在 `content/posts/` 目录添加新的Markdown文件，设置 `draft: false`，然后推送到GitHub即可自动更新网站。

---

*本指南记录了完整的Hugo + GitHub Pages部署流程，可作为类似项目的参考文档。*
