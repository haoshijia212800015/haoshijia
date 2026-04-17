// 好食家生鲜平台 - 主应用逻辑

// 应用状态
const appState = {
    currentPage: 'home',
    currentCategory: 'all',
    products: [],
    banners: [],
    cart: [],
    user: null,
    formData: {}
};

// 商品数据
const productsData = [
    {
        id: 'p001',
        name: '新鲜有机菠菜',
        description: '当天采摘，无农药残留，富含铁质',
        price: 899, // 分
        originalPrice: 1299,
        category: 'community',
        tags: ['有机', '新鲜'],
        image: 'images/products/product1.jpg',
        stock: 100,
        unit: '500g/袋',
        rating: 4.8,
        sales: 1234
    },
    {
        id: 'p002',
        name: '精品五花肉',
        description: '优质猪肉，肥瘦相间，适合红烧',
        price: 3899,
        originalPrice: 4599,
        category: 'community',
        tags: ['热销', '优质'],
        image: 'images/products/product2.jpg',
        stock: 50,
        unit: '1kg/份',
        rating: 4.9,
        sales: 856
    },
    {
        id: 'p003',
        name: '净菜套餐A',
        description: '三菜一汤套餐，开袋即烹',
        price: 6999,
        originalPrice: 8999,
        category: 'premade',
        tags: ['套餐', '方便'],
        image: 'images/products/product3.jpg',
        stock: 30,
        unit: '套',
        rating: 4.7,
        sales: 342
    },
    {
        id: 'p004',
        name: '餐馆专用土豆',
        description: '批发价，适合餐馆大量采购',
        price: 1999,
        originalPrice: 2599,
        category: 'restaurant',
        tags: ['批发', '量大'],
        image: 'images/products/product1.jpg',
        stock: 1000,
        unit: '10kg/箱',
        rating: 4.6,
        sales: 567
    },
    {
        id: 'p005',
        name: '有机西红柿',
        description: '自然成熟，酸甜可口',
        price: 1299,
        originalPrice: 1699,
        category: 'community',
        tags: ['有机', '新鲜'],
        image: 'images/products/product2.jpg',
        stock: 80,
        unit: '1kg/盒',
        rating: 4.8,
        sales: 789
    },
    {
        id: 'p006',
        name: '预制宫保鸡丁',
        description: '正宗川味，加热即食',
        price: 4599,
        originalPrice: 5999,
        category: 'premade',
        tags: ['川菜', '方便'],
        image: 'images/products/product3.jpg',
        stock: 45,
        unit: '500g/袋',
        rating: 4.9,
        sales: 234
    }
];

// 轮播图数据
const bannersData = [
    {
        id: 'b001',
        title: '新鲜直达',
        description: '产地直供，24小时新鲜送达',
        image: 'images/banners/banner1.jpg',
        link: '#category/community',
        bgColor: '#4CAF50'
    },
    {
        id: 'b002',
        title: '净菜预制',
        description: '开袋即烹，省时省力',
        image: 'images/banners/banner2.jpg',
        link: '#category/premade',
        bgColor: '#FF9800'
    },
    {
        id: 'b003',
        title: '餐馆供货',
        description: '批发价格，稳定供应',
        image: 'images/banners/banner3.jpg',
        link: '#category/restaurant',
        bgColor: '#2196F3'
    }
];

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('好食家生鲜平台初始化...');
    
    // 初始化数据
    initApp();
    
    // 设置事件监听器
    setupEventListeners();
    
    // 处理URL路由
    handleRouting();
    
    // 检查PWA安装状态
    checkPWAInstallation();
});

/**
 * 初始化应用
 */
function initApp() {
    // 加载商品数据
    appState.products = productsData;
    appState.banners = bannersData;
    
    // 从本地存储加载用户数据
    loadUserData();
    
    // 渲染首页
    renderHomePage();
    
    // 更新购物车数量
    updateCartCount();
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    // 底部导航点击
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            navigateTo(page);
        });
    });
    
    // 分类导航点击
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const category = card.dataset.category;
            if (category === 'join') {
                navigateTo('join');
            } else {
                navigateTo('category', { category });
            }
        });
    });
    
    // 分类筛选按钮
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            filterProducts(filter);
        });
    });
    
    // 招商入驻表单提交
    const joinForm = document.getElementById('joinForm');
    if (joinForm) {
        joinForm.addEventListener('submit', handleJoinFormSubmit);
    }
    
    // 搜索按钮
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    // 菜单按钮
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
        menuBtn.addEventListener('click', handleMenu);
    }
    
    // 监听URL变化
    window.addEventListener('hashchange', handleRouting);
    
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // 监听网络状态变化
    window.addEventListener('online', handleNetworkOnline);
    window.addEventListener('offline', handleNetworkOffline);
}

/**
 * 处理路由
 */
function handleRouting() {
    const hash = window.location.hash.substring(1);
    
    if (!hash) {
        navigateTo('home');
        return;
    }
    
    const [page, ...params] = hash.split('/');
    
    switch (page) {
        case 'home':
            navigateTo('home');
            break;
        case 'category':
            const category = params[0] || 'all';
            navigateTo('category', { category });
            break;
        case 'join':
            navigateTo('join');
            break;
        case 'product':
            const productId = params[0];
            if (productId) {
                showProductDetail(productId);
            }
            break;
        default:
            navigateTo('home');
    }
}

/**
 * 导航到指定页面
 * @param {string} page - 页面名称
 * @param {object} params - 页面参数
 */
function navigateTo(page, params = {}) {
    console.log(`导航到页面: ${page}`, params);
    
    // 更新当前页面状态
    appState.currentPage = page;
    
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    
    // 更新底部导航激活状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) {
            item.classList.add('active');
        }
    });
    
    // 显示目标页面
    const targetPage = document.getElementById(`${page}Page`);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // 根据页面类型执行特定操作
        switch (page) {
            case 'home':
                renderHomePage();
                break;
            case 'category':
                appState.currentCategory = params.category || 'all';
                renderCategoryPage();
                break;
            case 'join':
                renderJoinPage();
                break;
        }
        
        // 滚动到顶部
        window.scrollTo(0, 0);
    }
}

/**
 * 返回上一页
 */
function goBack() {
    if (appState.currentPage !== 'home') {
        navigateTo('home');
    }
}

/**
 * 渲染首页
 */
function renderHomePage() {
    // 渲染轮播图
    renderBanners();
    
    // 渲染商品推荐
    renderRecommendedProducts();
    
    // 开始轮播图自动播放
    startBannerAutoPlay();
}

/**
 * 渲染轮播图
 */
function renderBanners() {
    const container = document.getElementById('bannerContainer');
    const dotsContainer = document.getElementById('bannerDots');
    
    if (!container || !dotsContainer) return;
    
    // 清空容器
    container.innerHTML = '';
    dotsContainer.innerHTML = '';
    
    // 创建轮播图项
    appState.banners.forEach((banner, index) => {
        // 创建轮播图项
        const slide = document.createElement('div');
        slide.className = `banner-slide ${index === 0 ? 'active' : ''}`;
        slide.dataset.index = index;
        
        slide.innerHTML = `
            <img src="${banner.image}" alt="${banner.title}" loading="lazy">
            <div class="banner-content">
                <h3>${banner.title}</h3>
                <p>${banner.description}</p>
            </div>
        `;
        
        slide.addEventListener('click', () => {
            window.location.hash = banner.link;
        });
        
        container.appendChild(slide);
        
        // 创建指示点
        const dot = document.createElement('div');
        dot.className = `banner-dot ${index === 0 ? 'active' : ''}`;
        dot.dataset.index = index;
        
        dot.addEventListener('click', () => {
            showBanner(index);
        });
        
        dotsContainer.appendChild(dot);
    });
    
    // 设置当前轮播图索引
    appState.currentBannerIndex = 0;
}

/**
 * 显示指定轮播图
 * @param {number} index - 轮播图索引
 */
function showBanner(index) {
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.banner-dot');
    
    // 隐藏所有轮播图
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // 显示目标轮播图
    if (slides[index]) {
        slides[index].classList.add('active');
    }
    if (dots[index]) {
        dots[index].classList.add('active');
    }
    
    appState.currentBannerIndex = index;
}

/**
 * 开始轮播图自动播放
 */
function startBannerAutoPlay() {
    if (appState.bannerInterval) {
        clearInterval(appState.bannerInterval);
    }
    
    appState.bannerInterval = setInterval(() => {
        const nextIndex = (appState.currentBannerIndex + 1) % appState.banners.length;
        showBanner(nextIndex);
    }, 5000); // 5秒切换一次
}

/**
 * 停止轮播图自动播放
 */
function stopBannerAutoPlay() {
    if (appState.bannerInterval) {
        clearInterval(appState.bannerInterval);
        appState.bannerInterval = null;
    }
}

/**
 * 渲染推荐商品
 */
function renderRecommendedProducts() {
    const container = document.getElementById('productsGrid');
    if (!container) return;
    
    // 清空容器
    container.innerHTML = '';
    
    // 获取推荐商品（前6个）
    const recommendedProducts = appState.products.slice(0, 6);
    
    // 创建商品卡片
    recommendedProducts.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
    
    // 如果没有商品，显示空状态
    if (recommendedProducts.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-icon">📦</div>
                <h3>暂无商品</h3>
                <p>商品正在上架中，敬请期待</p>
            </div>
        `;
    }
}

/**
 * 创建商品卡片
 * @param {object} product - 商品数据
 * @returns {HTMLElement} 商品卡片元素
 */
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    
    const price = (product.price / 100).toFixed(2);
    const originalPrice = product.originalPrice ? (product.originalPrice / 100).toFixed(2) : null;
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            ${product.tags && product.tags.length > 0 ? 
                `<div class="product-tag">${product.tags[0]}</div>` : ''}
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-desc">${product.description}</p>
            <div class="product-price">
                <div>
                    <span class="price">¥${price}</span>
                    ${originalPrice ? `<span class="original-price">¥${originalPrice}</span>` : ''}
                </div>
                <button class="add-to-cart" onclick="addToCart('${product.id}')">
                    <svg viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 16H5V8h14v11zm-7-8c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3z"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    // 点击商品卡片查看详情
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.add-to-cart')) {
            showProductDetail(product.id);
        }
    });
    
    return card;
}

/**
 * 渲染分类页面
 */
function renderCategoryPage() {
    const titleEl = document.getElementById('categoryTitle');
    const productsContainer = document.getElementById('categoryProducts');
    
    if (!titleEl || !productsContainer) return;
    
    // 更新标题
    const categoryNames = {
        all: '全部商品',
        community: '社区生鲜',
        premade: '净菜预制菜',
        restaurant: '餐馆供货'
    };
    
    titleEl.textContent = categoryNames[appState.currentCategory] || '商品分类';
    
    // 更新筛选按钮状态
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === appState.currentCategory) {
            btn.classList.add('active');
        }
    });
    
    // 渲染商品
    filterProducts(appState.currentCategory);
}

/**
 * 筛选商品
 * @param {string} filter - 筛选条件
 */
function filterProducts(filter) {
    const container = document.getElementById('categoryProducts');
    if (!container) return;
    
    // 清空容器
    container.innerHTML = '';
    
    // 筛选商品
    let filteredProducts;
    if (filter === 'all') {
        filteredProducts = appState.products;
    } else {
        filteredProducts = appState.products.filter(p => p.category === filter);
    }
    
    // 创建商品卡片
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
    
    // 如果没有商品，显示空状态
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-icon">📦</div>
                <h3>暂无商品</h3>
                <p>该分类下暂无商品，敬请期待</p>
            </div>
        `;
    }
}

/**
 * 渲染招商入驻页面
 */
function renderJoinPage() {
    // 页面已由HTML静态渲染，这里可以添加动态逻辑
    console.log('渲染招商入驻页面');
}

/**
 * 显示商品详情
 * @param {string} productId - 商品ID
 */
function showProductDetail(productId) {
    const product = appState.products.find(p => p.id === productId);
    if (!product) {
        showError('商品不存在');
        return;
    }
    
    // 这里可以弹出一个模态框显示商品详情
    // 由于时间关系，暂时用控制台输出
    console.log('查看商品详情:', product);
    
    // 在实际项目中，这里应该显示一个商品详情模态框
    alert(`商品详情：${product.name}\n价格：¥${(product.price / 100).toFixed(2)}\n描述：${product.description}`);
}

/**
 * 添加到购物车
 * @param {string} productId - 商品ID
 */
function addToCart(productId) {
    const product = appState.products.find(p => p.id === productId);
    if (!product) {
        showError('商品不存在');
        return;
    }
    
    // 检查购物车中是否已有该商品
    const existingItem = appState.cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        appState.cart.push({
            productId,
            product,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    // 保存到本地存储
    saveCartData();
    
    // 更新购物车数量显示
    updateCartCount();
    
    // 显示成功提示
    showSuccess(`已添加 ${product.name} 到购物车`);
    
    console.log('购物车:', appState.cart);
}

/**
 * 更新购物车数量显示
 */
function updateCartCount() {
    const totalItems = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // 这里可以更新购物车图标上的数字
    // 由于时间关系，暂时用控制台输出
    console.log(`购物车商品数量: ${totalItems}`);
}

/**
 * 处理招商入驻表单提交
 * @param {Event} event - 表单提交事件
 */
async function handleJoinFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = document.getElementById('submitBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    // 显示加载状态
    submitBtn.disabled = true;
    loadingSpinner.style.display = 'block';
    
    try {
        // 收集表单数据
        const formData = {
            companyName: form.companyName.value,
            contactPerson: form.contactPerson.value,
            phone: form.phone.value,
            email: form.email.value,
            businessType: form.businessType.value,
            cooperationType: Array.from(form.querySelectorAll('input[name="cooperationType"]:checked'))
                .map(cb => cb.value),
            requirements: form.requirements.value,
            scale: form.scale.value,
            submittedAt: new Date().toISOString()
        };
        
        // 验证表单数据
        if (!validateJoinForm(formData)) {
            throw new Error('请填写完整信息');
        }
        
        // 保存到本地存储（模拟提交到服务器）
        saveFormData(formData);
        
        // 显示成功提示
        showSuccess('提交成功！我们会在24小时内联系您');
        
        // 重置表单
        form.reset();
        
        // 延迟后返回首页
        setTimeout(() => {
            navigateTo('home');
        }, 2000);
        
    } catch (error) {
        console.error('表单提交失败:', error);
        showError(error.message || '提交失败，请重试');
    } finally {
        // 恢复按钮状态
        submitBtn.disabled = false;
        loadingSpinner.style.display = 'none';
    }
}

/**
 * 验证招商入驻表单
 * @param {object} formData - 表单数据
 * @returns {boolean} 是否有效
 */
function validateJoinForm(formData) {
    if (!formData.companyName?.trim()) {
        showError('请输入公司名称');
        return false;
    }
    
    if (!formData.contactPerson?.trim()) {
        showError('请输入联系人');
        return false;
    }
    
    if (!formData.phone?.trim()) {
        showError('请输入联系电话');
        return false;
    }
    
    if (!window.utils.validatePhone(formData.phone)) {
        showError('请输入有效的手机号码');
        return false;
    }
    
    if (formData.email && !window.utils.validateEmail(formData.email)) {
        showError('请输入有效的邮箱地址');
        return false;
    }
    
    if (!formData.businessType) {
        showError('请选择主营品类');
        return false;
    }
    
    if (!formData.cooperationType || formData.cooperationType.length === 0) {
        showError('请选择合作类型');
        return false;
    }
    
    if (!formData.requirements?.trim()) {
        showError('请描述合作需求');
        return false;
    }
    
    const agreeTerms = document.getElementById('agreeTerms');
    if (!agreeTerms.checked) {
        showError('请同意合作伙伴协议');
        return false;
    }
    
    return true;
}

/**
 * 保存表单数据
 * @param {object} formData - 表单数据
 */
function saveFormData(formData) {
    try {
        // 获取现有的表单数据
        const existingData = window.utils.storage.get('joinForms', []);
        
        // 添加新数据
        existingData.push({
            ...formData,
            id: window.utils.generateId(),
            status: 'pending'
        });
        
        // 保存到本地存储
        window.utils.storage.set('joinForms', existingData);
        
        console.log('表单数据已保存:', formData);
    } catch (error) {
        console.error('保存表单数据失败:', error);
    }
}

/**
 * 处理搜索
 */
function handleSearch() {
    // 这里可以显示搜索框或跳转到搜索页面
    alert('搜索功能开发中...');
}

/**
 * 处理菜单
 */
function handleMenu() {
    // 这里可以显示侧边菜单
    alert('菜单功能开发中...');
}

/**
 * 加载用户数据
 */
function loadUserData() {
    try {
        // 加载购物车数据
        const savedCart = window.utils.storage.get('cart', []);
        appState.cart = savedCart;
        
        // 加载用户信息
        const userInfo = window.utils.storage.get('user', null);
        appState.user = userInfo;
        
        console.log('用户数据加载完成');
    } catch (error) {
        console.error('加载用户数据失败:', error);
    }
}

/**
 * 保存购物车数据
 */
function saveCartData() {
    try {
        window.utils.storage.set('cart', appState.cart);
    } catch (error) {
        console.error('保存购物车数据失败:', error);
    }
}

/**
 * 检查PWA安装状态
 */
function checkPWAInstallation() {
    // 检查是否已安装
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('应用已安装为PWA');
    }
}

/**
 * 处理页面可见性变化
 */
function handleVisibilityChange() {
    if (document.hidden) {
        // 页面隐藏时停止轮播图自动播放
        stopBannerAutoPlay();
    } else {
        // 页面显示时重新开始轮播图自动播放
        if (appState.currentPage === 'home') {
            startBannerAutoPlay();
        }
    }
}

/**
 * 处理网络在线
 */
function handleNetworkOnline() {
    console.log('网络已连接');
    showSuccess('网络已恢复');
}

/**
 * 处理网络离线
 */
function handleNetworkOffline() {
    console.log('网络已断开');
    showError('网络连接已断开，部分功能可能受限');
}

// 导出全局函数
window.app = {
    navigateTo,
    goBack,
    addToCart,
    showProductDetail,
    filterProducts
};
