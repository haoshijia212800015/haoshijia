# 好食家生鲜平台 - PWA项目

这是一个完整的移动端PWA（渐进式Web应用）项目，专为「好食家」生鲜平台设计。项目包含所有必要的PWA配置文件，可直接部署到静态托管平台。

## 项目结构

```
好食家生鲜PWA项目/
├── index.html              # 主页面
├── manifest.json           # PWA应用清单
├── service-worker.js       # 服务工作线程（离线缓存）
├── robots.txt             # 搜索引擎爬虫配置
├── css/
│   ├── style.css          # 主样式文件
│   └── responsive.css     # 响应式样式
├── js/
│   ├── app.js             # 主应用逻辑
│   ├── sw-register.js     # 服务工作线程注册
│   └── utils.js           # 工具函数
├── images/
│   ├── icons/             # PWA图标
│   │   ├── icon-192x192.png
│   │   └── icon-512x512.png
│   ├── banners/           # 轮播图
│   │   ├── banner1.jpg
│   │   ├── banner2.jpg
│   │   └── banner3.jpg
│   └── products/          # 商品图片
│       ├── product1.jpg
│       ├── product2.jpg
│       └── product3.jpg
└── README.md              # 项目说明
```

## 功能特性

### 核心功能
1. **完整的PWA支持** - 可添加到主屏幕、离线访问、独立应用体验
2. **移动端优先设计** - 完美适配375px-430px屏幕
3. **生鲜平台核心页面**：
   - 首页：轮播图、分类导航、商品推荐
   - 分类页：商品分类展示和筛选
   - 招商入驻页：合作表单提交

### 技术特点
- 无需构建工具，直接部署
- 模块化代码结构，便于扩展
- 响应式设计，支持深色模式
- 本地存储支持，为后端对接预留接口

## 部署步骤

### 方法一：Vercel部署（推荐）
1. 访问 [vercel.com](https://vercel.com) 并登录
2. 点击 "New Project"
3. 拖拽项目文件夹到上传区域
4. Vercel会自动检测并部署
5. 部署完成后，访问生成的URL即可

### 方法二：Netlify部署
1. 访问 [netlify.com](https://netlify.com) 并登录
2. 拖拽项目文件夹到 "Drag and drop your site folder here"
3. Netlify会自动部署并生成URL

### 方法三：GitHub Pages部署
1. 在GitHub创建新仓库
2. 上传所有项目文件
3. 进入仓库设置 → Pages
4. 选择分支（通常是main）和根目录
5. 保存后等待部署完成

## 手机端安装使用

### iOS设备（Safari浏览器）
1. 使用Safari访问部署后的URL
2. 点击底部分享按钮（方框带向上箭头）
3. 滑动找到并点击"添加到主屏幕"
4. 确认名称后点击"添加"
5. 主屏幕会出现「好食家」应用图标

### Android设备（Chrome浏览器）
1. 使用Chrome访问部署后的URL
2. 点击右上角菜单（三个点）
3. 选择"添加到主屏幕"或"安装应用"
4. 确认名称后点击"添加"
5. 主屏幕会出现「好食家」应用图标

## 后期扩展功能预留

项目代码已为以下功能预留接口：

### 购物相关
- 购物车功能（`js/cart.js`预留）
- 下单支付接口（`js/payment.js`预留）
- 订单管理页面（`orders.html`预留）

### 商家功能
- 餐馆供货批量下单
- 批发价格展示
- 供应商后台管理

### 用户系统
- 会员体系（`js/user.js`预留）
- 积分和优惠券
- 消息推送（Notification API已集成）

## 自定义配置

### 修改应用信息
编辑 `manifest.json`：
- `name`: 应用名称
- `short_name`: 短名称
- `theme_color`: 主题色
- `background_color`: 启动背景色

### 更新图标
替换 `images/icons/` 目录下的图标文件，保持相同文件名和尺寸

### 修改商品数据
编辑 `js/app.js` 中的 `productsData` 数组

### 更新轮播图
替换 `images/banners/` 目录下的图片文件

## 浏览器支持
- Chrome 50+ ✅
- Firefox 48+ ✅
- Safari 11.1+ ✅
- Edge 79+ ✅

## 许可证
本项目仅供「好食家」生鲜平台使用，未经许可不得用于商业用途。

## 技术支持
如有部署或使用问题，请检查：
1. 是否使用HTTPS（PWA必须使用HTTPS）
2. 是否所有文件路径正确
3. 浏览器是否支持PWA功能
4. 是否已清除浏览器缓存测试