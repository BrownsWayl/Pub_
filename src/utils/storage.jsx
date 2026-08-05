/**
 * 带有有效期的 localStorage 封装
 */

// 1. 写入数据（支持设置过期时间，单位：毫秒）
export const setStorageWithExpiry = (key, value, ttlInMs) => {
    const now = new Date();
    const item = {
        value: value,                          // 实际数据（可以是 Token、用户信息对象等）
        expiry: ttlInMs ? now.getTime() + ttlInMs : null, // 过期绝对时间戳
    };
    localStorage.setItem(key, JSON.stringify(item));
};

// 2. 读取数据（自动判断是否过期）
export const getStorageWithExpiry = (key) => {
    const itemStr = localStorage.getItem(key);

    // 如果数据不存在，返回 null
    if (!itemStr) {
        return null;
    }

    try {
        const item = JSON.parse(itemStr);
        const now = new Date();

        // 如果设置了过期时间且当前时间已超过过期时间
        if (item.expiry && now.getTime() > item.expiry) {
            localStorage.removeItem(key); // 清除已过期的数据
            return null;
        }

        return item.value;
    } catch (e) {
        // 解析异常兜底
        return null;
    }
};

// 3. 彻底清除指定的本地存储或全部清空
export const removeStorage = (key) => {
    if (key) {
        localStorage.removeItem(key);
    } else {
        localStorage.clear();
    }
};