# 好食家生鲜平台 - 部署指南

本文档详细说明如何将好食家生鲜PWA项目部署到各种平台。

## 部署前提

### 必要条件
1. **HTTPS环境**：PWA必须运行在HTTPS环境下（localhost开发环境除外）
2. **现代浏览器**：Chrome 50+、Firefox 48+、Safari 11.1+、Edge 79+
3. **静态文件托管**：支持HTTPS的静态文件托管服务

### 推荐配置
- 域名：建议使用自定义域名（如 haoshijia.com）
- CDN：建议使用CDN加速静态资源
- SSL证书：有效的SSL证书（Let's Encrypt免费）

## 部署步骤

### 方法一：Vercel部署（最简单，推荐）

#### 步骤
1. **注册账号**：访问 [vercel.com](https://vercel.com) 注册账号
2. **创建项目**：点击 "New Project"
3. **导入项目**：
   - 选择 "Import Git Repository"（如果项目在GitHub）
   - 或拖拽项目文件夹到上传区域
4. **配置项目**：
   - 项目名称：`haoshijia-pwa`
   - 框架预设：选择 "Other" 或 "Static"
   - 根目录：保持默认
5. **部署**：点击 "Deploy"
6. **访问**：部署完成后，访问生成的URL（如 `https://haoshijia-pwa.vercel.app`）

#### Vercel优势
- 自动HTTPS
- 全球CDN
- 自动部署（Git push触发）
- 免费套餐足够使用

### 方法二：Netlify部署

#### 步骤
1. **注册账号**：访问 [netlify.com](https://netlify.com) 注册账号
2. **拖拽部署**：
   - 登录后进入控制台
   - 拖拽项目文件夹到 "Drag and drop your site folder here"
3. **自动部署**：Netlify会自动检测并部署
4. **配置域名**：
   - 进入站点设置 → Domain management
   - 可以设置自定义域名
5. **访问**：使用Netlify提供的子域名或自定义域名

#### Netlify配置
在项目根目录创建 `netlify.toml`：
```toml
[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 方法三：GitHub Pages部署

#### 步骤
1. **创建仓库**：在GitHub创建新仓库（如 `haoshijia-pwa`）
2. **上传文件**：将所有项目文件上传到仓库
3. **启用Pages**：
   - 进入仓库设置 → Pages
   - Source：选择分支（如 `main`）
   - Folder：选择 `/`（根目录）
4. **等待部署**：GitHub会自动部署，生成URL
5. **自定义域名**（可选）：
   - 在Pages设置中添加自定义域名
   - 在域名服务商添加CNAME记录

#### 注意事项
- GitHub Pages默认使用HTTPS
- 免费用户仓库需公开
- 部署可能需要几分钟

### 方法四：传统服务器部署

#### 步骤
1. **准备服务器**：
   - Linux服务器（Ubuntu/CentOS）
   - 安装Nginx或Apache
   - 配置SSL证书
2. **上传文件**：将项目文件上传到服务器
3. **配置Web服务器**：

**Nginx配置示例**：
```nginx
server {
    listen 80;
    server_name haoshijia.com www.haoshijia.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name haoshijia.com www.haoshijia.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    root /var/www/haoshijia;
    index index.html;
    
    # PWA支持
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "public, max-age=3600";
    }
    
    # Service Worker需要无缓存
    location /service-worker.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        expires 0;
    }
    
    # 静态资源缓存
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

4. **重启服务**：
```bash
sudo systemctl restart nginx
```

## 手机端安装指南

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

### 安装提示
- 应用会自动显示安装提示（需用户交互后）
- 可以手动触发：点击页面中的"安装应用"按钮
- 安装后应用会以独立窗口运行

## 验证PWA功能

### 使用Chrome DevTools验证
1. 打开Chrome DevTools（F12）
2. 进入 "Application" 标签页
3. 检查以下项目：
   - Manifest：是否正确加载
   - Service Workers：是否注册成功
   - Cache Storage：是否有缓存内容
   - Lighthouse：运行PWA审计

### Lighthouse审计
1. 在Chrome DevTools中打开Lighthouse
2. 选择 "PWA" 审计项
3. 运行审计，确保所有项目通过

### 离线测试
1. 在Chrome DevTools中进入 "Network" 标签页
2. 选择 "Offline" 模式
3. 刷新页面，检查是否能正常显示
4. 测试不同页面的离线访问

## 常见问题解决

### 问题1：Service Worker注册失败
**可能原因**：
- 非HTTPS环境（localhost除外）
- Service Worker文件路径错误
- 浏览器不支持

**解决方案**：
1. 确保使用HTTPS
2. 检查 `service-worker.js` 文件路径
3. 检查浏览器控制台错误信息

### 问题2：无法添加到主屏幕
**可能原因**：
- Manifest配置错误
- 未满足PWA安装条件
- 浏览器限制

**解决方案**：
1. 检查 `manifest.json` 格式
2. 确保用户与网站有足够交互
3. 使用Chrome的"添加到主屏幕"功能测试

### 问题3：离线功能不工作
**可能原因**：
- Service Worker缓存策略问题
- 资源未正确缓存
- 缓存版本冲突

**解决方案**：
1. 检查Service Worker缓存逻辑
2. 清除浏览器缓存重新测试
3. 更新Service Worker版本号

### 问题4：页面加载慢
**可能原因**：
- 图片未优化
- 未使用CDN
- 服务器响应慢

**解决方案**：
1. 压缩图片资源
2. 启用CDN加速
3. 使用浏览器缓存

## 性能优化建议

### 1. 图片优化
- 使用WebP格式
- 实现图片懒加载
- 使用响应式图片

### 2. 代码优化
- 压缩CSS/JS文件
- 使用代码分割
- 移除未使用代码

### 3. 缓存策略
- 静态资源长期缓存
- API请求合理缓存
- Service Worker智能缓存

### 4. CDN加速
- 使用全球CDN
- 启用HTTP/2
- 配置Gzip压缩

## 监控和维护

### 监控指标
1. **性能监控**：
   - 首次内容绘制（FCP）
   - 最大内容绘制（LCP）
   - 累积布局偏移（CLS）

2. **业务监控**：
   - 日活跃用户（DAU）
   - 安装率
   - 表单提交成功率

3. **错误监控**：
   - JavaScript错误
   - 网络请求失败
   - Service Worker错误

### 定期维护
1. **更新内容**：定期更新商品和轮播图
2. **检查链接**：确保所有链接有效
3. **测试功能**：定期测试核心功能
4. **备份数据**：定期备份本地存储数据

## 扩展开发

### 添加新功能
1. **购物车功能**：扩展 `js/app.js` 中的购物车逻辑
2. **用户系统**：添加登录注册功能
3. **支付集成**：集成微信支付/支付宝
4. **消息推送**：使用Web Push API

### 对接后端API
项目已预留API接口位置：
- 商品数据API：`/api/products`
- 表单提交API：`/api/join`
- 用户API：`/api/user`

### 多语言支持
可以添加多语言文件，实现国际化。

## 安全建议

1. **HTTPS强制**：确保所有流量使用HTTPS
2. **CSP配置**：添加内容安全策略
3. **输入验证**：所有用户输入都要验证
4. **XSS防护**：防止跨站脚本攻击
5. **CSRF防护**：添加CSRF令牌

## 联系方式

如有部署问题，请联系：
- 邮箱：support@haoshijia.com
- 电话：400-888-8888
- 文档：https://docs.haoshijia.com

---

**祝您部署顺利！** 🚀