# 好食家部署指南

## 🚀 快速部署到GitHub Pages

### 第一步：注册GitHub账号
1. 访问 https://github.com/signup
2. 用户名：`美食家` (如果被占用，可以加数字如 `美食家123`)
3. 用常用邮箱注册
4. 完成邮箱验证

### 第二步：创建仓库
1. 登录GitHub
2. 点击右上角"+" → "New repository"
3. 仓库名称：`haoshijia`
4. 描述：`好食家 - 智能饮食助手`
5. 选择"Public"（公开）
6. 勾选"Add a README file"
7. 点击"Create repository"

### 第三步：上传文件
1. 进入刚创建的仓库
2. 点击"Add file" → "Upload files"
3. 上传以下文件：
   - `index.html` (主应用文件)
   - `README.md` (说明文档)
   - `CNAME` (自定义域名配置，可选)
   - `.nojekyll` (禁用Jekyll)
4. 点击"Commit changes"

### 第四步：启用GitHub Pages
1. 进入仓库 → "Settings"
2. 左侧找到"Pages"
3. 在"Source"选择"Deploy from a branch"
4. 在"Branch"选择"main"分支，文件夹选择"/ (root)"
5. 点击"Save"
6. 等待1-2分钟，刷新页面

### 第五步：获得公开网址
部署成功后，你会看到：
```
Your site is published at https://美食家.github.io/haoshijia/
```

## 🌐 访问应用
- 手机访问：https://美食家.github.io/haoshijia/
- 电脑访问：https://美食家.github.io/haoshijia/

## 📱 添加到主屏幕

### iPhone用户
1. 用Safari浏览器打开网址
2. 点击分享按钮（📤）
3. 选择"添加到主屏幕"
4. 命名"好食家"
5. 点击"添加"

### Android用户
1. 用Chrome浏览器打开网址
2. 点击菜单（三个点）
3. 选择"添加到主屏幕"
4. 确认添加

## 🔧 更新应用
如果需要更新应用：
1. 修改 `index.html` 文件
2. 重新上传到GitHub仓库
3. GitHub Pages会自动更新
4. 用户访问时会看到最新版本

## 📊 访问统计
GitHub Pages不提供访问统计，但可以：
1. 使用Google Analytics（免费）
2. 使用百度统计（免费）
3. 使用Vercel/Netlify的统计功能

## 🛡️ 安全建议
1. 定期备份代码
2. 使用HTTPS（GitHub Pages自动提供）
3. 不要存储用户敏感信息
4. 定期更新依赖（如果有）

## 💰 成本
- GitHub Pages：完全免费
- 域名（可选）：约¥50/年
- 总成本：¥0-50/年

## 🆘 常见问题

### Q: 网址无法访问？
A: 检查：
1. GitHub Pages是否已启用
2. 仓库名称是否正确
3. 等待几分钟让DNS生效

### Q: 如何自定义域名？
A: 
1. 购买域名（如 haoshijia.com）
2. 在域名DNS设置中添加CNAME记录
3. 在GitHub Pages设置中填写自定义域名
4. 等待DNS生效（最多48小时）

### Q: 如何让更多人知道？
A:
1. 分享网址给朋友
2. 在社交媒体分享
3. 优化SEO（已内置基础SEO）
4. 口碑传播

## 📞 支持
如有问题，请：
1. 查看GitHub Issues
2. 联系开发者
3. 参考GitHub Pages文档

---

**部署完成！现在任何人都可以通过手机访问你的应用了！** 🎉