import React, { useState } from 'react';
import { Table, Form, Input, Button, Card, Grid, Pagination, DatePicker } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
// 🚀 引入专属的交易历史模块化样式表
import styles from './tradehistorypage.module.css';

const { useBreakpoint } = Grid;

export const TradeHistoryPage = () => {
    const screens = useBreakpoint();
    const [searchForm] = Form.useForm();

    // 💡 判定当前是否为移动端
    const isMobile = screens.md === false;

    // 🚀 100% 对应真实已平仓测试数据
    const rawData = [
        { key: '1', orderId: '7721054', accountId: '55120', type: 'Buy', symbol: 'XAUUSD', volume: '0.20', openPrice: '2310.15', openTime: '2026-07-10 14:22:11', closePrice: '2332.50', closeTime: '2026-07-10 18:45:30', sl: '2300.00000', tp: '2350.00000', fee: '-3.00', swaps: '-0.50', profit: '447.00' },
        { key: '2', orderId: '7721088', accountId: '55120', type: 'Sell', symbol: 'EURUSD', volume: '1.00', openPrice: '1.08950', openTime: '2026-07-09 09:12:44', closePrice: '1.08730', closeTime: '2026-07-09 15:30:12', sl: '1.09500', tp: '1.08000', fee: '-10.00', swaps: '-1.80', profit: '208.20' },
        { key: '3', orderId: '7721102', accountId: '861005', type: 'Buy', symbol: 'XAUUSD', volume: '0.50', openPrice: '2325.40', openTime: '2026-07-08 11:30:15', closePrice: '2318.20', closeTime: '2026-07-08 13:10:05', sl: '2310.00000', tp: '2360.00000', fee: '-7.50', swaps: '0.00', profit: '-367.50' },
        { key: '4', orderId: '7721156', accountId: '861005', type: 'Sell', symbol: 'GBPUSD', volume: '0.30', openPrice: '1.27850', openTime: '2026-07-06 16:15:30', closePrice: '1.27530', closeTime: '2026-07-06 19:22:18', sl: '1.28500', tp: '1.26000', fee: '-3.00', swaps: '-0.45', profit: '91.55' },
        { key: '5', orderId: '7721201', accountId: '55120', type: 'Buy', symbol: 'USDJPY', volume: '0.10', openPrice: '157.800', openTime: '2026-07-05 09:05:11', closePrice: '157.350', closeTime: '2026-07-05 14:40:55', sl: '156.000', tp: '160.000', fee: '-1.50', swaps: '0.20', profit: '-46.80' }
    ];

    const [tableData, setTableData] = useState(rawData);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // 💡 分页切片数据
    const startIndex = (currentPage - 1) * pageSize;
    const currentPageData = tableData.slice(startIndex, startIndex + pageSize);

    // 🚀【高精准动态求和】（无论数据如何筛选，均根据当前页数据动态累加）
    const totalSl = currentPageData.reduce((acc, curr) => acc + (parseFloat(curr.sl) || 0), 0).toFixed(5);
    const totalTp = currentPageData.reduce((acc, curr) => acc + (parseFloat(curr.tp) || 0), 0).toFixed(5);
    const totalFee = currentPageData.reduce((acc, curr) => acc + (parseFloat(curr.fee) || 0), 0).toFixed(2);
    const totalSwaps = currentPageData.reduce((acc, curr) => acc + (parseFloat(curr.swaps) || 0), 0).toFixed(2);
    const totalProfit = currentPageData.reduce((acc, curr) => acc + (parseFloat(curr.profit) || 0), 0).toFixed(2);

    const handleSearch = () => {
        const values = searchForm.getFieldsValue();
        const { orderId } = values;
        if (!orderId) {
            setTableData(rawData);
            return;
        }
        const filtered = rawData.filter(item => item.orderId.includes(orderId));
        setTableData(filtered);
        setCurrentPage(1);
    };

    const handleReset = () => {
        searchForm.resetFields();
        setTableData(rawData);
        setCurrentPage(1);
    };

    // 🚀 【表头精准控制】：通过断点过滤，确保 md 以下（手机端）只显示最前 6 列！
    const columns = [
        {
            title: '订单编号',
            dataIndex: 'orderId',
            key: 'orderId',
            width: 110,
            render: (text) => <span style={{ fontFamily: 'monospace', fontWeight: '600', color: '#64748b' }}>{text}</span>
        },
        {
            title: '交易账号',
            dataIndex: 'accountId',
            key: 'accountId',
            width: 100,
            render: (text) => <span style={{ color: '#00bba7', fontWeight: '600' }}>{text}</span>
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            align: 'center',
            width: 80,
            render: (text) => {
                const isBuy = text.toLowerCase() === 'buy';
                return <span style={{ color: isBuy ? '#10b981' : '#f43f5e', fontWeight: '700' }}>{text}</span>;
            }
        },
        {
            title: '品种',
            dataIndex: 'symbol',
            key: 'symbol',
            width: 90,
            render: (text) => <span style={{ fontWeight: '600', color: '#1e293b' }}>{text}</span>
        },
        {
            title: '交易量',
            dataIndex: 'volume',
            key: 'volume',
            align: 'right',
            width: 90,
            render: (val) => <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>{val}</span>
        },
        {
            title: '开仓价',
            dataIndex: 'openPrice',
            key: 'openPrice',
            align: 'right',
            width: 100
        },
        {
            title: '开仓时间',
            dataIndex: 'openTime',
            key: 'openTime',
            width: 170,
            responsive: ['lg'],
            render: (text) => <span style={{ color: '#64748b', fontSize: '12px' }}>{text}</span>
        },
        {
            title: '平仓价',
            dataIndex: 'closePrice',
            key: 'closePrice',
            align: 'right',
            width: 110,
            responsive: ['md']
        },
        {
            title: '平仓时间(MT时间)',
            dataIndex: 'closeTime',
            key: 'closeTime',
            width: 170,
            responsive: ['lg'],
            render: (text) => <span style={{ color: '#64748b', fontSize: '12px' }}>{text}</span>
        },
        {
            title: '止损',
            dataIndex: 'sl',
            key: 'sl',
            align: 'right',
            width: 110,
            responsive: ['md']
        },
        {
            title: '手续费($)',
            dataIndex: 'fee',
            key: 'fee',
            align: 'right',
            width: 110,
            responsive: ['md']
        },
        {
            title: '止盈',
            dataIndex: 'tp',
            key: 'tp',
            align: 'right',
            width: 110,
            responsive: ['md']
        },
        {
            title: '利息',
            dataIndex: 'swaps',
            key: 'swaps',
            align: 'right',
            width: 90,
            responsive: ['md']
        },
        {
            title: '盈亏',
            dataIndex: 'profit',
            key: 'profit',
            align: 'right',
            width: 110,
            responsive: ['md'],
            render: (val) => {
                const num = parseFloat(val);
                return (
                    <span style={{ fontWeight: '700', color: num >= 0 ? '#16a34a' : '#f43f5e' }}>
                        {num >= 0 ? `+${val}` : val}
                    </span>
                );
            }
        }
    ];

    // 📱 移动端自适应下钻面板
    const mobileExpandedRowRender = (record) => {
        const itemStyle = { display: 'flex', padding: '10px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '13px' };
        const labelStyle = { width: '130px', color: '#64748b', fontWeight: '500' };
        const valueStyle = { flex: 1, color: '#1e293b' };
        return (
            <div style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                <div style={itemStyle}><div style={labelStyle}>平仓价</div><div style={valueStyle}>{record.closePrice}</div></div>

                <div style={itemStyle}>
                    <div style={labelStyle}>盈亏</div>
                    <div style={{ ...valueStyle, fontWeight: '700', color: parseFloat(record.profit) >= 0 ? '#16a34a' : '#f43f5e' }}>
                        {parseFloat(record.profit) >= 0 ? `+${record.profit}` : record.profit}
                    </div>
                </div>

                <div style={itemStyle}><div style={labelStyle}>止损</div><div style={valueStyle}>{record.sl}</div></div>
                <div style={itemStyle}><div style={labelStyle}>止盈</div><div style={valueStyle}>{record.tp}</div></div>
                <div style={itemStyle}><div style={labelStyle}>手续费($)</div><div style={valueStyle}>{record.fee}</div></div>
                <div style={itemStyle}><div style={labelStyle}>利息</div><div style={valueStyle}>{record.swaps}</div></div>

                {!screens.lg && (
                    <>
                        <div style={itemStyle}><div style={labelStyle}>开仓时间</div><div style={valueStyle}>{record.openTime}</div></div>
                        <div style={{ ...itemStyle, borderBottom: 'none' }}><div style={labelStyle}>平仓时间(MT时间)</div><div style={valueStyle}>{record.closeTime}</div></div>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className={styles.pageGlobalBackground}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>

                {/* 标题与面包屑对齐区 */}
                <div className={styles.tableTitleArea} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                        交易历史
                    </h2>
                    {!isMobile && (
                        <div className={styles.breadcrumb}>
                            <span>我的交易</span> &gt; <span className={styles.breadcrumbActive}>交易历史</span>
                        </div>
                    )}
                </div>

                {/* 查询卡片 */}
                <Card variant="none" className="broker-filter-card" style={{ borderRadius: '6px' }}>
                    <Form form={searchForm} layout="horizontal" className={styles.compactForm} onFinish={handleSearch}>
                        <div className={styles.filterResponsiveContainer}>
                            <div className={styles.filterItem} style={{ flex: '1.2' }}>
                                <span className={styles.inputLabel}>订单编号</span>
                                <Form.Item name="orderId" style={{ margin: 0, display: 'inline-block', width: 'calc(100% - 70px)', marginLeft: '8px' }}>
                                    <Input placeholder="订单编号" style={{ height: '36px' }} allowClear onPressEnter={handleSearch} />
                                </Form.Item>
                            </div>
                            <div className={styles.filterItem}>
                                <DatePicker placeholder="开仓开始时间" style={{ height: '36px', width: '100%' }} />
                            </div>
                            <div className={styles.filterItem}>
                                <DatePicker placeholder="开仓结束时间" style={{ height: '36px', width: '100%' }} />
                            </div>
                            <div className={`${styles.filterItem} ${styles.filterButtons}`} style={{ flex: '0.8' }}>
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
                        rowClassName={() => styles.modernFancyRow}
                        pagination={false}
                        expandable={{
                            expandedRowRender: mobileExpandedRowRender,
                            rowExpandable: (record) => isMobile || !screens.lg,
                            columnWidth: 45,
                            expandIconColumnIndex: 0
                        }}
                    />

                    {/* 翻页底衬：左右两端对齐 */}
                    <div className={styles.customPaginationBar}>
                        <div className={styles.paginationLeftWrapper}>
                            <div className={styles.paginationLeftInfo}>
                                显示第 {tableData.length === 0 ? 0 : startIndex + 1} 至 {Math.min(currentPage * pageSize, tableData.length)} 项结果，共 {tableData.length} 项
                            </div>
                            <div className={styles.totalSumArea}>
                                合计：
                                止损: <span className={styles.sumHighlight}>{totalSl}</span>&nbsp;&nbsp;
                                止盈: <span className={styles.sumHighlight}>{totalTp}</span>&nbsp;&nbsp;
                                手续费($): <span className={styles.sumHighlight}>{totalFee}</span>&nbsp;&nbsp;
                                利息: <span className={styles.sumHighlight}>{totalSwaps}</span>&nbsp;&nbsp;
                                盈亏: <span className={styles.profitHighlight} style={{ color: parseFloat(totalProfit) >= 0 ? '#16a34a' : '#f43f5e' }}>{totalProfit}</span>
                            </div>
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
                                        className={styles.nativePageSizeSelectorMini}
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