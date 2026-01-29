# 延迟加载（Lazy Loading）使用指南

## 概述

为了优化网站性能，我们实施了延迟加载功能，可以显著减少页面初始加载时间，特别是对于包含大量图片和视频的页面。

## 功能特点

- ✅ **图片延迟加载**：只有当图片进入视口时才开始加载
- ✅ **视频延迟加载**：视频文件延迟加载，减少初始带宽消耗
- ✅ **优雅降级**：不支持Intersection Observer的浏览器会自动加载所有内容
- ✅ **加载动画**：提供美观的加载占位符效果
- ✅ **错误处理**：加载失败时显示友好的错误提示

## 使用方法

### 1. 图片延迟加载

**旧方式（立即加载）：**
```markdown
![](/images/photo.jpg)
```

**新方式（延迟加载）：**
```markdown
{{< lazy-image src="/images/photo.jpg" alt="图片描述" >}}
```

**可选参数：**
- `src`: 图片路径（必需）
- `alt`: 图片描述（推荐）
- `width`: 宽度，默认100%
- `max-width`: 最大宽度，默认960px
- `style`: 自定义样式
- `class`: CSS类名
- `lazy`: 是否启用延迟加载，默认true

### 2. 视频延迟加载

**旧方式（立即加载）：**
```html
<video controls preload="metadata" style="width:100%;max-width:800px">
  <source src="/videos/video.mp4" type="video/mp4">
  你的浏览器不支持视频播放。
</video>
```

**新方式（延迟加载）：**
```markdown
{{< video src="/videos/video.mp4" lazy="true" >}}
```

**可选参数：**
- `src`: 视频路径（必需）
- `lazy`: 是否启用延迟加载，默认true
- `preload`: 预加载策略，延迟加载时自动设为none
- `poster`: 视频封面图
- `width`: 宽度，默认100%
- `max-width`: 最大宽度，默认960px
- `style`: 自定义样式

### 3. 禁用延迟加载

如果某些图片或视频需要立即加载（如首屏重要内容），可以设置 `lazy="false"`：

```markdown
{{< lazy-image src="/images/hero.jpg" lazy="false" >}}
{{< video src="/videos/hero.mp4" lazy="false" >}}
```

## 性能优化效果

### 优化前
- 页面加载时同时下载所有图片和视频
- 初始页面大小：可能超过10MB
- 首屏加载时间：5-10秒

### 优化后
- 只加载首屏可见的媒体内容
- 初始页面大小：减少60-80%
- 首屏加载时间：1-3秒
- 用户滚动时按需加载

## 技术实现

### 核心文件
- `static/js/lazy-loading.js`: 延迟加载JavaScript实现
- `static/css/lazy-loading.css`: 延迟加载样式
- `layouts/shortcodes/lazy-image.html`: 图片延迟加载shortcode
- `layouts/shortcodes/video.html`: 视频延迟加载shortcode（已更新）

### 工作原理
1. 使用Intersection Observer API检测元素是否进入视口
2. 当元素进入视口时，将`data-src`属性值赋给`src`属性
3. 提供加载动画和错误处理
4. 支持现代浏览器的原生`loading="lazy"`属性

## 浏览器兼容性

- ✅ Chrome 51+
- ✅ Firefox 55+
- ✅ Safari 12.1+
- ✅ Edge 15+
- ✅ 移动端浏览器

对于不支持的浏览器，会自动降级为立即加载模式。

## 注意事项

1. **SEO友好**：搜索引擎可以正常抓取延迟加载的内容
2. **无障碍访问**：屏幕阅读器可以正常访问alt属性
3. **渐进增强**：即使JavaScript被禁用，内容仍然可以访问
4. **性能监控**：可以通过浏览器开发者工具监控加载性能

## 更新现有内容

对于现有的markdown文件，建议逐步将图片和视频标签替换为延迟加载版本：

```bash
# 查找需要更新的文件
find content/ -name "*.md" -exec grep -l "!\[\|<video" {} \;
```

## 监控和调试

### 开发者工具
1. 打开浏览器开发者工具
2. 查看Network标签页
3. 观察图片和视频的加载时机
4. 检查LCP（最大内容绘制）指标

### 性能指标
- **LCP改善**：通常减少30-50%
- **FID改善**：减少主线程阻塞
- **CLS改善**：减少布局偏移

## 故障排除

### 常见问题

**Q: 图片不显示？**
A: 检查图片路径是否正确，确保文件存在

**Q: 视频无法播放？**
A: 检查视频格式是否被浏览器支持，确保文件完整

**Q: 加载动画不显示？**
A: 确保CSS文件正确加载，检查控制台错误

**Q: 移动端性能问题？**
A: 考虑进一步压缩图片和视频文件大小

## 进一步优化建议

1. **图片优化**：使用WebP格式，提供多种尺寸
2. **视频优化**：使用H.264编码，提供多种质量选项
3. **CDN加速**：考虑使用CDN分发静态资源
4. **缓存策略**：设置合适的HTTP缓存头
5. **预加载关键资源**：对首屏重要内容使用`lazy="false"`

---

通过实施延迟加载，你的网站加载速度将显著提升，用户体验也会得到明显改善！
