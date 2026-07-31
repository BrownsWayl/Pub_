import React, { useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

export const RiskGuard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // 1. 模拟获取用户的风险评估状态（实际开发中请改为你的全局状态或 localStorage/接口数据）
    const isRiskAssessed = localStorage.getItem('isRiskAssessed') === 'true';

    useEffect(() => {
        // 2. 如果用户没有做过风险评估，且当前访问的不是评估页面本身
        if (!isRiskAssessed && location.pathname !== '/dashboard/risk-assessment') {
            // 强制拦截并死锁在风险评估页面
            navigate('/dashboard/riskassessment', { replace: true });
        }

        // 3. 如果用户已经做过了，但他却想手动输入地址进评估页面，可以把它重定向去 dashboard 首页
        if (isRiskAssessed && location.pathname === '/dashboard/risk-assessment') {
            navigate('/dashboard', { replace: true });
        }
    }, [isRiskAssessed, location.pathname, navigate]);

    // 如果没评估，这里在跳转前会短暂渲染空或者加载动画；如果评估过了，Outlet 会正常渲染子路由页面
    return <Outlet />;
};