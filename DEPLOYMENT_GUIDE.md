# GitHub Pages 部署指南

## 已完成的配置

✅ **Hugo配置文件** (`hugo.yaml`)
- baseURL已设置为：`https://Atikri.github.io/AQUA-IN-JAR/`
- 主题配置正确：`dario`

✅ **GitHub Actions工作流** (`.github/workflows/gh-pages.yml`)
- 监听`master`分支的推送
- 使用最新版本的Hugo和GitHub Actions
- 正确的部署配置

✅ **项目结构**
- 内容文件在`content/`目录
- 主题在`themes/dario/`目录
- 静态资源在`static/`目录

✅ **文章状态**
- "让体液流起来（第一章）" - 已发布 (`draft: false`)
- "Hugo 原始碼資料夾結構" - 已发布 (`draft: false`)
- "AQUA IN JAR" - 草稿状态 (`draft: true`)

## 接下来需要做的步骤

### 1. 提交代码到GitHub

```bash
# 添加所有文件
git add .

# 提交更改
git commit -m "配置GitHub Pages自动部署"

# 推送到GitHub
git push origin master
```

### 2. 在GitHub上配置Pages

1. 进入你的GitHub仓库：`https://github.com/Atikri/AQUA-IN-JAR`
2. 点击 **Settings** 标签
3. 在左侧菜单中找到 **Pages**
4. 在 **Source** 部分选择 **GitHub Actions**
5. 保存设置

### 3. 触发首次部署

推送代码后，GitHub Actions会自动运行。你可以：

1. 进入仓库的 **Actions** 标签
2. 查看工作流运行状态
3. 等待部署完成（通常需要2-5分钟）

### 4. 访问你的网站

部署成功后，你的网站将在以下地址可用：
**https://Atikri.github.io/AQUA-IN-JAR/**

## 常见问题解决

### 如果部署失败

1. **检查Actions日志**：在GitHub仓库的Actions标签中查看错误信息
2. **检查分支名称**：确保你的默认分支是`master`
3. **检查文件权限**：确保`.github/workflows/gh-pages.yml`文件存在且格式正确

### 如果网站无法访问

1. **等待缓存更新**：GitHub Pages可能需要几分钟来更新
2. **检查URL**：确保使用正确的URL格式
3. **检查Pages设置**：确保Source设置为"GitHub Actions"

### 更新内容

以后每次推送代码到`master`分支时，网站都会自动更新。要添加新文章：

1. 在`content/posts/`目录创建新的Markdown文件
2. 设置`draft: false`
3. 提交并推送代码

## 本地测试

在推送之前，你可以本地测试网站：

```bash
# 启动本地服务器
hugo server -D

# 访问 http://localhost:1313 查看效果
```

## 注意事项

- 确保所有要发布的文章都设置`draft: false`
- 图片等静态资源放在`static/`目录下
- 修改配置后记得推送到GitHub触发重新部署
- 首次部署可能需要较长时间，请耐心等待
