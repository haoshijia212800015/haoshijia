// 好食家生鲜平台 - Service Worker
// 版本: v1.0.0
// 缓存名称（每次更新需要修改版本号）
const CACHE_NAME = 'haoshijia-cache-v1.0.0';

// 需要缓存的资源列表
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  
  // CSS 文件
  '/css/style.css',
  '/css/responsive.css',
  
  // JavaScript 文件
  '/js/app.js',
  '/js/utils.js',
  '/js/sw-register.js',
  
  // 图标文件
  '/images/icons/icon-72x72.png',
  '/images/icons/icon-96x96.png',
  '/images/icons/icon-128x128.png',
  '/images/icons/icon-144x144.png',
  '/images/icons/icon-152x152.png',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-384x384.png',
  '/images/icons/icon-512x512.png',
  
  // 轮播图（占位图）
  '/images/banners/banner1.jpg',
  '/images/banners/banner2.jpg',
  '/images/banners/banner3.jpg',
  
  // 商品图片（占位图）
  '/images/products/product1.jpg',
  '/images/products/product2.jpg',
  '/images/products/product3.jpg'
];

// 安装事件 - 缓存资源
self.addEventListener('install', event => {
  console.log('[Service Worker] 安装中...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] 正在缓存应用资源');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[Service Worker] 所有资源已缓存');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[Service Worker] 缓存失败:', error);
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
  console.log('[Service Worker] 激活中...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 删除旧版本的缓存
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] 删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] 已清理旧缓存');
      return self.clients.claim();
    })
  );
});

// 获取事件 - 网络优先，失败时使用缓存
self.addEventListener('fetch', event => {
  // 跳过非GET请求
  if (event.request.method !== 'GET') return;
  
  // 跳过浏览器扩展请求
  if (event.request.url.startsWith('chrome-extension://')) return;
  
  // 对于API请求，使用网络优先策略
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // 克隆响应，因为响应只能使用一次
          const responseClone = response.clone();
          
          // 缓存API响应（可选，根据需求调整）
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          
          return response;
        })
        .catch(() => {
          // 网络失败时，尝试从缓存获取
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // 对于静态资源，使用缓存优先策略
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          console.log('[Service Worker] 从缓存获取:', event.request.url);
          return cachedResponse;
        }
        
        // 缓存中没有，从网络获取
        return fetch(event.request)
          .then(response => {
            // 检查响应是否有效
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // 克隆响应，因为响应只能使用一次
            const responseToCache = response.clone();
            
            // 将新资源添加到缓存
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(error => {
            console.error('[Service Worker] 获取失败:', error);
            
            // 如果是HTML页面请求失败，返回离线页面
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html');
            }
            
            // 其他资源返回占位图或空响应
            if (event.request.url.match(/\.(jpg|jpeg|png|gif)$/)) {
              return caches.match('/images/icons/icon-192x192.png');
            }
            
            return new Response('网络连接失败，请检查网络设置', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// 后台同步事件（需要浏览器支持）
self.addEventListener('sync', event => {
  console.log('[Service Worker] 后台同步:', event.tag);
  
  if (event.tag === 'sync-form-data') {
    event.waitUntil(syncFormData());
  }
});

// 推送通知事件
self.addEventListener('push', event => {
  console.log('[Service Worker] 收到推送通知');
  
  const options = {
    body: event.data ? event.data.text() : '好食家生鲜平台有新消息',
    icon: '/images/icons/icon-192x192.png',
    badge: '/images/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'explore',
        title: '查看商品',
        icon: '/images/icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: '关闭',
        icon: '/images/icons/icon-72x72.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('好食家生鲜', options)
  );
});

// 通知点击事件
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] 通知被点击');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    // 点击"查看商品"按钮
    event.waitUntil(
      clients.openWindow('/#category/all')
    );
  } else {
    // 点击通知主体
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// 同步表单数据函数
function syncFormData() {
  return new Promise((resolve, reject) => {
    // 这里可以实现将本地存储的表单数据同步到服务器
    console.log('[Service Worker] 正在同步表单数据...');
    
    // 模拟同步过程
    setTimeout(() => {
      console.log('[Service Worker] 表单数据同步完成');
      resolve();
    }, 1000);
  });
}

// 监听消息事件（从页面发送到Service Worker）
self.addEventListener('message', event => {
  console.log('[Service Worker] 收到消息:', event.data);
  
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data.action === 'clearCache') {
    caches.delete(CACHE_NAME)
      .then(success => {
        console.log('[Service Worker] 缓存已清除');
      });
  }
});

// 错误处理
self.addEventListener('error', event => {
  console.error('[Service Worker] 错误:', event.error);
});

// 未处理的Promise拒绝
self.addEventListener('unhandledrejection', event => {
  console.error('[Service Worker] 未处理的Promise拒绝:', event.reason);
});