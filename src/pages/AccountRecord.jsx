import React, { useState, useEffect } from 'react';
import { Table, Form, Select, DatePicker, Button, Card, Grid, Pagination, message, Modal, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined, ExclamationCircleOutlined, FileTextOutlined, CloseCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { mockBackendDb } from '../utils/api';
// 🚀 引入专属于 AccountRecord 页面的模块化样式
import styles from './AccountRecord.module.css';

const { Option } = Select;
const { useBreakpoint } = Grid;

export const AccountRecord = () => {
    const screens = useBreakpoint();
    const [searchForm] = Form.useForm();

    // 💡 判定当前是否为移动端
    const isMobile = screens.md === false;

    // 🚀 模拟数据源（100% 对应截图逻辑 + 提供更丰富的操作体验）
    const rawData = [
        { key: '1', accountId: '55120', amount: '1500.00', type: '出金', applyTime: '2026-08-19 14:22:11', status: '待审核', auditTime: '-', feedback: '等待财务人员审核处理', action: '撤销' },
        { key: '2', accountId: '861005', amount: '5000.00', type: '入金', applyTime: '2026-08-18 09:15:30', status: '已通过', auditTime: '2026-08-18 09:30:12', feedback: '审核通过，资金已到账', action: '-' },
        { key: '3', accountId: '861064', amount: '200.00', type: '内转', applyTime: '2026-08-17 11:40:22', status: '已通过', auditTime: '2026-08-17 11:45:00', feedback: '转账成功', action: '-' },
        { key: '4', accountId: '55123', amount: '300.00', type: '出金', applyTime: '2026-08-16 16:12:05', status: '被拒绝', auditTime: '2026-08-16 17:00:10', feedback: '拒绝原因：绑定的银行卡姓名不符', action: '-' },
        { key: '5', accountId: '55120', amount: '10000.00', type: '入金', applyTime: '2026-08-15 10:30:00', status: '已通过', auditTime: '2026-08-15 10:45:00', feedback: '审核通过，资金已到账', action: '-' },
        { key: '6', accountId: '861005', amount: '1200.00', type: '出金', applyTime: '2026-08-14 15:20:00', status: '已通过', auditTime: '2026-08-14 16:00:00', feedback: '出金成功，已汇出', action: '-' },
        { key: '7', accountId: '852009', amount: '0.00', type: '开立交易账户', applyTime: '2026-08-12 09:10:00', status: '已通过', auditTime: '2026-08-12 09:40:00', feedback: '交易账号开立成功：852009', action: '-' }
    ];

    // 💡 状态管理与数据模拟抓取
    const [tableData, setTableData] = useState([]);
    const [tableLoading, setTableLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // 💡 Modals 显隐及对应记录的 State 声明
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
    const [terminatingKey, setTerminatingKey] = useState(null);

    // 🚀【生命周期挂载】：模拟每次访问/挂载页面时从后端抓取数据的动作 (Antd Table Loading 呈现)
    useEffect(() => {
        setTableLoading(true);
        const timer = setTimeout(() => {
            // 合并内存共享库中的 customRecords 与原始静态 rawData
            const combined = [...mockBackendDb.customRecords, ...rawData];
            setTableData(combined);
            setTableLoading(false);
        }, 800); // 800 毫秒的延时，模拟网络往返
        return () => clearTimeout(timer);
    }, []);

    // 💡 计算分页切片数据
    const startIndex = (currentPage - 1) * pageSize;
    const currentPageData = tableData.slice(startIndex, startIndex + pageSize);

    // 🚀【核心动态计算】：计算符合当前筛选条件的总申请金额
    const calculatedAmountTotal = currentPageData
        .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
        .toFixed(2);

    // 🔍 查询操作 (模拟接口调用，附带抓取加载状态)
    const handleSearch = () => {
        setTableLoading(true);
        setTimeout(() => {
            const values = searchForm.getFieldsValue();
            const { type, status, startDate, endDate } = values;
            
            let filtered = [...mockBackendDb.customRecords, ...rawData];

            // 类型筛选
            if (type && type !== '全部类型') {
                filtered = filtered.filter(item => item.type === type);
            }

            // 状态筛选
            if (status && status !== '所有状态') {
                filtered = filtered.filter(item => item.status === status);
            }

            // 时间筛选 (开始时间)
            if (startDate) {
                const startStr = startDate.format('YYYY-MM-DD');
                filtered = filtered.filter(item => dayjs(item.applyTime).isAfter(dayjs(startStr).startOf('day')));
            }

            // 时间筛选 (结束时间)
            if (endDate) {
                const endStr = endDate.format('YYYY-MM-DD');
                filtered = filtered.filter(item => dayjs(item.applyTime).isBefore(dayjs(endStr).endOf('day')));
            }

            setTableData(filtered);
            setTableLoading(false);
            setCurrentPage(1);
        }, 400);
    };

    // 🔄 重置操作 (模拟接口重置，附带抓取加载状态)
    const handleReset = () => {
        searchForm.resetFields();
        setTableLoading(true);
        setTimeout(() => {
            setTableData([...mockBackendDb.customRecords, ...rawData]);
            setTableLoading(false);
            setCurrentPage(1);
        }, 400);
    };

    // ❌ 撤销申请操作 (标准数据)
    const handleCancel = (key) => {
        Modal.confirm({
            title: '确认撤销该申请吗？',
            icon: <ExclamationCircleOutlined style={{ color: '#ef4444' }} />,
            content: '撤销后申请将无法恢复，系统将取消后续的处理。',
            okText: '确定撤销',
            cancelText: '取消',
            okButtonProps: { danger: true, style: { background: '#ef4444', borderColor: '#ef4444' } },
            centered: true,
            onOk() {
                const updatedData = tableData.map(item => {
                    if (item.key === key) {
                        return {
                            ...item,
                            status: '被拒绝',
                            feedback: '用户已撤销申请',
                            auditTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
                        };
                    }
                    return item;
                });
                setTableData(updatedData);
                message.success('申请撤销成功！');
            }
        });
    };

    // 🔍 弹出详情弹窗
    const handleShowDetail = (record) => {
        setSelectedRecord(record);
        setIsDetailModalOpen(true);
    };

    // ❌ 弹出终止弹窗
    const handleOpenTerminate = (key) => {
        setTerminatingKey(key);
        setIsTerminateModalOpen(true);
    };

    // ⚙️ 确认删除/终止内存中的自定义开户记录并向后台同步
    const handleConfirmTerminate = () => {
        if (terminatingKey) {
            // 从内存共享数据库 mockBackendDb.customRecords 中过滤并移除该项
            mockBackendDb.customRecords = mockBackendDb.customRecords.filter(item => item.key !== terminatingKey);
            
            setTableLoading(true);
            setTimeout(() => {
                setTableData([...mockBackendDb.customRecords, ...rawData]);
                setTableLoading(false);
                message.success('开户申请已成功终止，删除指令已传送并同步至后台！');
            }, 500);

            setIsTerminateModalOpen(false);
            setTerminatingKey(null);
        }
    };

    // 🎨 渲染详情弹窗内的自定义两列 Key-Value 排版
    const renderDetailContent = () => {
        if (!selectedRecord) return null;
        
        const payload = selectedRecord.submitPayload || {};
        const basicInfo = payload.basicInfo || {};
        const bankInfo = payload.bankAndTypeInfo || {};
        const kycStr = selectedRecord.kycDataString || payload.kycDataString || '';
        
        // 智能转化 KYC 习惯/答案
        const getInvestExperience = () => {
            if (kycStr.length >= 8) {
                const char = kycStr[7];
                if (char === 'A') return '没有';
                if (char === 'B') return '少于1年';
                if (char === 'C') return '1-5年';
                if (char === 'D') return '超过5年';
            }
            return '股票/债券';
        };
        
        const getAnnualIncome = () => {
            if (kycStr.length >= 5) {
                const char = kycStr[4];
                if (char === 'A') return '少于$15000';
                if (char === 'B') return '$15000-50000';
                if (char === 'C') return '$50000以上';
            }
            return '少于$15000';
        };
        
        const getNetAsset = () => {
            if (kycStr.length >= 6) {
                const char = kycStr[5];
                if (char === 'A') return '少于$50000';
                if (char === 'B') return '$50000-100000';
                if (char === 'C') return '$100000以上';
            }
            return '少于$50000';
        };

        const gridItemStyle = {
            display: 'flex',
            marginBottom: '16px',
            fontSize: '14px',
            lineHeight: '1.5'
        };
        
        const labelStyle = {
            width: '120px',
            color: '#64748b',
            fontWeight: '500',
            textAlign: 'right',
            marginRight: '12px',
            display: 'inline-block'
        };
        
        const valueStyle = {
            flex: 1,
            color: '#1e293b',
            fontWeight: '500'
        };

        // 从全局共享内存中拉取上传的 base64 证件，如无则回退至截图效果中的 placeholder 图
        const idFrontSrc = mockBackendDb.images.last_id_front_img || '/3-3.jpg';
        const idBackSrc = mockBackendDb.images.last_id_back_img || '/3-4.jpg';
        const bankProofSrc = mockBackendDb.images.last_bank_proof_img || ''; 
        const addressProofSrc = mockBackendDb.images.last_address_proof_img || '';

        return (
            <div style={{ padding: '10px 0' }}>
                <Row gutter={[24, 0]}>
                    <Col span={12}>
                        <div style={gridItemStyle}>
                            <span style={labelStyle}>申请账号：</span>
                            <span style={valueStyle}>{selectedRecord.accountId || '-'}</span>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={gridItemStyle}>
                            <span style={labelStyle}>开户类型：</span>
                            <span style={valueStyle}>
                                {bankInfo.clientType === 'Individual' || selectedRecord.clientType === 'Individual' ? 'TA开户' : 'TA开户'}
                            </span>
                        </div>
                    </Col>
                    
                    <Col span={12}>
                        <div style={gridItemStyle}>
                            <span style={labelStyle}>用户名：</span>
                            <span style={valueStyle}>{basicInfo.realName || 'a123456'}</span>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={gridItemStyle}>
                            <span style={labelStyle}>国家：</span>
                            <span style={valueStyle}>
                                {basicInfo.country === 'China' || !basicInfo.country ? '中国' : '中国'}
                            </span>
                        </div>
                    </Col>
                    
                    <Col span={12}>
                        <div style={gridItemStyle}>
                            <span style={labelStyle}>省份：</span>
                            <span style={valueStyle}>{basicInfo.province || 'OR'}</span>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={gridItemStyle}>
                            <span style={labelStyle}>城市：</span>
                            <span style={valueStyle}>{basicInfo.city || 'Portland'}</span>
                        </div>
                    </Col>
                    
                    <Col span={12}>
                        <div style={gridItemStyle}>
                            <span style={labelStyle}>证件类型：</span>
                            <span style={valueStyle}>
                                {basicInfo.idType === 'IDCard' ? '身份证' : basicInfo.idType === 'Passport' || !basicInfo.idType ? '护照' : '护照'}
                            </span>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={gridItemStyle}>
                            <span style={labelStyle}>证件号码：</span>
                            <span style={valueStyle}>{basicInfo.idNumber || "a\\'s\\'d\\'fa\\'s\'d\\'f"}</span>
                        </div>
                    </Col>
                    
                    <Col span={12}>
                        <div style={gridItemStyle}>
                            <span style={labelStyle}>投资经验：</span>
                            <span style={valueStyle}>{getInvestExperience()}</span>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={gridItemStyle}>
                            <span style={labelStyle}>预计年收入：</span>
                            <span style={valueStyle}>{getAnnualIncome()}</span>
                        </div>
                    </Col>
                    
                    <Col span={12}>
                        <div style={gridItemStyle}>
                            <span style={labelStyle}>净资产价值：</span>
                            <span style={valueStyle}>{getNetAsset()}</span>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={gridItemStyle}>
                            <span style={labelStyle}>身份证明(正)：</span>
                            <span style={valueStyle}>
                                {idFrontSrc ? (
                                    <img src={idFrontSrc} alt="ID Front" style={{ width: '130px', height: '70px', borderRadius: '4px', border: '1px solid #cbd5e1', objectFit: 'cover' }} />
                                ) : '-'}
                            </span>
                        </div>
                    </Col>
                    
                    <Col span={12}>
                        <div style={gridItemStyle}>
                            <span style={labelStyle}>身份证明(反)：</span>
                            <span style={valueStyle}>
                                {idBackSrc ? (
                                    <img src={idBackSrc} alt="ID Back" style={{ width: '130px', height: '70px', borderRadius: '4px', border: '1px solid #cbd5e1', objectFit: 'cover' }} />
                                ) : '-'}
                            </span>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={gridItemStyle}>
                            <span style={labelStyle}>银行卡证明：</span>
                            <span style={valueStyle}>
                                {bankProofSrc ? (
                                    <img src={bankProofSrc} alt="Bank Proof" style={{ width: '130px', height: '70px', borderRadius: '4px', border: '1px solid #cbd5e1', objectFit: 'cover' }} />
                                ) : '-'}
                            </span>
                        </div>
                    </Col>
                    
                    <Col span={12}>
                        <div style={gridItemStyle}>
                            <span style={labelStyle}>地址证件照：</span>
                            <span style={valueStyle}>
                                {addressProofSrc ? (
                                    <img src={addressProofSrc} alt="Address Proof" style={{ width: '130px', height: '70px', borderRadius: '4px', border: '1px solid #cbd5e1', objectFit: 'cover' }} />
                                ) : '-'}
                            </span>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={gridItemStyle}>
                            <span style={labelStyle}>申请时间：</span>
                            <span style={valueStyle}>{selectedRecord.applyTime}</span>
                        </div>
                    </Col>
                    
                    <Col span={12}>
                        <div style={gridItemStyle}>
                            <span style={labelStyle}>申请备注：</span>
                            <span style={valueStyle}>{selectedRecord.remark || '-'}</span>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={gridItemStyle}>
                            <span style={labelStyle}>审核时间：</span>
                            <span style={valueStyle}>{selectedRecord.auditTime || '2026-08-20 15:02:26'}</span>
                        </div>
                    </Col>
                    
                    <Col span={12}>
                        <div style={gridItemStyle}>
                            <span style={labelStyle}>审核状态：</span>
                            <span style={valueStyle}>
                                <span style={{ color: '#0284c7', fontWeight: '600' }}>处理中</span>
                            </span>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={gridItemStyle}>
                            <span style={labelStyle}>处理反馈：</span>
                            <span style={valueStyle}>{selectedRecord.feedback || '请上传正确的资料'}</span>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    };

    // 💡 列定义：100% 对应截图 + 全局优雅响应式
    const columns = [
        {
            title: '申请账号',
            dataIndex: 'accountId',
            key: 'accountId',
            width: 120,
            render: (text) => <span style={{ color: '#00bba7', fontWeight: '600' }}>{text || '-'}</span>
        },
        {
            title: '金额($)',
            dataIndex: 'amount',
            key: 'amount',
            align: 'right',
            width: 120,
            render: (val) => (
                <span style={{ fontFamily: 'monospace', fontWeight: '600', color: '#1e293b' }}>
                    {parseFloat(val) > 0 ? `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                </span>
            )
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            width: 120,
            render: (text) => {
                let color = '#475569';
                if (text === '入金') color = '#10b981';
                if (text === '出金') color = '#f97316';
                if (text === '内转') color = '#0284c7';
                if (text === '开立交易账户') color = '#8b5cf6';
                if (text === '开户') color = '#0ea5e9'; // 青蓝色
                return <span style={{ color, fontWeight: '600' }}>{text}</span>;
            }
        },
        {
            title: '申请时间',
            dataIndex: 'applyTime',
            key: 'applyTime',
            width: 170,
            responsive: ['md'],
            render: (text) => <span style={{ color: '#64748b', fontSize: '13px' }}>{text}</span>
        },
        {
            title: '审核状态',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            width: 110,
            render: (text) => {
                if (text === '待处理') {
                    return (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <span style={{ color: '#fbbf24', fontSize: '14px', lineHeight: 1 }}>●</span>
                            <span style={{ color: '#475569', fontWeight: '600', fontSize: '12px' }}>待处理</span>
                        </div>
                    );
                }
                let color = '#71717a';
                let bg = '#f4f4f5';
                let borderColor = '#e4e4e7';
                if (text === '待审核') {
                    color = '#d97706';
                    bg = '#fef3c7';
                    borderColor = '#fde68a';
                } else if (text === '已通过') {
                    color = '#059669';
                    bg = '#d1fae5';
                    borderColor = '#a7f3d0';
                } else if (text === '被拒绝') {
                    color = '#dc2626';
                    bg = '#fee2e2';
                    borderColor = '#fecaca';
                }
                return (
                    <span style={{
                        color,
                        background: bg,
                        border: `1px solid ${borderColor}`,
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'inline-block'
                    }}>
                        {text}
                    </span>
                );
            }
        },
        {
            title: '审核时间',
            dataIndex: 'auditTime',
            key: 'auditTime',
            width: 170,
            responsive: ['lg'],
            render: (text) => <span style={{ color: '#64748b', fontSize: '13px' }}>{text}</span>
        },
        {
            title: '处理反馈',
            dataIndex: 'feedback',
            key: 'feedback',
            responsive: ['md'],
            render: (text) => <span style={{ color: '#475569', fontSize: '13px' }}>{text || '-'}</span>
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 120,
            render: (_, record) => {
                if (record.type === '开户') {
                    return (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            <Button
                                type="text"
                                style={{
                                    border: '1px solid #00bba7',
                                    borderRadius: '4px',
                                    padding: '2px',
                                    height: '28px',
                                    width: '28px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleShowDetail(record)}
                            >
                                <FileTextOutlined style={{ color: '#00bba7', fontSize: '15px' }} />
                            </Button>
                            <Button
                                type="text"
                                style={{
                                    border: '1px solid #ef4444',
                                    borderRadius: '4px',
                                    padding: '2px',
                                    height: '28px',
                                    width: '28px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleOpenTerminate(record.key)}
                            >
                                <CloseCircleOutlined style={{ color: '#ef4444', fontSize: '15px' }} />
                            </Button>
                        </div>
                    );
                }
                if (record.status === '待审核') {
                    return (
                        <Button
                            type="link"
                            danger
                            size="small"
                            style={{ fontWeight: '500', padding: 0 }}
                            onClick={() => handleCancel(record.key)}
                        >
                            撤销
                        </Button>
                    );
                }
                return <span style={{ color: '#cbd5e1' }}>-</span>;
            }
        }
    ];

    // 💡 移动端折叠行渲染，展现隐藏的详情
    const mobileExpandedRowRender = (record) => {
        const itemStyle = { display: 'flex', padding: '10px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '13px' };
        const labelStyle = { width: '90px', color: '#64748b', fontWeight: '500' };
        const valueStyle = { flex: 1, color: '#1e293b' };
        return (
            <div style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                {!screens.md && (
                    <>
                        <div style={itemStyle}><div style={labelStyle}>申请时间</div><div style={valueStyle}>{record.applyTime}</div></div>
                        <div style={itemStyle}><div style={labelStyle}>处理反馈</div><div style={valueStyle}>{record.feedback}</div></div>
                    </>
                )}
                {!screens.lg && (
                    <div style={itemStyle}><div style={labelStyle}>审核时间</div><div style={valueStyle}>{record.auditTime}</div></div>
                )}
            </div>
        );
    };

    return (
        <div className={styles.pageGlobalBackground}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '16px' }}>

                {/* 标题 & 面包屑（100% 对应截图） */}
                <div className={styles.tableTitleArea}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <h2 style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                            申请记录
                        </h2>
                        <div className={styles.breadcrumb}>
                            账户信息 <span style={{ margin: '0 4px', color: '#cbd5e1' }}>&gt;</span> <span className={styles.breadcrumbActive}>申请记录</span>
                        </div>
                    </div>
                </div>

                {/* 查询卡片 */}
                <Card variant="none" className="broker-filter-card" style={{ borderRadius: '6px' }}>
                    <Form form={searchForm} layout="horizontal" className={styles.compactForm} onFinish={handleSearch}>
                        <div className={styles.filterResponsiveContainer}>
                            
                            {/* 1. 类型筛选 */}
                            <div className={styles.filterItem}>
                                <Form.Item name="type" style={{ margin: 0 }} initialValue="全部类型">
                                    <Select style={{ height: '36px', width: '100%' }}>
                                        <Option value="全部类型">全部类型</Option>
                                        <Option value="入金">入金</Option>
                                        <Option value="出金">出金</Option>
                                        <Option value="内转">内转</Option>
                                        <Option value="开立交易账户">开立交易账户</Option>
                                        <Option value="开户">开户</Option>
                                    </Select>
                                </Form.Item>
                            </div>

                            {/* 2. 状态筛选 */}
                            <div className={styles.filterItem}>
                                <Form.Item name="status" style={{ margin: 0 }} initialValue="所有状态">
                                    <Select style={{ height: '36px', width: '100%' }}>
                                        <Option value="所有状态">所有状态</Option>
                                        <Option value="待处理">待处理</Option>
                                        <Option value="待审核">待审核</Option>
                                        <Option value="已通过">已通过</Option>
                                        <Option value="被拒绝">被拒绝</Option>
                                    </Select>
                                </Form.Item>
                            </div>

                            {/* 3. 开始时间选择 */}
                            <div className={styles.filterItem}>
                                <Form.Item name="startDate" style={{ margin: 0 }}>
                                    <DatePicker placeholder="请选择开始时间" style={{ height: '36px', width: '100%' }} />
                                </Form.Item>
                            </div>

                            {/* 4. 结束时间选择 */}
                            <div className={styles.filterItem}>
                                <Form.Item name="endDate" style={{ margin: 0 }}>
                                    <DatePicker placeholder="请选择结束时间" style={{ height: '36px', width: '100%' }} />
                                </Form.Item>
                            </div>

                            {/* 5. 查询与重置按钮 */}
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
                        loading={tableLoading}
                        expandable={{
                            expandedRowRender: mobileExpandedRowRender,
                            rowExpandable: (record) => isMobile || !screens.lg,
                            columnWidth: 45,
                            expandIconColumnIndex: 0
                        }}
                    />

                    {/* 翻页底衬与数据汇总 */}
                    <div className={styles.customPaginationBar}>
                        <div className={styles.paginationLeftWrapper}>
                            <div className={styles.paginationLeftInfo}>
                                显示第 {tableData.length === 0 ? 0 : startIndex + 1} 至 {Math.min(currentPage * pageSize, tableData.length)} 项结果，共 {tableData.length} 项
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

            {/* 🚀 详情 Modal 弹窗 (100% 对应截图样式) */}
            <Modal
                title={
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                        详情
                    </div>
                }
                open={isDetailModalOpen}
                onCancel={() => setIsDetailModalOpen(false)}
                footer={null}
                width={720}
                centered
                destroyOnClose
            >
                {renderDetailContent()}
            </Modal>

            {/* 🚀 终止确认 Modal 弹窗 (100% 对应截图样式) */}
            <Modal
                title={
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>
                        终止
                    </div>
                }
                open={isTerminateModalOpen}
                onCancel={() => setIsTerminateModalOpen(false)}
                centered
                destroyOnClose
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <Button
                            style={{
                                background: '#00bba7',
                                borderColor: '#00bba7',
                                color: '#ffffff',
                                height: '36px',
                                padding: '0 20px',
                                borderRadius: '4px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                            onClick={handleConfirmTerminate}
                        >
                            确定
                        </Button>
                        <Button
                            style={{
                                background: '#70707a',
                                borderColor: '#70707a',
                                color: '#ffffff',
                                height: '36px',
                                padding: '0 20px',
                                borderRadius: '4px',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                            onClick={() => setIsTerminateModalOpen(false)}
                        >
                            取消
                        </Button>
                    </div>
                }
            >
                <div style={{ padding: '20px 0', fontSize: '14px', color: '#334155' }}>
                    确定要终止申请吗？
                </div>
            </Modal>
        </div>
    );
};