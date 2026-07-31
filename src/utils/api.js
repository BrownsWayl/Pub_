// src/utils/api.js
import axios from 'axios';

// 1. 创建 Axios 实例
const api = axios.create({
    // 🔴 请把这里的 URL 替换为您真实的后端服务器地址
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// 2. 请求拦截器 (Request Interceptor)
// 在每一次请求发送出去之前，都会自动触发这个函数
api.interceptors.request.use(
    (config) => {
        // 从缓存中获取用户登录凭证 Token  一般是用户的账户id
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');

        // 如果本地存在 Token，就自动把它塞进 HTTP 请求头里 (以标准的 Bearer 格式)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // 请求发送失败时的处理
        return Promise.reject(error);
    }
);

// 3. 响应拦截器 (Response Interceptor)
// 在后端服务器返回数据、前端 .then() 接收到数据之前，会先经过这里
api.interceptors.response.use(
    (response) => {
        // 如果服务器状态码是 2xx，直接返回核心数据，省去前端每次都写 .data 的麻烦
        return response.data;
    },
    (error) => {
        // 🔴 统一处理 HTTP 错误状态码
        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    // 未登录或 Token 过期：清空本地所有状态，强制弹回登录页
                    console.error("身份验证失败，请重新登录");
                    sessionStorage.clear();
                    localStorage.removeItem('token');
                    // 如果不是 Next.js 环境，可以直接使用原生跳转
                    window.location.href = '/login';
                    break;

                case 403:
                    console.error("拒绝访问：您没有该操作权限");
                    break;

                case 500:
                    console.error("服务器内部错误，请稍后再试");
                    break;

                default:
                    // 弹出后端传回来的具体错误错误信息 (例如：密码错误、账号不存在等)
                    console.error(data?.message || "网络请求发生未知错误");
            }
        } else if (error.request) {
            // 请求发出了，但是完全没有收到服务器的响应 (比如断网、服务器宕机)
            console.error("无法连接到服务器，请检查您的网络连接");
        } else {
            // 发生了一些引发请求错误的其它特殊问题
            console.error("触发请求错误:", error.message);
        }

        return Promise.reject(error);
    }
);

export default api;