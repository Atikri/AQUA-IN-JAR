---
date: "2025-01-27"
title: "视频播放测试"
draft: false
---

# 视频播放测试页面

这个页面用于测试视频文件是否能正常播放。

## 测试视频1：墙纸 (19.75MB)

<video controls preload="metadata" style="width:100%;max-width:960px;border-radius:8px">
  <source src="/videos/wallpaper.mp4" type="video/mp4">
  您的浏览器不支持视频播放。
</video>

## 测试视频2：小文件测试 (2.22MB)

<video controls preload="metadata" style="width:100%;max-width:960px;border-radius:8px">
  <source src="/videos/wedding1.mp4" type="video/mp4">
  您的浏览器不支持视频播放。
</video>

## 测试视频3：中等文件 (6.27MB)

<video controls preload="metadata" style="width:100%;max-width:960px;border-radius:8px">
  <source src="/videos/wedding2.mp4" type="video/mp4">
  您的浏览器不支持视频播放。
</video>

## 诊断信息

如果视频无法播放，可能的原因：

1. **文件大小过大**：GitHub Pages对单个文件有大小限制
2. **MIME类型问题**：服务器可能无法正确识别MP4文件
3. **网络问题**：大文件加载可能被限制
4. **浏览器兼容性**：某些浏览器可能不支持特定格式

## 解决方案

1. **压缩视频文件**：使用提供的PowerShell脚本
2. **使用外部托管**：上传到YouTube或Vimeo
3. **检查网络连接**：确保网络稳定
4. **清除浏览器缓存**：强制刷新页面
