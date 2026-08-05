import React from 'react';
import { Avatar, Dropdown, Tooltip, Badge } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    HomeOutlined,
    SendOutlined,
    DesktopOutlined,
    BellOutlined,
    FullscreenOutlined,
    UserOutlined,
    CreditCardOutlined,
    LockOutlined,
    PoweroffOutlined,
    DownOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

export const DashboardHeader = ({ collapsed, setCollapsed, isMobile }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // 🚀 下拉菜单项
    const userMenuItems = [
        {
            key: '/dashboard/profile',
            icon: <UserOutlined style={{ fontSize: '15px' }} />,
            label: '个人资料',
            onClick: () => navigate('/dashboard/profile')
        },
        // {
        //     key: '/register',
        //     icon: <SendOutlined style={{ fontSize: '15px' }} />,
        //     label: '开户链接',
        //     onClick: () => navigate('/register')
        // },
        {
            key: '/dashboard/bankcard',
            icon: <CreditCardOutlined style={{ fontSize: '15px' }} />,
            label: '我的银行卡',
            onClick: () => navigate('/dashboard/bankcard')
        },
        {
            key: '/dashboard/security',
            icon: <LockOutlined style={{ fontSize: '15px' }} />,
            label: '账号安全设置',
            onClick: () => navigate('/dashboard/security')
        },
        {
            type: 'divider'
        },
        {
            key: 'logout',
            icon: <PoweroffOutlined style={{ fontSize: '15px' }} />,
            label: '退出',
            danger: true,
            onClick: () => navigate('/login')
        }
    ];

    const navItems = [
        { key: '/dashboard/AccountOverview', label: '返回首页', icon: <HomeOutlined /> },
        // { key: '/register', label: '开户链接', icon: <SendOutlined /> },
        { key: 'official', label: '返回官网', icon: <DesktopOutlined />, isExternal: true, url: 'https://example.com' }
    ];

    const handleNavClick = (item) => {
        if (item.isExternal) {
            window.open(item.url, '_blank');
        } else {
            navigate(item.key);
        }
    };

    return (
        <div className="custom-dashboard-header">
            {/* 🟢 左侧：折叠按钮 + Tab 选项卡 */}
            <div className="header-left-tab-wrapper">
                {!isMobile && (
                    <div
                        className="header-collapse-btn"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </div>
                )}

                {/* 移动端下隐藏顶部 Tab */}
                {!isMobile && navItems.map((item) => {
                    const isActive = location.pathname === item.key;
                    return (
                        <div
                            key={item.key}
                            className={`header-nav-tab-item ${isActive ? 'active' : ''}`}
                            onClick={() => handleNavClick(item)}
                        >
                            <span className="tab-icon">{item.icon}</span>
                            <span className="tab-label">{item.label}</span>
                        </div>
                    );
                })}
            </div>

            {/* 🔴 右侧：快捷工具 + 对应截图的用户下拉菜单 */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? '12px' : '18px',
                height: '100%',
                paddingRight: isMobile ? '12px' : '20px'
            }}>
                {/* 语言切换 */}
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}>CN</span>

                {/* 全屏（仅 PC 端展示） */}
                {!isMobile && (
                    <Tooltip title="全屏">
                        <FullscreenOutlined
                            style={{ fontSize: '18px', color: '#64748b', cursor: 'pointer' }}
                            onClick={() => {
                                if (!document.fullscreenElement) {
                                    document.documentElement.requestFullscreen();
                                } else {
                                    if (document.exitFullscreen) document.exitFullscreen();
                                }
                            }}
                        />
                    </Tooltip>
                )}

                {/* 消息通知 */}
                <Badge count={2} size="small">
                    <BellOutlined style={{ fontSize: '18px', color: '#64748b', cursor: 'pointer' }} />
                </Badge>

                {/* 🚀 用户下拉菜单 */}
                <Dropdown
                    menu={{ items: userMenuItems }}
                    placement="bottomRight"
                    trigger={['click']} /* 1. 改为仅点击触发 */
                    overlayStyle={{ paddingTop: '8px' }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        height: '100%',
                        padding: '0 4px',
                        userSelect: 'none'
                    }}>
                        {/* 用户头像 */}
                        <Avatar
                            style={{
                                backgroundColor: '#f97316',
                                verticalAlign: 'middle'
                            }}
                            size={isMobile ? 30 : 32}
                            icon={<UserOutlined />}
                        />

                        {/* 2. 仅在非移动端（PC端）时渲染名字和下拉箭头 */}
                        {!isMobile && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                maxWidth: '160px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                <span style={{
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    color: '#334155',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    desonfx.xie(1Z4Y)
                                </span>
                                <DownOutlined style={{ fontSize: '10px', color: '#64748b', flexShrink: 0 }} />
                            </div>
                        )}
                    </div>
                </Dropdown>
            </div>
        </div>
    );
};