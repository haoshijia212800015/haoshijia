// 好食家生鲜平台 - 工具函数库

/**
 * 显示加载提示
 * @param {string} message - 加载提示文字
 */
function showLoading(message = '加载中...') {
    const overlay = document.getElementById('loadingOverlay');
    const messageEl = overlay.querySelector('p');
    
    messageEl.textContent = message;
    overlay.classList.add('active');
}

/**
 * 隐藏加载提示
 */
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.remove('active');
}

/**
 * 显示成功提示
 * @param {string} message - 提示消息
 * @param {number} duration - 显示时长（毫秒）
 */
function showSuccess(message = '操作成功！', duration = 3000) {
    const toast = document.getElementById('successToast');
    const messageEl = toast.querySelector('span');
    
    messageEl.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

/**
 * 显示错误提示
 * @param {string} message - 错误消息
 * @param {number} duration - 显示时长（毫秒）
 */
function showError(message = '操作失败，请重试', duration = 3000) {
    const toast = document.getElementById('errorToast');
    const messageEl = toast.querySelector('span');
    
    messageEl.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

/**
 * 格式化价格
 * @param {number} price - 价格（分）
 * @returns {string} 格式化后的价格
 */
function formatPrice(price) {
    return (price / 100).toFixed(2);
}

/**
 * 格式化日期
 * @param {Date|string|number} date - 日期
 * @param {string} format - 格式，默认 'YYYY-MM-DD'
 * @returns {string} 格式化后的日期
 */
function formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 节流函数
 * @param {Function} func - 要执行的函数
 * @param {number} limit - 限制时间（毫秒）
 * @returns {Function} 节流后的函数
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 生成随机ID
 * @param {number} length - ID长度
 * @returns {string} 随机ID
 */
function generateId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * 验证手机号码
 * @param {string} phone - 手机号码
 * @returns {boolean} 是否有效
 */
function validatePhone(phone) {
    const regex = /^1[3-9]\d{9}$/;
    return regex.test(phone);
}

/**
 * 验证邮箱
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否有效
 */
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * 本地存储操作
 */
const storage = {
    /**
     * 设置存储项
     * @param {string} key - 键名
     * @param {any} value - 值
     */
    set(key, value) {
        try {
            localStorage.setItem(`haoshijia_${key}`, JSON.stringify(value));
        } catch (error) {
            console.error('本地存储失败:', error);
        }
    },
    
    /**
     * 获取存储项
     * @param {string} key - 键名
     * @param {any} defaultValue - 默认值
     * @returns {any} 存储的值
     */
    get(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(`haoshijia_${key}`);
            return value ? JSON.parse(value) : defaultValue;
        } catch (error) {
            console.error('本地读取失败:', error);
            return defaultValue;
        }
    },
    
    /**
     * 删除存储项
     * @param {string} key - 键名
     */
    remove(key) {
        try {
            localStorage.removeItem(`haoshijia_${key}`);
        } catch (error) {
            console.error('本地删除失败:', error);
        }
    },
    
    /**
     * 清空所有存储
     */
    clear() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('清空存储失败:', error);
        }
    }
};

/**
 * 检查网络状态
 * @returns {Promise<boolean>} 是否在线
 */
function checkNetworkStatus() {
    return new Promise((resolve) => {
        if (navigator.onLine) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
}

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<boolean>} 是否成功
 */
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        }
    } catch (error) {
        console.error('复制失败:', error);
        return false;
    }
}

/**
 * 获取URL参数
 * @param {string} name - 参数名
 * @returns {string|null} 参数值
 */
function getUrlParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * 设置URL参数
 * @param {string} name - 参数名
 * @param {string} value - 参数值
 */
function setUrlParam(name, value) {
    const url = new URL(window.location);
    url.searchParams.set(name, value);
    window.history.replaceState({}, '', url);
}

/**
 * 移除URL参数
 * @param {string} name - 参数名
 */
function removeUrlParam(name) {
    const url = new URL(window.location);
    url.searchParams.delete(name);
    window.history.replaceState({}, '', url);
}

/**
 * 平滑滚动到元素
 * @param {string|HTMLElement} element - 元素或选择器
 * @param {object} options - 滚动选项
 */
function smoothScrollTo(element, options = {}) {
    const target = typeof element === 'string' 
        ? document.querySelector(element) 
        : element;
    
    if (!target) return;
    
    const defaultOptions = {
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
    };
    
    target.scrollIntoView({ ...defaultOptions, ...options });
}

/**
 * 检测设备类型
 * @returns {object} 设备信息
 */
function detectDevice() {
    const ua = navigator.userAgent;
    
    return {
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
        isIOS: /iPhone|iPad|iPod/i.test(ua),
        isAndroid: /Android/i.test(ua),
        isWechat: /MicroMessenger/i.test(ua),
        isAlipay: /AlipayClient/i.test(ua)
    };
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的文件大小
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 深度克隆对象
 * @param {object} obj - 要克隆的对象
 * @returns {object} 克隆后的对象
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = deepClone(obj[key]);
            }
        }
        return cloned;
    }
    return obj;
}

/**
 * 合并多个对象
 * @param {...object} objects - 要合并的对象
 * @returns {object} 合并后的对象
 */
function mergeObjects(...objects) {
    return objects.reduce((result, current) => {
        return Object.assign(result, current);
    }, {});
}

/**
 * 等待指定时间
 * @param {number} ms - 等待时间（毫秒）
 * @returns {Promise<void>}
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 导出工具函数
window.utils = {
    showLoading,
    hideLoading,
    showSuccess,
    showError,
    formatPrice,
    formatDate,
    debounce,
    throttle,
    generateId,
    validatePhone,
    validateEmail,
    storage,
    checkNetworkStatus,
    copyToClipboard,
    getUrlParam,
    setUrlParam,
    removeUrlParam,
    smoothScrollTo,
    detectDevice,
    formatFileSize,
    deepClone,
    mergeObjects,
    sleep
};