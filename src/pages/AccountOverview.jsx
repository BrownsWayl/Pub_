import React, { useState } from 'react';
import { Row, Col, Card, Avatar, Table, Radio, Segmented } from 'antd';
import { UserOutlined } from '@ant-design/icons';

// ==============================================================================
// 📌 1. 后端数据结构定义 (后端 API 接入点)
// 提示：后续写网络请求时，将 API 返回的 response.data 替换/传入此数据结构即可
// ==============================================================================
export const INITIAL_DATA = {
    // 个人资料数据
    userInfo: {
        username: 'desonfx.xie(1Z4Y)',
        email: 'desonfx.xie@icloud.com',
        phone: '84024318',
        avatar: '' // 用户头像 URL
    },
    // 钱包数据
    wallet: {
        rebateAccount: '55120',
        accountBalance: '1,544.78',
        walletBalance: '0.00000000'
    },
    // 交易账号列表数据
    tradingAccounts: [
        {
            id: '1',
            account: '55120',
            createdDate: '2026-04-13 11:47:01',
            leverage: '1:100',
            balance: '1,544.78',
            equity: '1,544.78',
        },
        {
            id: '2',
            account: '661005',
            createdDate: '2026-04-06 16:07:21',
            leverage: '1:200',
            balance: '65,191.69',
            equity: '65,191.69',
        }
    ],
    // 佣金统计图表数据
    commissionChart: {
        // 本月数据：label为刻度名称，barHeightPct为柱状图高度百分比(0-100)，polylineY为折线图Y坐标值
        currentMonth: [
            { label: '01', barHeightPct: 15, polylineY: 180 },
            { label: '02', barHeightPct: 70, polylineY: 60 },
            { label: '03', barHeightPct: 85, polylineY: 40 },
            { label: '04', barHeightPct: 25, polylineY: 150 }
        ],
        // 上月数据
        lastMonth: [
            { label: '01', barHeightPct: 30, polylineY: 140 },
            { label: '02', barHeightPct: 45, polylineY: 100 },
            { label: '03', barHeightPct: 60, polylineY: 80 },
            { label: '04', barHeightPct: 90, polylineY: 30 }
        ]
    }
};

// ==============================================================================
// 📌 2. 纯 UI 渲染组件 (可接收 props.data，若不传则默认使用上方 INITIAL_DATA)
// ==============================================================================
export const AccountOverview = ({ data = INITIAL_DATA }) => {
    // 交互状态：图表类型（柱状图 / 折线图）与 时间维度（本月 / 上月）
    const [chartType, setChartType] = useState('bar');
    const [timeRange, setTimeRange] = useState('current');

    // 交易账号表格列定义
    const columns = [
        {
            title: '交易账号',
            dataIndex: 'account',
            key: 'account',
            render: (text) => <span style={{ color: '#2563eb', fontWeight: 500 }}>{text}</span>,
        },
        {
            title: '开户日期',
            dataIndex: 'createdDate',
            key: 'createdDate',
            align: 'center',
        },
        {
            title: '杠杆',
            dataIndex: 'leverage',
            key: 'leverage',
            align: 'center',
        },
        {
            title: '余额',
            dataIndex: 'balance',
            key: 'balance',
            align: 'right',
        },
        {
            title: '净值',
            dataIndex: 'equity',
            key: 'equity',
            align: 'right',
        },
    ];

    // 获取当前时间维度（本月/上月）下的图表数据点
    const activeChartData = timeRange === 'current' 
        ? data.commissionChart.currentMonth 
        : data.commissionChart.lastMonth;

    // 动态拼接折线图 SVG 点坐标字符串
    const svgPolylinePoints = activeChartData.map((item, index) => {
        const xStep = 800 / (activeChartData.length - 1 || 1);
        const x = index * xStep;
        return `${x},${item.polylineY}`;
    }).join(' ');

    return (
        <div style={{ padding: '20px', backgroundColor: '#f1f5f9', minHeight: '100%' }}>
            {/* 上半部分：个人资料、钱包、交易账号 */}
            <Row gutter={[16, 16]}>
                {/* 1. 个人资料 */}
                <Col xs={24} md={8} lg={6}>
                    <Card
                        title={<span style={{ fontSize: '16px', fontWeight: 'bold' }}>个人资料</span>}
                        bordered={false}
                        style={{ height: '100%', borderRadius: '8px' }}
                        bodyStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '10px' }}
                    >
                        <Avatar
                            size={90}
                            icon={<UserOutlined />}
                            src={data.userInfo.avatar || undefined}
                            style={{ backgroundColor: '#fde047', marginBottom: '16px' }}
                        />
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a', marginBottom: '4px' }}>
                            {data.userInfo.username || '--'}
                        </div>
                        <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '2px' }}>
                            邮箱:{data.userInfo.email || '--'}
                        </div>
                        <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                            手机号:{data.userInfo.phone || '--'}
                        </div>
                    </Card>
                </Col>

                {/* 2. 钱包 */}
                <Col xs={24} md={8} lg={6}>
                    <Card
                        title={<span style={{ fontSize: '16px', fontWeight: 'bold' }}>钱包</span>}
                        bordered={false}
                        style={{ height: '100%', borderRadius: '8px' }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#475569', fontSize: '14px' }}>
                            <div>
                                返佣账户: <span style={{ fontWeight: 500, color: '#1e293b' }}>{data.wallet.rebateAccount || '--'}</span>
                            </div>
                            <div>
                                账户余额: <span style={{ fontWeight: 500, color: '#1e293b' }}>{data.wallet.accountBalance || '--'}</span>
                            </div>
                            <div>
                                钱包余额: <span style={{ fontWeight: 500, color: '#1e293b' }}>{data.wallet.walletBalance || '--'}</span>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* 3. 交易账号 */}
                <Col xs={24} md={8} lg={12}>
                    <Card
                        title={<span style={{ fontSize: '16px', fontWeight: 'bold' }}>交易账号</span>}
                        bordered={false}
                        style={{ height: '100%', borderRadius: '8px' }}
                        bodyStyle={{ padding: '0 16px 16px 16px' }}
                    >
                        <Table
                            columns={columns}
                            dataSource={data.tradingAccounts}
                            pagination={false}
                            size="small"
                            rowKey="id"
                        />
                    </Card>
                </Col>
            </Row>

            {/* 下半部分：佣金统计与图表 */}
            <Row style={{ marginTop: '16px' }}>
                <Col span={24}>
                    <Card
                        title={<span style={{ fontSize: '16px', fontWeight: 'bold' }}>佣金统计</span>}
                        bordered={false}
                        style={{ borderRadius: '8px' }}
                    >
                        {/* 图表控制项 */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                            <div>
                                <Segmented
                                    value={chartType}
                                    onChange={setChartType}
                                    options={[
                                        { label: '柱状图', value: 'bar' },
                                        { label: '折线图', value: 'line' },
                                    ]}
                                />
                            </div>
                            <div>
                                <Radio.Group value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                                    <Radio value="current">本月</Radio>
                                    <Radio value="last">上月</Radio>
                                </Radio.Group>
                            </div>
                        </div>

                        {/* 图表内容区 */}
                        <div style={{
                            height: '260px',
                            position: 'relative',
                            borderTop: '1px solid #f1f5f9',
                            paddingTop: '20px'
                        }}>
                            {/* 柱状图 */}
                            {chartType === 'bar' && (
                                <div style={{
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    justifyContent: 'space-around',
                                    padding: '0 40px'
                                }}>
                                    {activeChartData.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                                            <div style={{ width: '40px', height: `${item.barHeightPct}%`, backgroundColor: '#f87171', borderRadius: '2px 2px 0 0', transition: 'all 0.3s' }}></div>
                                            <span style={{ marginTop: '8px', fontSize: '12px', color: '#64748b' }}>{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* 折线图 */}
                            {chartType === 'line' && (
                                <div style={{ height: '100%', position: 'relative', padding: '0 40px' }}>
                                    <svg style={{ width: '100%', height: '80%', overflow: 'visible' }} viewBox="0 0 800 200" preserveAspectRatio="none">
                                        <polyline
                                            fill="none"
                                            stroke="#f87171"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            points={svgPolylinePoints}
                                        />
                                    </svg>
                                    <div style={{
                                        display: 'flex',
                                        justify: 'space-between',
                                        marginTop: '12px',
                                        padding: '0 10px',
                                        color: '#64748b',
                                        fontSize: '12px'
                                    }}>
                                        {activeChartData.map((item, idx) => (
                                            <span key={idx}>{item.label}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AccountOverview;