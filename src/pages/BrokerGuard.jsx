import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getStorageWithExpiry } from '../utils/storage';

/**
 * 路由守卫组件
 */
export const BrokerGuard = () => {
    // 1. 从 localStorage 读取 Token（getStorageWithExpiry 会自动校验是否过期）
    const token = getStorageWithExpiry('token');

    // 2. 如果 Token 不存在或已过期，自动跳转到登录页
    // replace 属性表示替换历史记录，防止用户点击浏览器后退按键又回到受保护页面
    if (!token) {
        return <Navigate to="/dashbaord/Overview" replace />;
    }

    // 3. 校验通过，允许渲染子路由内容（即 Layout 或真正的页面组件）
    return <Outlet />;
};
