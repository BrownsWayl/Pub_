import React, { useState } from 'react';
import { Table, Grid, Pagination, Button, Modal, Form, Input, message } from 'antd';
import { KeyOutlined } from '@ant-design/icons';
// 🚀 引入专属于 AccountList 页面的模块化样式
import styles from './AccountListPage.module.css';

const { useBreakpoint } = Grid;

export const AccountListPage = () => {
    const screens = useBreakpoint();
    const [form] = Form.useForm();

    // 💡 判定当前是否为移动端
    const isMobile = screens.md === false;

    // 🚀 Modal 状态控制与当前选中的 MT账号
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [currentAccountId, setCurrentAccountId] = useState('');
    const [loading, setLoading] = useState(false);

    // 🚀 模拟数据源
    const rawData = [
        { key: '1', accountId: '55120', username: 'desonfx.xie', openDate: '2026-04-13 11:47:01', leverage: '1:100', balance: '1,258.86', equity: '1,258.86', credit: '0.00', initPassword: 'null' },
        { key: '2', accountId: '861005', username: 'desonfx.xie', openDate: '2026-04-06 16:07:21', leverage: '1:200', balance: '57,332.43', equity: '58,531.00', credit: '1,000.00', initPassword: 'null' },
        { key: '3', accountId: '861004', username: 'desonfx.xie', openDate: '2026-03-22 10:15:30', leverage: '1:400', balance: '250.00', equity: '250.00', credit: '0.00', initPassword: 'null' },
        { key: '4', accountId: '861003', username: 'desonfx.xie', openDate: '2026-03-15 14:22:18', leverage: '1:100', balance: '4,500.00', equity: '4,120.50', credit: '500.00', initPassword: 'null' },
        { key: '5', accountId: '861002', username: 'desonfx.xie', openDate: '2026-02-28 09:05:11', leverage: '1:200', balance: '12,800.00', equity: '12,800.00', credit: '0.00', initPassword: 'null' },
        { key: '6', accountId: '861001', username: 'desonfx.xie', openDate: '2026-02-10 16:40:55', leverage: '1:100', balance: '0.00', equity: '0.00', credit: '0.00', initPassword: 'null' },
        { key: '7', accountId: '852009', username: 'desonfx.xie', openDate: '2026-01-18 11:12:03', leverage: '1:500', balance: '850.25', equity: '850.25', credit: '0.00', initPassword: 'null' }
    ];

    // 💡 状态管理：当前页、页容量
    const [tableData] = useState(rawData);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // 💡 计算分页切片数据
    const indexOfLastRecord = currentPage * pageSize;
    const indexOfFirstRecord = indexOfLastRecord - pageSize;
    const currentRecords = tableData.slice(indexOfFirstRecord, indexOfLastRecord);

    // 🔑 打开修改密码弹窗
    const openPasswordModal = (record) => {
        setCurrentAccountId(record.accountId);
        form.setFieldsValue({ mtAccount: record.accountId });
        setIsPasswordModalOpen(true);
    };

    // 🔒 提交密码修改表单
    const handlePasswordSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            // 🚀 这里对接你的接口：await api.post('/account/change-password', values)
            console.log("提交修改密码参数:", values);

            message.success(`账号 ${currentAccountId} 密码修改成功！`);
            setIsPasswordModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.log("校验失败或修改失败:", error);
        } finally {
            setLoading(false);
        }
    };

    // 💡 列定义：完全适配响应式
    const columns = [
        Table.EXPAND_COLUMN,
        {
            title: '账号',
            dataIndex: 'accountId',
            key: 'accountId',
            render: (text) => <span style={{ fontWeight: 700, color: '#0f172a' }} className={styles.accountHighlight}>{text}</span>
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
            responsive: ['md']
        },
        {
            title: '开户日期',
            dataIndex: 'openDate',
            key: 'openDate',
            responsive: ['md']
        },
        {
            title: '杠杆',
            dataIndex: 'leverage',
            key: 'leverage',
            responsive: ['sm']
        },
        {
            title: '余额',
            dataIndex: 'balance',
            key: 'balance',
            render: (text) => <span style={{ fontWeight: 600, color: '#0284c7' }}>${text}</span>
        },
        {
            title: '净值',
            dataIndex: 'equity',
            key: 'equity',
            render: (text) => <span style={{ fontWeight: 600, color: '#10b981' }}>${text}</span>,
            responsive: ['sm']
        },
        {
            title: '信用额',
            dataIndex: 'credit',
            key: 'credit',
            responsive: ['md']
        },
        {
            title: '初始密码',
            dataIndex: 'initPassword',
            key: 'initPassword',
            render: (text) => text === 'null' ? <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>无</span> : text,
            responsive: ['lg']
        },
        {
            title: '操作',
            key: 'action',
            width: isMobile ? 80 : 180,
            align: 'center',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <Button
                        type="default"
                        icon={<KeyOutlined />}
                        size="small"
                        danger
                        onClick={() => openPasswordModal(record)}
                    >
                        {!isMobile && '修改密码'}
                    </Button>
                </div>
            )
        }
    ];

    // 💡 移动端展开隐藏列的折叠行设计
    const expandableConfig = {
        expandedRowRender: (record) => (
            <div style={{ margin: 0, padding: '8px 16px', background: '#f8fafc', borderRadius: '6px' }}>
                {!screens.md && (
                    <>
                        <p style={{ margin: '4px 0' }}><b>用户名:</b> {record.username}</p>
                        <p style={{ margin: '4px 0' }}><b>开户日期:</b> {record.openDate}</p>
                        <p style={{ margin: '4px 0' }}><b>信用额:</b> ${record.credit}</p>
                    </>
                )}
                {!screens.sm && (
                    <>
                        <p style={{ margin: '4px 0' }}><b>杠杆:</b> {record.leverage}</p>
                        <p style={{ margin: '4px 0' }}><b>净值:</b> <span style={{ color: '#10b981' }}>${record.equity}</span></p>
                    </>
                )}
                {!screens.lg && record.initPassword !== 'null' && (
                    <p style={{ margin: '4px 0' }}><b>初始密码:</b> {record.initPassword}</p>
                )}
            </div>
        ),
        rowExpandable: (record) => isMobile || !screens.lg,
        columnWidth: 45,
    };

    return (
        <div className={styles.pageGlobalBackground}>
            <div style={{ width: '100%', padding: isMobile ? '12px' : '20px 24px' }}>

                {/* 标题区域 */}
                <div className={styles.tableTitleArea} style={{ marginBottom: '16px' }}>
                    <h2 style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                        账户信息列表
                    </h2>
                </div>

                {/* 核心数据表格 */}
                <div className={styles.modernFancyTableWrapper}>
                    <Table
                        columns={columns}
                        dataSource={currentRecords}
                        pagination={false}
                        expandable={expandableConfig}
                        size={isMobile ? 'middle' : 'default'}
                        rowClassName={() => styles.modernFancyRow}
                    />

                    {/* 自定义双端对齐分页条 */}
                    <div className={styles.customPaginationBar}>
                        <div className={styles.paginationLeftInfo}>
                            共 <span style={{ color: '#00bba7', fontWeight: 700 }}>{tableData.length}</span> 条记录
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

            {/* 🚀 更改密码 Modal（100% 还原截图逻辑与项目风格统一） */}
            {/* 🚀 更改密码 Modal（优化居中布局与视觉平衡） */}
            <Modal
                title={<span style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>更改密码</span>}
                open={isPasswordModalOpen}
                onCancel={() => {
                    setIsPasswordModalOpen(false);
                    form.resetFields();
                }}
                forceRender
                footer={[
                    <Button
                        key="submit"
                        type="primary"
                        loading={loading}
                        onClick={handlePasswordSubmit}
                        style={{ background: '#00bba7', borderColor: '#00bba7', height: '38px', padding: '0 24px', fontWeight: '500' }}
                    >
                        确定
                    </Button>,
                    <Button
                        key="cancel"
                        onClick={() => {
                            setIsPasswordModalOpen(false);
                            form.resetFields();
                        }}
                        style={{ background: '#64748b', borderColor: '#64748b', color: '#fff', height: '38px', padding: '0 24px', fontWeight: '500' }}
                    >
                        取消
                    </Button>
                ]}
                width={480}
                centered
                destroyOnHidden
            >
                {/* 💡 增加左右 padding 保持居中沉浸感，改用 vertical 布局避免 Label 挤压 */}
                <Form
                    form={form}
                    layout="vertical"
                    style={{ padding: '16px 20px 0 20px' }}
                >
                    {/* MT 账号 (只读) */}
                    <Form.Item
                        label={<span style={{ fontWeight: 600, color: '#334155' }}>MT账号</span>}
                        name="mtAccount"
                        style={{ marginBottom: '16px' }}
                    >
                        <Input disabled style={{ backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 600, height: '38px' }} />
                    </Form.Item>

                    {/* 旧密码 */}
                    <Form.Item
                        label={<span style={{ fontWeight: 600, color: '#334155' }}>旧密码</span>}
                        name="oldPassword"
                        extra={<span style={{ color: '#94a3b8', fontSize: '12px' }}>必须输入主密码</span>}
                        rules={[{ required: true, message: '必须输入主密码' }]}
                        style={{ marginBottom: '16px' }}
                    >
                        <Input.Password placeholder="必须输入主密码" style={{ height: '38px' }} />
                    </Form.Item>

                    {/* 新密码 */}
                    <Form.Item
                        label={<span style={{ fontWeight: 600, color: '#334155' }}>新密码</span>}
                        name="newPassword"
                        extra={
                            <span style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.4', display: 'block', marginTop: '4px' }}>
                                密码都必须包含四种字符类型：小写字母、大写字母、数字和符号（#、@、! 等），最少8个字符。例如，1Ar#pqkj
                            </span>
                        }
                        rules={[
                            { required: true, message: '请输入新密码' },
                            { min: 8, message: '密码最少8个字符' }
                        ]}
                        style={{ marginBottom: '16px' }}
                    >
                        <Input.Password placeholder="新密码" style={{ height: '38px' }} />
                    </Form.Item>

                    {/* 确认密码 */}
                    <Form.Item
                        label={<span style={{ fontWeight: 600, color: '#334155' }}>确认密码</span>}
                        name="confirmPassword"
                        extra={<span style={{ color: '#94a3b8', fontSize: '12px' }}>和新密码保持一致</span>}
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: '请确认新密码' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次输入的密码不一致！'));
                                },
                            }),
                        ]}
                        style={{ marginBottom: '16px' }}
                    >
                        <Input.Password placeholder="确认密码" style={{ height: '38px' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};