import React, { useState } from 'react';
import { Table, Form, Input, Button, Row, Col, Card, Tag, Badge, Typography, Grid, Pagination } from 'antd';
import { SearchOutlined, ReloadOutlined, DownOutlined } from '@ant-design/icons';
import styles from './TraderPage.module.css';

const { Text } = Typography;
const { useBreakpoint } = Grid;

export const TraderPage = () => {
    const screens = useBreakpoint();
    const [searchForm] = Form.useForm();

    // 💡 判定当前是否为移动端
    const isMobile = screens.md === false;

    // 模拟数据源
    const rawData = [
        { key: '1', mtAccountId: '880124', name: '姜小玲', email: '861***4@deson.com', phone: '***0084', time: '2026-06-23 13:48:39', status: 'active', parent: '刘文专(1Z84)' },
        { key: '2', mtAccountId: '880092', name: '刘文专', email: '271***4@qq.com', phone: '***8864', time: '2026-06-15 09:32:51', status: 'active', parent: 'desonfx.xie(1Z4Y)' },
        { key: '3', mtAccountId: '880053', name: '王小林', email: '133***5@qq.com', phone: '***6428', time: '2026-05-11 10:46:02', status: 'active', parent: 'desonfx.xie(1Z4Y)' },
        { key: '4', mtAccountId: '880041', name: '张俊文', email: '404***0@qq.com', phone: '***4688', time: '2026-04-20 14:52:22', status: 'pending', parent: 'desonfx.xie(1Z4Y)' },
        { key: '5', mtAccountId: '880039', name: '唐寅', email: '105***6@qq.com', phone: '***7720', time: '2026-04-14 18:37:57', status: 'disabled', parent: 'desonfx.xie(1Z4Y)' },
        { key: '6', mtAccountId: '880022', name: '李孝双', email: '327***0@qq.com', phone: '***3395', time: '2026-04-14 10:06:44', status: 'active', parent: 'desonfx.xie(1Z4Y)' },
        { key: '7', mtAccountId: '880018', name: '张杰', email: '546***1@qq.com', phone: '***2520', time: '2026-04-13 14:22:54', status: 'active', parent: 'desonfx.xie(1Z4Y)' },
        { key: '8', mtAccountId: '880001', name: 'desonfx.xie', email: 'des***e@icloud.com', phone: '***4318', time: '2026-04-13 11:44:11', status: 'active', parent: '管理员(1Z1N)' },
        { key: '9', mtAccountId: '879982', name: '董少华', email: 'dongsh@deson-prime.com', phone: '***7711', time: '2026-03-29 09:15:40', status: 'active', parent: 'desonfx.xie(1Z4Y)' },
        { key: '10', mtAccountId: '879954', name: '徐佳丽', email: 'xujiali99@163.com', phone: '***5526', time: '2026-03-25 16:40:12', status: 'active', parent: '刘文专(1Z84)' },
        { key: '11', mtAccountId: '870001', name: '管理员', email: 'admin@desonfx.com', phone: '***0000', time: '2026-01-01 00:00:00', status: 'active', parent: '根节点' },
        { key: '12', mtAccountId: '880205', name: '谢国强', email: 'xie_gq@foxmail.com', phone: '***8819', time: '2026-07-02 11:20:05', status: 'pending', parent: 'desonfx.xie(1Z4Y)' },
        { key: '13', mtAccountId: '880110', name: '韩梅梅', email: 'hmm_trader@qq.com', phone: '***6632', time: '2026-05-18 15:33:19', status: 'active', parent: '王小林(1Z69)' },
        { key: '14', mtAccountId: '880076', name: '李雷', email: 'leilei_fx@outlook.com', phone: '***4415', time: '2026-04-19 10:12:44', status: 'disabled', parent: '王小林(1Z69)' }
    ];

    const [tableData, setTableData] = useState(rawData);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const handleSearch = () => {
        const values = searchForm.getFieldsValue();
        const { searchInfo } = values;
        if (!searchInfo) {
            setTableData(rawData);
            return;
        }
        const filtered = rawData.filter(item =>
            item.name.includes(searchInfo) ||
            item.mtAccountId.includes(searchInfo) ||
            item.email.includes(searchInfo)
        );
        setTableData(filtered);
        setCurrentPage(1);
    };

    const handleReset = () => {
        searchForm.resetFields();
        setTableData(rawData);
        setCurrentPage(1);
    };

    const columns = [
        {
            title: '序号',
            key: 'index',
            width: 70,
            align: 'center',
            render: (_, __, index) => <span className="modern-index-badge">{(currentPage - 1) * pageSize + index + 1}</span>,
        },
        {
            title: '用户名',
            dataIndex: 'name',
            key: 'name',
            width: 160,
            render: (text, record) => (
                <span style={{ fontWeight: '600', color: '#1890ff', cursor: 'pointer' }}>
                    {record.mtAccountId} - {text}
                </span>
            ),
        },
        {
            title: '上级代理',
            dataIndex: 'parent',
            key: 'parent',
            width: 170,
            render: (text) => <span style={{ color: '#475569' }}>{text}</span>
        },
        /*         {
                    title: '组别',
                    dataIndex: 'group',
                    key: 'group',
                    width: 120,
                    align: 'center',
                    render: (group) => (
                        <Tag color="cyan" bordered={false} style={{ borderRadius: '4px', fontWeight: '500', margin: 0 }}>
                            {group}
                        </Tag>
                    )
                }, */
        { title: '邮箱', dataIndex: 'email', key: 'email', responsive: ['md'], width: 210 },
        { title: '手机号', dataIndex: 'phone', key: 'phone', responsive: ['md'], width: 130 },
        {
            title: '注册时间',
            dataIndex: 'time',
            key: 'time',
            responsive: ['md'],
            width: 180,
            render: (text) => <span style={{ color: '#64748b', fontSize: '12px' }}>{text}</span>
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            responsive: ['md'],
            width: 120,
            align: 'center',
            render: (status) => {
                if (status === 'active') return <Badge status="processing" text={<span style={{ color: '#0f766e', fontWeight: '500' }}>允许登录</span>} />;
                if (status === 'pending') return <Badge status="warning" text={<span style={{ color: '#b45309', fontWeight: '500' }}>待审核</span>} />;
                return <Badge status="default" text={<span style={{ color: '#64748b' }}>已禁用</span>} />;
            }
        },
        /*         {
                    title: '操作',
                    key: 'action',
                    responsive: ['md'],
                    width: 90,
                    align: 'center',
                    render: () => (
                        <Button type="link" size="small" style={{ fontWeight: '600', color: '#2563eb' }} className="modern-action-btn">
                            配置
                        </Button>
                    )
                } */
    ];

    // 📱 移动端卡片下钻展开内容微调
    const mobileExpandedRowRender = (record) => {
        const itemStyle = { display: 'flex', padding: '12px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '13px' };
        const labelStyle = { width: '90px', color: '#64748b', fontWeight: '500' };
        const valueStyle = { flex: 1, color: '#1e293b' };
        return (
            <div style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                <div style={itemStyle}><div style={labelStyle}>邮箱</div><div style={valueStyle}>{record.email}</div></div>
                <div style={itemStyle}><div style={labelStyle}>手机号</div><div style={valueStyle}>{record.phone}</div></div>
                <div style={itemStyle}><div style={labelStyle}>注册时间</div><div style={valueStyle}>{record.time}</div></div>
                <div style={{ ...itemStyle, borderBottom: 'none' }}>
                    <div style={labelStyle}>状态</div>
                    <div style={valueStyle}>
                        {record.status === 'active' ? <Badge status="processing" text="允许登录" /> : <Badge status="default" text="已禁用" />}
                    </div>
                </div>
            </div>
        );
    };

    const startIndex = (currentPage - 1) * pageSize;
    const currentPageData = tableData.slice(startIndex, startIndex + pageSize);

    return (
        <div className={styles.pageGlobalBackground}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '16px' }}>

                {/* 🚀 页面独立标题 */}
                <div className={styles.tableTitleArea}>
                    <h2>Trader用户管理</h2>
                </div>

                {/* 🔍 条件筛选栏 */}
                <Card variant="none" className="broker-filter-card" style={{ borderRadius: '6px' }}>
                    <Form form={searchForm} layout="horizontal" className={styles.compactForm} onFinish={handleSearch}>
                        <div className={styles.filterResponsiveContainer}>
                            <div className={styles.filterItem}>
                                <Button type="primary" block style={{ background: '#00a680', borderColor: '#00a680', height: '36px' }}>
                                    层级结构
                                </Button>
                            </div>
                            <div className={styles.filterItem}>
                                <Input placeholder="所有用户" style={{ height: '36px' }} suffix={<DownOutlined style={{ color: '#bfbfbf', fontSize: '12px' }} />} />
                            </div>
                            <div className={styles.filterItem}>
                                <Input placeholder="所有状态" style={{ height: '36px' }} suffix={<DownOutlined style={{ color: '#bfbfbf', fontSize: '12px' }} />} />
                            </div>
                            <div className={styles.filterItem}>
                                <Input placeholder="真实姓名" style={{ height: '36px' }} suffix={<DownOutlined style={{ color: '#bfbfbf', fontSize: '12px' }} />} />
                            </div>
                            <div className={styles.filterItem}>
                                <Form.Item name="searchInfo" style={{ margin: 0 }}>
                                    <Input placeholder="请输入搜索信息" style={{ height: '36px' }} allowClear onPressEnter={handleSearch} />
                                </Form.Item>
                            </div>
                            <div className={`${styles.filterItem} ${styles.filterButtons}`}>
                                <Button type="primary" htmlType="submit" icon={<SearchOutlined />} style={{ flex: 1, background: '#00bba7', borderColor: '#00bba7', height: '36px' }}>
                                    查询
                                </Button>
                                <Button icon={<ReloadOutlined />} onClick={handleReset} style={{ flex: 1, background: '#6c757d', color: '#fff', borderColor: '#6c757d', height: '36px' }}>
                                    重置
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Card>

                {/* 📊 数据表格体 */}
                <div className={styles.modernFancyTableWrapper}>
                    <Table
                        columns={columns}
                        dataSource={currentPageData}
                        size="middle"
                        bordered={false}
                        /* 🚀 专属映射：确保其类名绑定到 TraderPage 独立的 css 模块哈希沙箱中 */
                        rowClassName={() => styles.modernFancyRow}
                        pagination={false}
                        expandable={{
                            expandedRowRender: isMobile ? mobileExpandedRowRender : null,
                            rowExpandable: () => isMobile,
                            columnWidth: 45
                        }}
                    />

                    {/* 一体化双端分页底衬 */}
                    <div className={styles.customPaginationBar}>
                        <div className={styles.paginationLeftInfo}>
                            显示第 {tableData.length === 0 ? 0 : startIndex + 1} 至 {Math.min(currentPage * pageSize, tableData.length)} 项结果，共 {tableData.length} 项
                        </div>

                        <div className={styles.paginationRightControls}>
                            {!isMobile && (
                                <div className={styles.pageSizeSelectArea}>
                                    <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500' }}>显示</span>
                                    <select
                                        value={pageSize}
                                        onChange={(e) => {
                                            setPageSize(Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                        className={styles.nativePageSizeSelector}
                                    >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>
                                    <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500' }}>条</span>
                                </div>
                            )}
                            <Pagination
                                simple={isMobile}
                                current={currentPage}
                                pageSize={pageSize}
                                total={tableData.length}
                                onChange={(page, pSize) => {
                                    setCurrentPage(page);
                                    if (pSize !== pageSize) {
                                        setPageSize(pSize);
                                        setCurrentPage(1);
                                    }
                                }}
                                showSizeChanger={false}
                                size="small"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};