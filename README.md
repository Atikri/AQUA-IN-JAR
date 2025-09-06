# AQUA IN JAR

一个基于Hugo的个人博客网站，使用GitHub Pages进行自动部署。

## 项目结构

```
AQUA-IN-JAR/
├── .github/workflows/    # GitHub Actions工作流
├── content/              # 网站内容
│   ├── _index.md        # 首页
│   └── posts/           # 博客文章
├── themes/              # Hugo主题
│   └── dario/           # 使用的主题
├── layouts/             # 自定义布局
├── static/              # 静态资源
├── hugo.yaml           # Hugo配置文件
└── README.md           # 项目说明
```

## 部署说明

### 自动部署

网站已配置GitHub Actions自动部署：

1. 当你推送代码到`master`分支时，GitHub Actions会自动构建并部署网站
2. 网站将部署到：`https://Atikri.github.io/AQUA-IN-JAR/`

### 本地开发

1. 安装Hugo：
   ```bash
   # 使用Chocolatey (Windows)
   choco install hugo-extended
   
   # 或下载二进制文件
   # https://github.com/gohugoio/hugo/releases
   ```

2. 启动本地服务器：
   ```bash
   hugo server -D
   ```

3. 访问：`http://localhost:1313`

### 添加新文章

1. 在`content/posts/`目录下创建新的Markdown文件
2. 添加front matter：
   ```yaml
   ---
   date: '2025-01-XX'
   title: '文章标题'
   draft: false
   ---
   ```
3. 提交并推送到GitHub

## 配置说明

- **baseURL**: `https://Atikri.github.io/AQUA-IN-JAR/`
- **主题**: dario
- **部署分支**: master
- **构建命令**: `hugo --minify`

## 注意事项

- 确保所有文章都设置`draft: false`才会在网站上显示
- 图片等静态资源放在`static/`目录下
- 修改配置后记得推送到GitHub触发重新部署
