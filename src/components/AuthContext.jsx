import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // 初始化时：优先从 sessionStorage 恢复，没有则默认为 false
    const [isRiskAssessed, setIsRiskAssessed] = useState(() => {
        return sessionStorage.getItem('isRiskAssessed') === 'true';
    });

    // 登录成功时调用，保存后端传回的布尔值
    const loginUser = (hasAssessed) => {
        setIsRiskAssessed(hasAssessed);
        sessionStorage.setItem('isRiskAssessed', hasAssessed ? 'true' : 'false');
    };

    // 评估页提交成功时调用
    const completeRiskAssessment = () => {
        setIsRiskAssessed(true);
        sessionStorage.setItem('isRiskAssessed', 'true');
    };

    // 退出登录或切换账号时一键清空内存和缓存
    const logoutUser = () => {
        setIsRiskAssessed(false);
        sessionStorage.removeItem('isRiskAssessed');
        // 如果有 token 等其他数据，也在此处一并清除
    };

    return (
        <AuthContext.Provider value={{ isRiskAssessed, loginUser, completeRiskAssessment, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);