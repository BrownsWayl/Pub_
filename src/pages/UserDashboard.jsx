import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
    DownOutlined,
    UpOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { dashboardMenuItems } from '../menuConfig';
import { DashboardHeader } from '../components/DashboardHeader';

const { Sider, Content } = Layout;

export const UserDashboard = ({ isMobile }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAssetOpen, setIsAssetOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const handleMenuClick = ({ key }) => {
        navigate(key);
        if (isMobile) {
            setIsAssetOpen(false);
        }
    };

    const selectedKeys = [location.pathname];

    const defaultOpenKeys = dashboardMenuItems
        .filter(item => item.children?.some(child => child.key === location.pathname))
        .map(item => item.key);

    return (
        <Layout style={{
            width: '100%',
            height: '100vh',
            backgroundColor: '#f3f4f6',
            overflow: 'hidden'
        }}>
            <div className="dashboard-responsive-layout" style={{ display: 'flex', width: '100%', height: '100%', position: 'relative', flexDirection: isMobile ? 'column' : 'row' }}>

                {/* 💻 【PC 端侧边栏】：深藏青/蓝灰配色 */}
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
                        {/* 🚀 左侧侧边栏顶部：Logo 品牌区域 */}
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
                                background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#ffffff',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                boxShadow: '0 2px 6px rgba(217,119,6,0.3)'
                            }}>
                                DS
                            </div>
                            {!collapsed && (
                                <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ color: '#ffffff', fontSize: '16px', fontWeight: 'bold', lineHeight: '1.2' }}>
                                        DS
                                    </span>
                                    <span style={{ color: '#94a3b8', fontSize: '10px', letterSpacing: '0.5px' }}>
                                        Deson
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* 菜单列表 */}
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            <Menu
                                theme="dark"
                                mode="inline"
                                selectedKeys={selectedKeys}
                                defaultOpenKeys={defaultOpenKeys}
                                items={dashboardMenuItems}
                                onClick={handleMenuClick}
                                style={{
                                    borderRight: 0,
                                    paddingTop: '8px',
                                    backgroundColor: '#1e293b'
                                }}
                            />
                        </div>
                    </Sider>
                )}

                {/* 📱 【移动 Mobile 端通栏】 */}
                {isMobile && (
                    <div
                        className="mobile-dashboard-header"
                        style={{
                            width: '100%', background: '#ffffff', boxSizing: 'border-box', display: 'block', position: 'relative', zIndex: 999
                        }}
                    >
                        <div
                            onClick={() => setIsAssetOpen(!isAssetOpen)}
                            style={{
                                width: '100%', height: '54px', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                borderBottom: '1px solid #f3f4f6', cursor: 'pointer', boxSizing: 'border-box', background: '#ffffff'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', fontWeight: '500', color: '#1f2937' }}>
                                <SettingOutlined style={{ fontSize: '16px', color: '#4b5563' }} />
                                <span>控制台菜单导航</span>
                            </div>
                            {isAssetOpen ? <UpOutlined style={{ fontSize: '12px', color: '#9ca3af' }} /> : <DownOutlined style={{ fontSize: '12px', color: '#9ca3af' }} />}
                        </div>

                        {isAssetOpen && (
                            <div style={{
                                position: 'absolute', top: '54px', left: 0, width: '100%',
                                background: '#ffffff', zIndex: 1000, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)'
                            }}>
                                <Menu
                                    mode="inline"
                                    selectedKeys={selectedKeys}
                                    items={dashboardMenuItems}
                                    onClick={handleMenuClick}
                                    style={{ borderRight: 0 }}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* 📝 【右侧核心展示区域】 */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', minWidth: 0 }}>

                    {/* 顶部 Header */}
                    <DashboardHeader
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}
                        isMobile={isMobile}
                    />

                    {/* 右侧主内容区域 */}
                    <Content
                        className="dashboard-content-area"
                        style={{
                            flex: '1 1 0%',
                            background: '#f3f4f6',
                            padding: 0,
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            boxSizing: 'border-box',
                            width: '100%'
                        }}
                    >
                        {/* 内部统一包裹层 */}
                        <div style={{
                            padding: isMobile ? '12px' : '20px',
                            width: '100%',
                            boxSizing: 'border-box',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Outlet />
                        </div>
                    </Content>
                </div>

            </div>
        </Layout>
    );
};

export default UserDashboard;