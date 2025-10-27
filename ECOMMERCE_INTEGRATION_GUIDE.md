# AQUA IN JAR 电商功能集成指南

## 🎯 已完成的配置

### ✅ 基础结构
- **商店页面**：`content/shop/_index.md` - 商店首页
- **商品页面**：`content/shop/aqua-inspiration-collection.md` - 示例商品
- **购买按钮**：`layouts/shortcodes/buy-button.html` - 购买按钮短代码
- **商品列表**：`layouts/section/shop.html` - 商品展示模板
- **导航配置**：已添加shop到主导航菜单

### ✅ 功能特性
- 响应式商品网格布局
- 多种支付方式支持
- 商品分类和标签系统
- 精选商品标识
- 移动端优化

---

## 🛒 支付系统集成方案（微信支付宝）

### 方案一：微信支付（推荐）

**优势**：
- 中国用户使用率高
- 支付流程简单
- 无需复杂配置
- 支持二维码支付

**集成步骤**：
1. 打开微信"收付款"功能
2. 生成收款二维码
3. 保存为`wechat-qr.jpg`
4. 放入`static/images/payment/`目录

**费用**：无手续费

### 方案二：支付宝支付

**优势**：
- 用户信任度高
- 支付安全可靠
- 支持多种支付方式
- 移动支付友好

**集成步骤**：
1. 打开支付宝"收钱"功能
2. 生成收款二维码
3. 保存为`alipay-qr.jpg`
4. 放入`static/images/payment/`目录

**费用**：无手续费

### 方案三：组合支付

**优势**：
- 覆盖更多用户群体
- 提供多种选择
- 提高支付成功率

**实现方式**：
- 同时提供微信和支付宝选项
- 用户可根据习惯选择

---

## 📝 添加新商品的步骤

### 1. 创建商品页面

在`content/shop/`目录下创建新的Markdown文件：

```markdown
---
title: "商品名称"
subtitle: "商品副标题"
description: "商品描述"
price: "99.00"
currency: "CNY"
category: "数字产品"
tags: ["标签1", "标签2"]
draft: false
featured: true
images:
  - "images/products/product-image.jpg"
---

## 商品详情内容

### 购买按钮
{{< buy-button 
    product="商品名称"
    price="99.00"
    currency="CNY"
    description="商品描述"
>}}
```

### 2. 添加商品图片

将商品图片放入`static/images/products/`目录

### 3. 配置支付链接

更新`layouts/shortcodes/buy-button.html`中的支付链接

---

## 🎨 自定义样式

### 修改商品卡片样式

编辑`layouts/section/shop.html`中的CSS部分

### 修改购买按钮样式

编辑`layouts/shortcodes/buy-button.html`中的样式

---

## 📊 商品管理

### 商品状态控制
- `draft: true` - 草稿状态，不会显示在商店中
- `featured: true` - 精选商品，会显示"精选"标识

### 商品分类
- 数字产品
- 实体商品
- 服务

### 价格设置
- 支持多种货币
- 自动格式化显示

---

## 🔧 技术实现细节

### 短代码使用
```markdown
{{< buy-button 
    product="商品名称"
    price="价格"
    currency="货币"
    description="描述"
>}}
```

### 商品页面结构
- Front Matter：商品元数据
- 内容：商品详细介绍
- 购买按钮：使用短代码

### 响应式设计
- 移动端优化
- 触摸友好的按钮
- 自适应布局

---

## 🚀 下一步操作

1. **选择支付系统**：推荐先使用Gumroad测试
2. **创建真实商品**：替换示例商品
3. **配置支付链接**：更新购买按钮
4. **测试购买流程**：确保支付正常
5. **优化用户体验**：根据反馈调整

---

## 📞 技术支持

如有任何问题，请联系：
- 📧 邮箱：aqutikri@gmail.com
- 📱 微信：扫描二维码

---

*最后更新：2025年1月*
