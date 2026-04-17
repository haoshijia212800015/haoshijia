// 好食家生鲜平台 - Service Worker 注册

/**
 * 注册 Service Worker
 */
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            // 检查当前页面是否使用HTTPS（PWA要求）
            if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
                console.warn('PWA需要HTTPS环境，当前为:', window.location.protocol);
                return;
            }
            
            // 注册 Service Worker
            const registration = await navigator.serviceWorker.register('/service-worker.js', {
                scope: '/',
                updateViaCache: 'none' // 不缓存Service Worker本身
            });
            
            console.log('Service Worker 注册成功:', registration);
            
            // 监听 Service Worker 更新
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('发现 Service Worker 更新:', newWorker);
                
                newWorker.addEventListener('statechange', () => {
                    console.log('Service Worker 状态变化:', newWorker.state);
                    
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // 新版本已安装，提示用户刷新
                        showUpdateNotification();
                    }
                });
            });
            
            // 检查是否有等待的 Service Worker
            if (registration.waiting) {
                showUpdateNotification();
            }
            
            // 监听控制器变化
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('Service Worker 控制器已变更');
                window.location.reload();
            });
            
            return registration;
            
        } catch (error) {
            console.error('Service Worker 注册失败:', error);
            return null;
        }
    } else {
        console.warn('当前浏览器不支持 Service Worker');
        return null;
    }
}

/**
 * 显示更新通知
 */
function showUpdateNotification() {
    if (window.confirm('发现新版本，是否立即更新？')) {
        // 发送消息给等待的 Service Worker，触发更新
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                action: 'skipWaiting'
            });
        }
    }
}

/**
 * 检查 Service Worker 状态
 */
async function checkServiceWorkerStatus() {
    if (!('serviceWorker' in navigator)) {
        return {
            supported: false,
            message: '浏览器不支持 Service Worker'
        };
    }
    
    try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        const registration = registrations[0];
        
        if (!registration) {
            return {
                supported: true,
                registered: false,
                message: 'Service Worker 未注册'
            };
        }
        
        const worker = registration.active || registration.waiting || registration.installing;
        
        return {
            supported: true,
            registered: true,
            scope: registration.scope,
            state: worker?.state || 'unknown',
            scriptURL: worker?.scriptURL || 'unknown',
            message: `Service Worker 状态: ${worker?.state || 'unknown'}`
        };
        
    } catch (error) {
        return {
            supported: true,
            error: true,
            message: `检查 Service Worker 状态失败: ${error.message}`
        };
    }
}

/**
 * 清除 Service Worker 缓存
 */
async function clearServiceWorkerCache() {
    if (!('serviceWorker' in navigator)) {
        return { success: false, message: '浏览器不支持 Service Worker' };
    }
    
    try {
        // 获取所有缓存
        const cacheNames = await caches.keys();
        console.log('找到缓存:', cacheNames);
        
        // 删除所有缓存
        await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
        );
        
        // 取消注册所有 Service Worker
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
            registrations.map(registration => registration.unregister())
        );
        
        console.log('Service Worker 缓存已清除');
        return { success: true, message: '缓存已清除' };
        
    } catch (error) {
        console.error('清除缓存失败:', error);
        return { success: false, message: `清除失败: ${error.message}` };
    }
}

/**
 * 发送消息给 Service Worker
 * @param {object} message - 消息内容
 */
function sendMessageToServiceWorker(message) {
    if (!navigator.serviceWorker.controller) {
        console.warn('没有活跃的 Service Worker 控制器');
        return;
    }
    
    navigator.serviceWorker.controller.postMessage(message);
}

/**
 * 检查离线功能支持
 */
function checkOfflineSupport() {
    return {
        serviceWorker: 'serviceWorker' in navigator,
        cache: 'caches' in window,
        indexedDB: 'indexedDB' in window,
        localStorage: 'localStorage' in window,
        backgroundSync: 'sync' in registration || false,
        pushNotifications: 'PushManager' in window && 'Notification' in window
    };
}

/**
 * 初始化 Service Worker 相关功能
 */
async function initServiceWorkerFeatures() {
    console.log('初始化 Service Worker 功能...');
    
    // 检查支持情况
    const support = checkOfflineSupport();
    console.log('离线功能支持:', support);
    
    if (!support.serviceWorker) {
        console.warn('当前浏览器不支持 Service Worker，离线功能不可用');
        return;
    }
    
    // 注册 Service Worker
    const registration = await registerServiceWorker();
    
    if (!registration) {
        console.warn('Service Worker 注册失败，离线功能不可用');
        return;
    }
    
    // 检查后台同步支持
    if ('sync' in registration) {
        console.log('后台同步功能可用');
        
        // 注册后台同步标签
        try {
            await registration.sync.register('sync-form-data');
            console.log('后台同步标签已注册');
        } catch (error) {
            console.warn('注册后台同步标签失败:', error);
        }
    }
    
    // 检查推送通知支持
    if ('PushManager' in window && 'Notification' in window) {
        console.log('推送通知功能可用');
        
        // 请求通知权限
        const permission = await Notification.requestPermission();
        console.log('通知权限状态:', permission);
    }
    
    return registration;
}

/**
 * 发送推送通知
 * @param {string} title - 通知标题
 * @param {object} options - 通知选项
 */
async function sendPushNotification(title, options = {}) {
    if (!('Notification' in window)) {
        console.warn('浏览器不支持通知');
        return false;
    }
    
    if (Notification.permission !== 'granted') {
        console.warn('通知权限未授予');
        return false;
    }
    
    try {
        const notification = new Notification(title, {
            icon: '/images/icons/icon-192x192.png',
            badge: '/images/icons/icon-72x72.png',
            ...options
        });
        
        notification.onclick = () => {
            console.log('通知被点击');
            window.focus();
            notification.close();
        };
        
        return true;
    } catch (error) {
        console.error('发送通知失败:', error);
        return false;
    }
}

/**
 * 检查更新
 */
async function checkForUpdates() {
    if (!('serviceWorker' in navigator)) {
        return;
    }
    
    try {
        const registration = await navigator.serviceWorker.ready;
        
        // 强制更新 Service Worker
        await registration.update();
        console.log('已检查更新');
        
    } catch (error) {
        console.error('检查更新失败:', error);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async () => {
    console.log('初始化 Service Worker...');
    
    // 等待页面完全加载
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 初始化 Service Worker 功能
    const registration = await initServiceWorkerFeatures();
    
    if (registration) {
        console.log('Service Worker 功能初始化完成');
        
        // 定期检查更新（每24小时）
        setInterval(checkForUpdates, 24 * 60 * 60 * 1000);
        
        // 监听在线状态变化，重新尝试同步
        window.addEventListener('online', async () => {
            console.log('网络恢复，尝试同步数据');
            
            if ('sync' in registration) {
                try {
                    await registration.sync.register('sync-form-data');
                    console.log('网络恢复后同步已触发');
                } catch (error) {
                    console.warn('触发同步失败:', error);
                }
            }
        });
    }
});

// 导出全局函数
window.serviceWorker = {
    registerServiceWorker,
    checkServiceWorkerStatus,
    clearServiceWorkerCache,
    sendMessageToServiceWorker,
    checkOfflineSupport,
    sendPushNotification,
    checkForUpdates
};