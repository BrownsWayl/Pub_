import React, { useState } from 'react';
import { Table, Form, Input, Button, Card, Grid, Pagination, Select, DatePicker } from 'antd';
import { SearchOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons';
import styles from './CommissionReportPage.module.css';

const { Option } = Select;
const { useBreakpoint } = Grid;

export const CommissionReportPage = () => {
    const screens = useBreakpoint();
    const [searchForm] = Form.useForm();
    const isMobile = screens.md === false;

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);

    const rawData = [
        {
            key: '1',
            agent: '刘文专(1Z84)',
            account: '861112',
            accountName: '王建新(1Z96)',
            totalLots: '0.1',
            commissionStr: '$1.10(已返佣: $1.10,未返佣: $0.00)',
            commissionPaid: 1.10,
            commissionUnpaid: 0.00,
            innerData: [
                { key: '1-1', agent: 'desonfx.xie(1Z4Y)', receiveAcc: '55120', comm: '0.90', lots: '0.1', std: '9.00/vol/pip', date: '2026-07-17 04:05:36', orderId: '57011', symbol: 'XAUUSD.s', openPrice: '3977.73', openTime: '2026-07-17 04:05:22', closePrice: '3977.49', closeTime: '2026-07-17 04:05:33', profit: '2.400000', swap: '0.00', fee: '0.00' },
                { key: '1-2', agent: 'desonfx.xie(1Z4Y)', receiveAcc: '55120', comm: '0.90', lots: '0.1', std: '9.00/vol/pip', date: '2026-07-17 03:53:37', orderId: '56989', symbol: 'XAUUSD.s', openPrice: '3977.64', openTime: '2026-07-17 03:31:29', closePrice: '3981.9', closeTime: '2026-07-17 03:53:38', profit: '42.599998', swap: '0.00', fee: '0.00' }
            ]
        },
        {
            key: '2',
            agent: '姜小玲(1Z8E)',
            account: '861112',
            accountName: '王建新(1Z96)',
            totalLots: '0.1',
            commissionStr: '$1.50(已返佣: $1.50,未返佣: $0.00)',
            commissionPaid: 1.50,
            commissionUnpaid: 0.00,
            innerData: [
                { key: '2-1', agent: 'desonfx.xie(1Z4Y)', receiveAcc: '55120', comm: '0.90', lots: '0.1', std: '9.00/vol/pip', date: '2026-07-17 03:02:06', orderId: '56970', symbol: 'XAUUSD.s', openPrice: '3980.92', openTime: '2026-07-17 02:34:22', closePrice: '3982.04', closeTime: '2026-07-17 03:02:05', profit: '11.200000', swap: '0.00', fee: '0.00' }
            ]
        },
        {
            key: '3',
            agent: 'desonfx.xie(1Z4Y)',
            account: '861025',
            accountName: '周望林(1Z5T)',
            totalLots: '1.48',
            commissionStr: '$14.80(已返佣: $14.80,未返佣: $0.00)',
            commissionPaid: 14.80,
            commissionUnpaid: 0.00,
            innerData: [
                { key: '3-1', agent: 'desonfx.xie(1Z4Y)', receiveAcc: '55120', comm: '0.90', lots: '0.1', std: '9.00/vol/pip', date: '2026-07-17 00:30:07', orderId: '56918', symbol: 'XAUUSD.s', openPrice: '3986.43', openTime: '2026-07-17 00:20:07', closePrice: '3988.15', closeTime: '2026-07-17 00:30:03', profit: '17.200001', swap: '0.00', fee: '0.00' }
            ]
        },
        {
            key: '4',
            agent: 'desonfx.xie(1Z4Y)',
            account: '861109',
            accountName: '袁艳云(1Z8Z)',
            totalLots: '0.4',
            commissionStr: '$3.60(已返佣: $3.60,未返佣: $0.00)',
            commissionPaid: 3.60,
            commissionUnpaid: 0.00,
            innerData: []
        }
    ];

    const [tableData, setTableData] = useState(rawData);

    const totalLotsSum = tableData.reduce((acc, curr) => acc + parseFloat(curr.totalLots || 0), 0).toFixed(2);
    const totalCommPaid = tableData.reduce((acc, curr) => acc + curr.commissionPaid, 0).toFixed(2);

    const columns = [
        { title: '代理', dataIndex: 'agent', key: 'agent', render: (text) => <span style={{ fontWeight: 600, color: '#475569' }}>{text}</span> },
        { title: '账号', dataIndex: 'account', key: 'account' },
        { title: '账户名称', dataIndex: 'accountName', key: 'accountName' },
        { title: '合计手数', dataIndex: 'totalLots', key: 'totalLots', align: 'right', render: (text) => <span style={{ fontWeight: 600 }}>{text}</span> },
        { title: '返佣($)', dataIndex: 'commissionStr', key: 'commissionStr', render: (text) => <span style={{ color: '#64748b', fontSize: '13px' }}>{text}</span> }
    ];

    const innerColumns = [
        { title: '代理', dataIndex: 'agent', key: 'agent' },
        { title: '收佣账号', dataIndex: 'receiveAcc', key: 'receiveAcc' },
        { title: '返佣($)', dataIndex: 'comm', key: 'comm', render: (text) => <span style={{ color: '#16a34a', fontWeight: 600 }}>{text}</span> },
        { title: '手数', dataIndex: 'lots', key: 'lots', align: 'right' },
        { title: '返佣标准($)', dataIndex: 'std', key: 'std' },
        { title: '结算日期', dataIndex: 'date', key: 'date' },
        { title: '订单号', dataIndex: 'orderId', key: 'orderId' },
        { title: '品种', dataIndex: 'symbol', key: 'symbol' },
        { title: '开仓价', dataIndex: 'openPrice', key: 'openPrice', align: 'right' },
        { title: '开仓时间', dataIndex: 'openTime', key: 'openTime' },
        { title: '平仓价', dataIndex: 'closePrice', key: 'closePrice', align: 'right' },
        { title: '平仓时间', dataIndex: 'closeTime', key: 'closeTime' },
        { title: '盈亏', dataIndex: 'profit', key: 'profit', align: 'right', render: (text) => <span style={{ color: parseFloat(text) >= 0 ? '#16a34a' : '#f43f5e', fontWeight: 500 }}>{text}</span> },
        { title: '利息', dataIndex: 'swap', key: 'swap', align: 'right' },
        { title: '手续费($)', dataIndex: 'fee', key: 'fee', align: 'right' }
    ];

    // 🚀 子表格展开渲染：使用特定列宽，并使用 scroll 属性让它在受限区域内完美排列
    const expandedRowRender = (record) => {
        return (
            <div className={styles.innerTableContainer}>
                <Table
                    columns={innerColumns}
                    dataSource={record.innerData}
                    pagination={false}
                    size="small"
                    bordered={false}
                    rowClassName={() => styles.modernFancyRow}
                />
            </div>
        );
    };

    const handleSearch = () => {
        const values = searchForm.getFieldsValue();
        const { searchKey } = values;
        if (!searchKey) {
            setTableData(rawData);
            return;
        }
        const filtered = rawData.filter(item => item.agent.includes(searchKey) || item.account.includes(searchKey));
        setTableData(filtered);
    };

    const startIndex = (currentPage - 1) * pageSize;
    const currentPageData = tableData.slice(startIndex, startIndex + pageSize);

    return (
        <div className={styles.pageGlobalBackground}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '16px' }}>

                {/* 标题 */}
                <div className={styles.tableTitleArea} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                        佣金报表
                    </h2>
                    <div className={styles.breadcrumb}>
                        <span>报表中心</span> &gt; <span className={styles.breadcrumbActive}>佣金报表</span>
                    </div>
                </div>

                {/* 查询卡片 */}
                <Card variant="none" className="broker-filter-card" style={{ borderRadius: '6px' }}>
                    <Form form={searchForm} layout="horizontal" className={styles.compactForm} onFinish={handleSearch}>
                        <div className={styles.filterResponsiveContainer}>
                            <div className={styles.filterItemBtn}>
                                <Button type="primary" style={{ background: '#00bba7', borderColor: '#00bba7', height: '36px', width: '100%', fontWeight: '600' }}>
                                    层级结构
                                </Button>
                            </div>
                            <div className={styles.filterItem}>
                                <Select style={{ height: '36px', width: '100%' }} defaultValue="所有用户">
                                    <Option value="所有用户">所有用户</Option>
                                </Select>
                            </div>
                            <div className={styles.filterItem}>
                                <Select style={{ height: '36px', width: '100%' }} defaultValue="近三个月">
                                    <Option value="近三个月">近三个月</Option>
                                </Select>
                            </div>
                            <div className={styles.filterItem}>
                                <Select style={{ height: '36px', width: '100%' }} defaultValue="结算日期">
                                    <Option value="结算日期">结算日期</Option>
                                </Select>
                            </div>
                            <div className={styles.filterItemDate}>
                                <DatePicker placeholder="开始时间" style={{ height: '36px', width: '100%' }} />
                            </div>
                            <div className={styles.filterItemDate}>
                                <DatePicker placeholder="结束时间" style={{ height: '36px', width: '100%' }} />
                            </div>
                            <div className={styles.filterItemInput}>
                                <Form.Item name="searchKey" style={{ margin: 0 }}>
                                    <Input placeholder="账号/账户名称" style={{ height: '36px' }} allowClear onPressEnter={handleSearch} />
                                </Form.Item>
                            </div>
                            <div className={styles.filterButtonsGroup}>
                                <Button type="primary" htmlType="submit" icon={<SearchOutlined />} style={{ flex: 1, background: '#00bba7', borderColor: '#00bba7', height: '36px' }}>
                                    查询
                                </Button>
                                <Button icon={<ReloadOutlined />} onClick={() => { searchForm.resetFields(); setTableData(rawData); }} style={{ flex: 1, background: '#6c757d', color: '#fff', borderColor: '#6c757d', height: '36px' }}>
                                    重置
                                </Button>
                                <Button icon={<ExportOutlined />} style={{ flex: 1, background: '#00bba7', color: '#fff', borderColor: '#00bba7', height: '36px' }}>
                                    导出
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Card>

                {/* 表格体 */}
                <div className={styles.modernFancyTableWrapper}>
                    <Table
                        columns={columns}
                        dataSource={currentPageData}
                        size="middle"
                        bordered={false}
                        rowClassName={() => styles.modernFancyRow}
                        pagination={false}
                        expandable={{
                            expandedRowRender,
                            columnWidth: 45
                        }}
                        scroll={{ x: 'max-content' }}
                    />

                    {/* 双端对齐翻页底衬 */}
                    <div className={styles.customPaginationBar}>
                        <div className={styles.paginationLeftWrapper}>
                            <div className={styles.paginationLeftInfo}>
                                显示第 {tableData.length === 0 ? 0 : startIndex + 1} 至 {Math.min(currentPage * pageSize, tableData.length)} 项结果，共 {tableData.length} 项
                            </div>
                            <div className={styles.totalSumArea}>
                                合计：合计返佣($): <span className={styles.sumHighlight}>{totalCommPaid}</span>, 返佣($): <span className={styles.sumHighlight}>{totalCommPaid}</span>, 合计数: <span className={styles.lotHighlight}>{totalLotsSum}</span>
                            </div>
                        </div>

                        <div className={styles.paginationRightControls}>
                            {!isMobile && (
                                <div className={styles.pageSizeSelectArea}>
                                    <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500' }}>显示</span>
                                    <select
                                        value={pageSize}
                                        onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                                        className={styles.nativePageSizeSelectorMini}
                                    >
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                    </select>
                                    <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500' }}>条</span>
                                </div>
                            )}

                            <Pagination
                                simple={isMobile}
                                current={currentPage}
                                pageSize={pageSize}
                                total={tableData.length}
                                onChange={(page) => setCurrentPage(page)}
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