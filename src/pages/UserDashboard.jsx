import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import {
    DownOutlined,
    UpOutlined,
    SettingOutlined,
    SwapOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { defaultMenuItems, specialMenuItems } from '../menuConfig';
import { DashboardHeader } from '../components/DashboardHeader';

const { Sider, Content } = Layout;

export const UserDashboard = ({ isMobile: propsIsMobile, userRole }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAssetOpen, setIsAssetOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    // 🚀 1. 核心修复：独立、实时的移动端状态判定，不受路由切换影响
    const [isMobileDevice, setIsMobileDevice] = useState(() => {
        if (typeof propsIsMobile === 'boolean') return propsIsMobile;
        return window.innerWidth <= 768;
    });

    useEffect(() => {
        const handleResize = () => {
            setIsMobileDevice(window.innerWidth <= 768);
        };
        handleResize(); // 初始化检查
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 每次路由地址变动时，强制重置状态，确保切换页面后移动端顶部通栏能够被正确重新激活
    useEffect(() => {
        if (typeof propsIsMobile !== 'boolean') {
            setIsMobileDevice(window.innerWidth <= 768);
        }
    }, [location.pathname, propsIsMobile]);

    const isMobile = isMobileDevice;

    // 2. 动态判断当前视图属于标准版还是代理/专业版
    const isSpecialView = ['/dashboard/broker', '/dashboard/trader', '/dashboard/commissionreport'].some(
        path => location.pathname.startsWith(path)
    );

    // 3. 动态分配菜单
    const currentMenuItems = isSpecialView ? specialMenuItems : defaultMenuItems;

    // 4. 权限校验
    const isSpecialUser = userRole === 'special_user' || userRole === 'admin';

    // 5. 模式切换
    const handleToggleMode = () => {
        setIsAssetOpen(false); // 切换模式时关闭展开状态，保持缩在顶部
        if (isSpecialView) {
            navigate('/dashboard/accountlist'); // 切回标准版
        } else {
            navigate('/dashboard/broker'); // 切到代理/专业版
        }
    };

    // 6. 菜单点击
    const handleMenuClick = ({ key, item }) => {
        if (item.props?.isOpenNewTab) {
            const url = window.location.origin + key;
            window.open(url, '_blank', 'noopener,noreferrer');
            if (isMobile) setIsAssetOpen(false);
            return;
        }

        navigate(key);
        if (isMobile) {
            setIsAssetOpen(false); // 点击菜单项后缩回顶部
        }
    };

    return (
        <Layout style={{ width: '100%', height: '100vh', backgroundColor: '#f3f4f6', overflow: 'hidden' }}>
            {/* 样式定义 */}
            <style>{`
                .mode-switch-div-btn {
                    background-color: #334155;
                    border: 1px solid #475569;
                }
                .mode-switch-div-btn:hover {
                    background-color: #d97706 !important;
                    border-color: #d97706 !important;
                }

                .mode-switch-div-btn-mobile {
                    background-color: #1e293b;
                    border: 1px solid #1e293b;
                }
                .mode-switch-div-btn-mobile:hover {
                    background-color: #f97316 !important;
                    border-color: #f97316 !important;
                }
            `}</style>

            <div className="dashboard-responsive-layout" style={{ display: 'flex', width: '100%', height: '100%', position: 'relative', flexDirection: isMobile ? 'column' : 'row' }}>

                {/* 💻 【PC 端侧边栏】仅在非移动端渲染 */}
                {!isMobile && (
                    <Sider
                        width={240}
                        theme="dark"
                        collapsed={collapsed}
                        className="pc-dashboard-sider"
                        style={{
                            background: '#1e293b',
                            borderRight: '1px solid #334155',
                            flexShrink: 0,
                            height: '100%',
                            boxSizing: 'border-box',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {/* Logo 区域 */}
                        <div style={{
                            height: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: collapsed ? 'center' : 'flex-start',
                            paddingLeft: collapsed ? '0' : '20px',
                            borderBottom: '1px solid #334155',
                            backgroundColor: '#1e293b',
                            flexShrink: 0
                        }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: isSpecialView
                                    ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                                    : 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#ffffff',
                                fontWeight: 'bold',
                                fontSize: '13px'
                            }}>
                                {isSpecialView ? 'PRO' : 'DS'}
                            </div>
                            {!collapsed && (
                                <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: 'bold', lineHeight: '1.2' }}>
                                        {isSpecialView ? '代理板块' : 'DS CRM'}
                                    </span>
                                    <span style={{ color: '#94a3b8', fontSize: '10px' }}>
                                        {isSpecialView ? 'Institutional' : 'Standard Edition'}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* 中间菜单区域 */}
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            <Menu
                                theme="dark"
                                mode="inline"
                                selectedKeys={[location.pathname]}
                                items={currentMenuItems}
                                onClick={handleMenuClick}
                                style={{ borderRight: 0, paddingTop: '8px', backgroundColor: '#1e293b' }}
                            />
                        </div>

                        {/* 侧边栏底部切换按钮 */}
                        {isSpecialUser && (
                            <div style={{
                                padding: collapsed ? '12px 8px' : '12px 16px',
                                borderTop: '1px solid #334155',
                                backgroundColor: '#0f172a',
                                flexShrink: 0
                            }}>
                                <div
                                    onClick={handleToggleMode}
                                    className="mode-switch-div-btn"
                                    style={{
                                        height: '40px',
                                        borderRadius: '6px',
                                        fontWeight: '500',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        color: '#ffffff',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        userSelect: 'none',
                                        transition: 'background-color 0.2s ease, border-color 0.2s ease'
                                    }}
                                >
                                    <SwapOutlined />
                                    {!collapsed && (isSpecialView ? '切换至标准控制台' : '切换至代理控制台')}
                                </div>
                            </div>
                        )}
                    </Sider>
                )}

                {/* 📱 【移动端强制收缩顶部栏】：无论标准版还是代理版，只要是移动端就一定渲染 */}
                {isMobile && (
                    <div className="mobile-dashboard-header" style={{ width: '100%', background: '#ffffff', position: 'relative', zIndex: 999, flexShrink: 0 }}>
                        {/* 顶部收缩的折叠通栏 */}
                        <div
                            onClick={() => setIsAssetOpen(!isAssetOpen)}
                            style={{
                                width: '100%', height: '54px', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                borderBottom: '1px solid #f3f4f6', cursor: 'pointer', boxSizing: 'border-box', background: '#ffffff'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', fontWeight: '500', color: '#1f2937' }}>
                                <SettingOutlined style={{ fontSize: '16px', color: '#4b5563' }} />
                                <span>{isSpecialView ? '代理版导航菜单' : '控制台菜单导航'}</span>
                            </div>
                            {isAssetOpen ? <UpOutlined style={{ fontSize: '12px', color: '#9ca3af' }} /> : <DownOutlined style={{ fontSize: '12px', color: '#9ca3af' }} />}
                        </div>

                        {/* 点击后下拉展开的菜单 */}
                        {isAssetOpen && (
                            <div style={{
                                position: 'absolute', top: '54px', left: 0, width: '100%',
                                background: '#ffffff', zIndex: 1000, boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                            }}>
                                <Menu
                                    mode="inline"
                                    selectedKeys={[location.pathname]}
                                    items={currentMenuItems}
                                    onClick={handleMenuClick}
                                    style={{ borderRight: 0 }}
                                />

                                {/* 移动端模式切换按钮 */}
                                {isSpecialUser && (
                                    <div style={{ padding: '12px 16px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                                        <div
                                            onClick={handleToggleMode}
                                            className="mode-switch-div-btn-mobile"
                                            style={{
                                                height: '42px',
                                                borderRadius: '6px',
                                                fontWeight: '500',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                color: '#ffffff',
                                                fontSize: '14px',
                                                cursor: 'pointer',
                                                userSelect: 'none',
                                                transition: 'background-color 0.2s ease, border-color 0.2s ease'
                                            }}
                                        >
                                            <SwapOutlined />
                                            {isSpecialView ? '切换至标准控制台' : '切换至代理控制台'}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* 📝 右侧 Content 展区 */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', minWidth: 0 }}>
                    <DashboardHeader
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}
                        isMobile={isMobile}
                    />
                    <Content
                        className="dashboard-content-area"
                        style={{
                            flex: '1 1 0%',
                            background: '#f1f5f9',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            boxSizing: 'border-box',
                            width: '100%'
                        }}
                    >
                        <div style={{ boxSizing: 'border-box' }}>
                            <Outlet />
                        </div>
                    </Content>
                </div>

            </div>
        </Layout>
    );
};

export default UserDashboard;