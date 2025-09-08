# AQUA IN JAR - 更新日志

## 2025-01-09 - 功能增强更新

### 🎉 新增功能

#### 1. 分类系统
- **📢 Notification Jar** - 通知罐子分类
- **💧 AQUA Inspiration** - 水之灵感分类  
- **📝 所有文章** - 文章总览页面
- 响应式分类卡片设计
- 分类页面自动生成文章列表

#### 2. 搜索功能
- 实时搜索（输入2个字符后开始搜索）
- 关键词高亮显示（荧光标记）
- 键盘导航支持（上下箭头、回车、ESC）
- 搜索结果下拉显示
- 移动端适配

#### 3. 目录功能 (TOC)
- 桌面版：左侧固定侧边栏目录
- 手机版：文章顶部目录框
- 自动基于文章标题（H2-H4）生成
- 响应式设计，跟随主题颜色

#### 4. 表情符号支持
- 启用 Hugo emoji 短代码支持
- 支持 `:thinking:` 等标准 emoji 语法
- 自动渲染为对应的表情符号

### 🎨 样式改进

#### 1. 引用块样式
- 添加左侧竖线边框
- 斜体文字显示
- 主题颜色适配

#### 2. 主题切换
- 恢复主题切换功能
- 所有页面保持一致的主题状态
- 使用 localStorage 保存用户偏好

#### 3. 响应式设计
- 桌面版和移动端优化
- 分类卡片网格布局
- 搜索框移动端适配

### 🔧 技术改进

#### 1. Hugo 配置优化
```yaml
# 新增配置
mainSections: ['posts', 'notification-jar', 'aqua-inspiration']
enableEmoji: true
markup:
  tableOfContents:
    startLevel: 2
    endLevel: 4
    ordered: false
  goldmark:
    renderer:
      unsafe: true
  highlight:
    style: github
    codeFences: true
    lineNos: true
    copy: true
    anchorLineNos: true
    guessSyntax: true
    tabWidth: 2
    wrap: true
```

#### 2. 文件结构
```
content/
├── notification-jar/
│   ├── _index.md
│   └── 电子报订阅.md
├── aqua-inspiration/
│   └── _index.md
└── posts/
    ├── _index.md
    └── [所有文章...]

themes/dario/
├── layouts/
│   ├── index.html (更新)
│   ├── _default/
│   │   ├── single.html (更新)
│   │   ├── list.html (新增)
│   │   └── baseof.html (更新)
│   └── partials/
│       └── head.html (更新)
├── assets/
│   ├── css/default.css (大幅更新)
│   └── js/search.js (新增)
```

#### 3. 新增文件
- `themes/dario/layouts/_default/list.html` - 分类页面布局
- `themes/dario/assets/js/search.js` - 搜索功能脚本
- `content/notification-jar/_index.md` - 通知罐子分类页
- `content/aqua-inspiration/_index.md` - 水之灵感分类页
- `content/posts/_index.md` - 文章总览页

### 🐛 问题修复

1. **分类链接 404 问题**
   - 修复：使用 Hugo `relURL` 函数替代绝对路径
   - 从 `href="/notification-jar/"` 改为 `href="{{ "notification-jar/" | relURL }}"`

2. **主题切换不一致**
   - 修复：恢复 `colorScheme: toggle` 配置
   - 确保所有页面都有切换按钮

3. **引用块无样式**
   - 修复：添加完整的 blockquote CSS 样式
   - 包含左侧边框、缩进、斜体等

4. **TOC 功能缺失**
   - 修复：添加完整的 TOC 实现
   - 包含桌面侧边栏和移动端顶部显示

### 📱 用户体验改进

1. **导航优化**
   - 主页分类卡片清晰展示
   - 搜索功能便于内容查找
   - 文章目录快速定位

2. **视觉设计**
   - 统一的主题配色
   - 响应式布局适配
   - 流畅的交互动画

3. **内容组织**
   - 清晰的分类结构
   - 文章按分类归档
   - 便于内容管理

### 🚀 部署说明

1. **本地测试**
   ```bash
   hugo server -D
   ```

2. **部署到 GitHub Pages**
   ```bash
   git add .
   git commit -m "Add categories, search functionality, TOC, and emoji support"
   git push origin master
   ```

3. **验证功能**
   - 访问主页查看分类卡片
   - 测试搜索功能
   - 查看文章目录显示
   - 验证表情符号渲染

### 📋 待办事项

- [ ] 优化搜索算法，支持内容搜索
- [ ] 添加文章标签系统
- [ ] 实现文章归档页面
- [ ] 添加 RSS 订阅功能
- [ ] 优化移动端体验

---

**更新日期**: 2025-01-09  
**版本**: v2.0.0  
**更新类型**: 功能增强

---

## 2025-01-09 - 音频与分类更新（追加）

### 🎵 新增
- 新增短代码 `audio`（原生 `<audio>`），自动使用 `relURL`，适配子路径。
- 新增分类 `Podcast & Music`（`content/podcast-music/`）。

### ✅ 使用约定（后续一律采用）
- 音频放置于 `static/audio/`。
- 文章内引用使用相对路径（不以 `/` 开头），示例：
  `{{< audio src="audio/your-file.mp3" preload="metadata" >}}`
- 文件名使用英文和连字符，避免空格与特殊字符。

### 🔧 调整
- `themes/dario/layouts/shortcodes/audio.html`：
  - 使用 `relURL` 输出资源链接。
  - 自动按扩展名推断 MIME type，并添加无 type 备用 `<source>`。
- 首页链接统一使用 `relURL`（`link` 短代码）。

### 📄 受影响文件
- `themes/dario/layouts/shortcodes/audio.html`
- `themes/dario/layouts/shortcodes/link.html`
- `content/podcast-music/_index.md`
- `content/podcast-music/red-and-white-instrumental.md`
- `themes/dario/layouts/index.html`
- `content/_index.md`
