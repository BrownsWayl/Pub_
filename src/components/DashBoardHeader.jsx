import React from 'react';
import { Avatar, Dropdown, Tooltip, Badge } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    HomeOutlined,
    DesktopOutlined,
    BellOutlined,
    FullscreenOutlined,
    UserOutlined,
    CreditCardOutlined,
    LockOutlined,
    PoweroffOutlined,
    DownOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export const DashboardHeader = ({ collapsed, setCollapsed, isMobile }) => {
    const navigate = useNavigate();

    // 🚀 下拉菜单项
    const userMenuItems = [
        {
            key: '/dashboard/profile',
            icon: <UserOutlined style={{ fontSize: '15px' }} />,
            label: '个人资料',
            onClick: () => navigate('/dashboard/profile')
        },
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
            {/* 注入全局/局部 CSS：统一导航 Tab 和 Dropdown 下拉菜单项的 Hover 样式 */}
            <style>{`
                /* 1. 顶部 Tab Hover 效果 */
                .header-nav-tab-item-hover {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 0 20px;
                    height: 100%;
                    cursor: pointer;
                    color: #475569;
                    transition: all 0.2s ease;
                    user-select: none;
                }
                .header-nav-tab-item-hover:hover {
                    background-color: #1e293b; /* 深蓝色 */
                    color: #ffffff;            /* 白字 */
                }
                .header-nav-tab-item-hover .tab-icon {
                    font-size: 16px;
                    margin-bottom: 2px;
                }
                .header-nav-tab-item-hover .tab-label {
                    font-size: 12px;
                }

                /* 2. 下拉菜单项 (Dropdown Item) Hover 效果 */
                .ant-dropdown-menu-item:hover {
                    background-color: #1e293b !important; /* 统一为深蓝色 */
                    color: #ffffff !important;            /* 文字变为纯白 */
                }
                /* 确保菜单项内部图标同步变白 */
                .ant-dropdown-menu-item:hover .anticon {
                    color: #ffffff !important;
                }

                /* 3. “退出” (danger) 项 Hover 效果微调：深红背景 + 白字 */
                .ant-dropdown-menu-item-danger:hover {
                    background-color: #ef4444 !important;
                    color: #ffffff !important;
                }
                .ant-dropdown-menu-item-danger:hover .anticon {
                    color: #ffffff !important;
                }
            `}</style>

            {/* 🟢 左侧：折叠按钮 + Tab 选项卡 */}
            <div className="header-left-tab-wrapper" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                {!isMobile && (
                    <div
                        className="header-collapse-btn"
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            padding: '0 16px',
                            cursor: 'pointer',
                            fontSize: '18px',
                            color: '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            height: '100%'
                        }}
                    >
                        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </div>
                )}

                {!isMobile && navItems.map((item) => (
                    <div
                        key={item.key}
                        className="header-nav-tab-item-hover"
                        onClick={() => handleNavClick(item)}
                    >
                        <span className="tab-icon">{item.icon}</span>
                        <span className="tab-label">{item.label}</span>
                    </div>
                ))}
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
                {/*         <span style={{ fontSize: '13px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}>CN</span>
 */}
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
                {/*       <Badge count={2} size="small">
                    <BellOutlined style={{ fontSize: '18px', color: '#64748b', cursor: 'pointer' }} />
                </Badge>
 */}
                {/* 🚀 用户下拉菜单 */}
                <Dropdown
                    menu={{ items: userMenuItems }}
                    placement="bottomRight"
                    trigger={['click']}
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
                        <Avatar
                            style={{
                                backgroundColor: '#f97316',
                                verticalAlign: 'middle'
                            }}
                            size={isMobile ? 30 : 32}
                            icon={<UserOutlined />}
                        />

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
                                    //用户名保存在本地，在本地存储中获取
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