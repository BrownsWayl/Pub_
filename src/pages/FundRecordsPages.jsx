import React, { useState } from 'react';
import { Table, Form, Input, Button, Card, Grid, Pagination, Select, DatePicker } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
// 🚀 引入专属的模块化样式表
import styles from './FundRecordsPage.module.css';

const { Option } = Select;
const { useBreakpoint } = Grid;

export const FundRecordsPage = () => {
    const screens = useBreakpoint();
    const [searchForm] = Form.useForm();

    // 💡 判定当前是否为移动端
    const isMobile = screens.md === false;

    // 🚀 100% 对应截图中的真实 10 条测试数据
    const rawData = [
        { key: '1', accountId: '55120', deposit: '0.00', withdraw: '2154.00', adjust: '0.00', type: '出金', time: '2026-07-15 14:52:11', remark: 'Withdraw' },
        { key: '2', accountId: '55120', deposit: '0.00', withdraw: '5000.00', adjust: '0.00', type: '出金', time: '2026-07-01 09:28:18', remark: 'u出金' },
        { key: '3', accountId: '55120', deposit: '0.00', withdraw: '1.00', adjust: '0.00', type: '内转出金', time: '2026-06-25 16:59:08', remark: 'from 55120 to 861064' },
        { key: '4', accountId: '55120', deposit: '0.00', withdraw: '1.00', adjust: '0.00', type: '内转出金', time: '2026-06-25 16:55:37', remark: 'from 55120 to 861005' },
        { key: '5', accountId: '861005', deposit: '1.00', withdraw: '0.00', adjust: '0.00', type: '内转入金', time: '2026-06-25 16:55:37', remark: 'from 55120 to 861005' },
        { key: '6', accountId: '861005', deposit: '25148.00', withdraw: '0.00', adjust: '0.00', type: '入金', time: '2026-06-15 09:37:56', remark: 'Deposit' },
        { key: '7', accountId: '55120', deposit: '0.00', withdraw: '300.00', adjust: '0.00', type: '出金', time: '2026-06-08 20:03:22', remark: 'Withdraw' },
        { key: '8', accountId: '861005', deposit: '16000.00', withdraw: '0.00', adjust: '0.00', type: '入金', time: '2026-06-08 19:57:03', remark: 'Deposit' },
        { key: '9', accountId: '861005', deposit: '0.00', withdraw: '3072.08', adjust: '0.00', type: '出金', time: '2026-05-29 19:02:06', remark: 'Withdraw' },
        { key: '10', accountId: '55120', deposit: '0.00', withdraw: '6000.00', adjust: '0.00', type: '出金', time: '2026-05-29 19:00:54', remark: 'Withdraw' }
    ];

    const [tableData, setTableData] = useState(rawData);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // 💡 分页切片数据
    const startIndex = (currentPage - 1) * pageSize;
    const currentPageData = tableData.slice(startIndex, startIndex + pageSize);

    // 🚀【核心动态计算逻辑】：基于当前页面展示的数据（currentPageData）进行动态求和
    // 如果你希望计算“全部过滤后数据”的合计，把 currentPageData 换成 tableData 即可。目前这里保持计算当前展示页的 10 条数据。
    const calculatedDepositTotal = currentPageData
        .reduce((sum, item) => {
            const val = parseFloat(String(item.deposit).replace(/,/g, '')) || 0;
            return sum + val;
        }, 0)
        .toFixed(2);

    const calculatedWithdrawTotal = currentPageData
        .reduce((sum, item) => {
            const val = parseFloat(String(item.withdraw).replace(/,/g, '')) || 0;
            return sum + val;
        }, 0)
        .toFixed(2);

    const handleSearch = () => {
        const values = searchForm.getFieldsValue();
        const { searchInfo, fundType } = values;
        let filtered = rawData;

        if (searchInfo) {
            filtered = filtered.filter(item =>
                item.accountId.includes(searchInfo) ||
                item.remark.toLowerCase().includes(searchInfo.toLowerCase())
            );
        }
        if (fundType && fundType !== '全部类型') {
            filtered = filtered.filter(item => item.type === fundType);
        }
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
            title: '交易账号',
            dataIndex: 'accountId',
            key: 'accountId',
            width: 110,
            render: (text) => <span style={{ color: '#00bba7', fontWeight: '600' }}>{text}</span>
        },
        {
            title: '入金金额',
            dataIndex: 'deposit',
            key: 'deposit',
            align: 'left',
            width: 120,
            responsive: ['sm'],
            render: (val) => <span style={{ fontWeight: '600', color: parseFloat(val) > 0 ? '#16a34a' : '#475569' }}>{val}</span>
        },
        {
            title: '出金金额',
            dataIndex: 'withdraw',
            key: 'withdraw',
            align: 'left',
            width: 120,
            responsive: ['sm'],
            render: (val) => <span style={{ fontWeight: '600', color: parseFloat(val) > 0 ? '#16a34a' : '#475569' }}>{val}</span>
        },
        {
            title: '调整金额',
            dataIndex: 'adjust',
            key: 'adjust',
            align: 'left',
            width: 110,
            responsive: ['md']
        },
        {
            title: '资金类型',
            dataIndex: 'type',
            key: 'type',
            width: 110,
            render: (text) => {
                let color = '#475569';
                if (text.includes('入金')) color = '#0284c7';
                if (text.includes('出金')) color = '#f97316';
                return <span style={{ color, fontWeight: '600' }}>{text}</span>;
            }
        },
        {
            title: '处理时间',
            dataIndex: 'time',
            key: 'time',
            width: 180,
            responsive: ['lg'],
            render: (text) => <span style={{ color: '#64748b' }}>{text}</span>
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            responsive: ['md'],
            render: (text) => <span style={{ color: '#475569' }}>{text}</span>
        }
    ];

    const mobileExpandedRowRender = (record) => {
        const itemStyle = { display: 'flex', padding: '10px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '13px' };
        const labelStyle = { width: '90px', color: '#64748b', fontWeight: '500' };
        const valueStyle = { flex: 1, color: '#1e293b' };
        return (
            <div style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                {!screens.sm && (
                    <>
                        <div style={itemStyle}><div style={labelStyle}>入金金额</div><div style={valueStyle}>{record.deposit}</div></div>
                        <div style={itemStyle}><div style={labelStyle}>出金金额</div><div style={valueStyle}>{record.withdraw}</div></div>
                    </>
                )}
                {!screens.md && (
                    <>
                        <div style={itemStyle}><div style={labelStyle}>调整金额</div><div style={valueStyle}>{record.adjust}</div></div>
                        <div style={itemStyle}><div style={labelStyle}>备注</div><div style={valueStyle}>{record.remark}</div></div>
                    </>
                )}
                {!screens.lg && (
                    <div style={itemStyle}><div style={labelStyle}>处理时间</div><div style={valueStyle}>{record.time}</div></div>
                )}
            </div>
        );
    };

    return (
        <div className={styles.pageGlobalBackground}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '16px' }}>

                {/* 标题 */}
                <div className={styles.tableTitleArea}>
                    <h2 style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                        资金记录
                    </h2>
                </div>

                {/* 查询卡片 */}
                <Card variant="none" className="broker-filter-card" style={{ borderRadius: '6px' }}>
                    <Form form={searchForm} layout="horizontal" className={styles.compactForm} onFinish={handleSearch}>
                        <div className={styles.filterResponsiveContainer}>
                            <div className={styles.filterItem} style={{ flex: '1.2' }}>
                                <Form.Item name="searchInfo" style={{ margin: 0 }}>
                                    <Input placeholder="请输入账户/金额/备注" style={{ height: '36px' }} allowClear onPressEnter={handleSearch} />
                                </Form.Item>
                            </div>
                            <div className={styles.filterItem}>
                                <Form.Item name="fundType" style={{ margin: 0 }} initialValue="全部类型">
                                    <Select style={{ height: '36px', width: '100%' }}>
                                        <Option value="全部类型">全部类型</Option>
                                        <Option value="入金">入金</Option>
                                        <Option value="出金">出金</Option>
                                        <Option value="内转入金">内转入金</Option>
                                        <Option value="内转出金">内转出金</Option>
                                    </Select>
                                </Form.Item>
                            </div>
                            <div className={styles.filterItem}>
                                <DatePicker placeholder="请选择开始时间" style={{ height: '36px', width: '100%' }} />
                            </div>
                            <div className={styles.filterItem}>
                                <DatePicker placeholder="请选择结束时间" style={{ height: '36px', width: '100%' }} />
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

                    {/* 翻页底衬 */}
                    <div className={styles.customPaginationBar}>
                        <div className={styles.paginationLeftWrapper}>
                            <div className={styles.paginationLeftInfo}>
                                显示第 {tableData.length === 0 ? 0 : startIndex + 1} 至 {Math.min(currentPage * pageSize, tableData.length)} 项结果，共 {tableData.length} 项
                            </div>
                            {/* 🚀 动态渲染计算出的金额合计，带上千分位逗号，且符合绿字高亮风格 */}
                            <div className={styles.totalSumArea}>
                                合计：入金金额：
                                <span className={styles.depositSum}>
                                    {Number(calculatedDepositTotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                                ，出金金额：
                                <span className={styles.withdrawSum}>
                                    {Number(calculatedWithdrawTotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
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