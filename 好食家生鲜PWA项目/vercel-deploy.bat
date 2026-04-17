@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   好食家生鲜PWA项目 - Vercel一键部署脚本
echo ========================================
echo.

echo [1/5] 检查必要文件...
if not exist "index.html" (
    echo ❌ 错误：找不到 index.html 文件
    echo 请确保在项目根目录运行此脚本
    pause
    exit /b 1
)

if not exist "manifest.json" (
    echo ❌ 错误：找不到 manifest.json 文件
    pause
    exit /b 1
)

if not exist "service-worker.js" (
    echo ❌ 错误：找不到 service-worker.js 文件
    pause
    exit /b 1
)

echo ✅ 所有必要文件检查通过
echo.

echo [2/5] 准备部署包...
if exist "deploy.zip" del /f /q deploy.zip
powershell -Command "Compress-Archive -Path '*' -DestinationPath 'deploy.zip' -Force"
if not exist "deploy.zip" (
    echo ❌ 错误：创建部署包失败
    pause
    exit /b 1
)

echo ✅ 部署包创建成功：deploy.zip
echo.

echo [3/5] 生成部署指南...
echo 请按照以下步骤手动部署到Vercel：
echo.
echo 步骤1：访问 https://vercel.com
echo 步骤2：注册/登录账号
echo 步骤3：点击 "New Project"
echo 步骤4：拖拽本文件夹到上传区域
echo 步骤5：配置项目信息：
echo       项目名称：haoshijia-pwa
echo       框架预设：Other 或 Static
echo       根目录：保持默认
echo 步骤6：点击 "Deploy"
echo.
echo 或者使用以下在线工具：
echo https://vercel.com/new/clone
echo.

echo [4/5] 验证项目结构...
echo 项目包含以下文件：
dir /b /a-d
echo.
echo 子文件夹：
dir /b /ad
echo.

echo [5/5] 生成快速测试链接...
echo 部署完成后，请测试以下功能：
echo.
echo 1. 访问您的部署URL
echo 2. 手机端添加到主屏幕
echo 3. 测试首页轮播图
echo 4. 测试分类页面
echo 5. 测试招商入驻表单
echo 6. 测试离线访问
echo.

echo ========================================
echo   部署准备完成！
echo ========================================
echo.
echo 📁 项目文件夹：%cd%
echo 📦 部署包：deploy.zip
echo 📄 部署指南：一键部署指南.html
echo 📋 详细文档：DEPLOYMENT.md
echo.
echo 🚀 下一步操作：
echo 1. 打开「一键部署指南.html」查看详细步骤
echo 2. 访问 vercel.com 开始部署
echo 3. 部署完成后测试所有功能
echo.
echo 💡 提示：如果遇到问题，请查看 DEPLOYMENT.md 中的故障排除部分
echo.

pause