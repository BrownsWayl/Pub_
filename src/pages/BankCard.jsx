import React, { useState } from 'react';
import {
    Card, Table, Button, Tabs, Breadcrumb, Space, Popconfirm, Modal, Form,
    Input, Select, Radio, Upload, Tag, App, Row, Col, Descriptions
} from 'antd';
import { PlusOutlined, EditOutlined, FileTextOutlined, DeleteOutlined, PictureOutlined } from '@ant-design/icons';

const { Option } = Select;

export default function BankCard({ isMobile }) {
    const [activeTab, setActiveTab] = useState('bank');

    // Modal 状态控制
    const [isFormModalOpen, setIsFormModalOpen] = useState(false); // 添加/编辑 Modal
    const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
    const [editingRecord, setEditingRecord] = useState(null); // 当前正在编辑的一行数据

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // 查看详情 Modal
    const [detailRecord, setDetailRecord] = useState(null); // 详情展示数据

    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [imageUrl, setImageUrl] = useState(null);

    // 1. 模拟银行卡数据
    const [bankData, setBankData] = useState([
        {
            key: '1',
            bankAccount: '5215015132156416',
            bankName: '恒生银行',
            payeeName: 'desonfx.xie',
            country: 'HK',
            province: '香港',
            city: '香港',
            district: '上水',
            branch: '香港上水支行',
            bankAddress: '香港上水支行',
            swiftCode: '--',
            isDefault: '否'
        }
    ]);

    // 2. 模拟数字货币数据
    const [cryptoData, setCryptoData] = useState([]);

    // ------------------- 动作处理函数 -------------------

    // 打开“添加” Modal
    const handleOpenAddModal = () => {
        setModalMode('add');
        setEditingRecord(null);
        setImageUrl(null);
        form.resetFields();
        setIsFormModalOpen(true);
    };

    // 打开“编辑” Modal 并填充数据
    const handleOpenEditModal = (record) => {
        setModalMode('edit');
        setEditingRecord(record);
        setImageUrl(record.cardImg || null);

        // 自动将整行数据赋值给表单
        form.setFieldsValue({
            ...record,
            payeeName: record.payeeName || 'desonfx.xie'
        });

        setIsFormModalOpen(true);
    };

    // 打开“查看详情” Modal
    const handleOpenDetailModal = (record) => {
        setDetailRecord(record);
        setIsDetailModalOpen(true);
    };

    // 删除银行卡处理
    const handleDeleteBank = (key) => {
        setBankData((prev) => prev.filter((item) => item.key !== key));
        message.success('已成功删除该银行卡');
    };

    // 删除数字货币处理
    const handleDeleteCrypto = (key) => {
        setCryptoData((prev) => prev.filter((item) => item.key !== key));
        message.success('已成功删除该数字货币地址');
    };

    // 表单提交（兼容 添加 / 编辑）
    const handleFormSubmit = (values) => {
        if (activeTab === 'bank') {
            if (modalMode === 'add') {
                const newBank = {
                    key: Date.now().toString(),
                    bankAccount: values.bankAccount,
                    bankName: values.bankName,
                    payeeName: values.payeeName || 'desonfx.xie',
                    country: values.country || 'HK',
                    province: values.province || '',
                    city: values.city || '',
                    district: values.district || '',
                    branch: values.branch || '--',
                    bankAddress: values.bankAddress || '--',
                    swiftCode: values.swiftCode || '--',
                    isDefault: values.isDefault || '否',
                    cardImg: imageUrl
                };
                setBankData((prev) => [...prev, newBank]);
                message.success('银行卡添加成功！');
            } else {
                // 编辑数据更新
                setBankData((prev) =>
                    prev.map((item) =>
                        item.key === editingRecord.key
                            ? { ...item, ...values, cardImg: imageUrl || item.cardImg }
                            : item
                    )
                );
                message.success('银行卡信息修改成功！');
            }
        } else {
            if (modalMode === 'add') {
                const newCrypto = {
                    key: Date.now().toString(),
                    cryptoType: values.cryptoType,
                    walletAddress: values.walletAddress
                };
                setCryptoData((prev) => [...prev, newCrypto]);
                message.success('数字货币地址添加成功！');
            } else {
                setCryptoData((prev) =>
                    prev.map((item) =>
                        item.key === editingRecord.key ? { ...item, ...values } : item
                    )
                );
                message.success('数字货币地址修改成功！');
            }
        }

        setIsFormModalOpen(false);
        form.resetFields();
        setImageUrl(null);
    };

    // 图片上传处理 (base64 预览)
    const handleImageChange = (info) => {
        const file = info.file.originFileObj || info.file;
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImageUrl(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    // ------------------- 表格列配置 -------------------

    // 银行卡表格列配置
    const bankColumns = [
        { title: '银行卡账号', dataIndex: 'bankAccount', key: 'bankAccount' },
        { title: '开户行名称', dataIndex: 'bankName', key: 'bankName' },
        { title: '开户支行', dataIndex: 'branch', key: 'branch' },
        { title: '银行Swift码', dataIndex: 'swiftCode', key: 'swiftCode' },
        {
            title: '默认出金银行卡',
            dataIndex: 'isDefault',
            key: 'isDefault',
            render: (text) => <Tag color={text === '是' ? 'green' : 'default'}>{text}</Tag>
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space size="small">
                    {/* 铅笔编辑图标 */}
                    <Button
                        type="text"
                        icon={<EditOutlined style={{ color: '#00bba7' }} />}
                        onClick={() => handleOpenEditModal(record)}
                    />
                    {/* 详情查看图标 */}
                    <Button
                        type="text"
                        icon={<FileTextOutlined style={{ color: '#64748b' }} />}
                        onClick={() => handleOpenDetailModal(record)}
                    />
                    {/* 删除图标 */}
                    <Popconfirm
                        title="确定要删除该银行卡吗？"
                        onConfirm={() => handleDeleteBank(record.key)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    // 数字货币表格列配置
    const cryptoColumns = [
        { title: '币种', dataIndex: 'cryptoType', key: 'cryptoType', width: 180 },
        { title: '钱包地址', dataIndex: 'walletAddress', key: 'walletAddress' },
        {
            title: '操作',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="text"
                        icon={<EditOutlined style={{ color: '#00bba7' }} />}
                        onClick={() => handleOpenEditModal(record)}
                    />
                    <Popconfirm
                        title="确定要删除该钱包地址吗？"
                        onConfirm={() => handleDeleteCrypto(record.key)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: isMobile ? '12px' : '20px 24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            {/* 顶栏标题与面包屑 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '18px', backgroundColor: '#00bba7', borderRadius: '2px' }} />
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>常规银行卡管理</h2>
                </div>

                {!isMobile && (
                    <Breadcrumb
                        items={[
                            { title: '我的银行卡' },
                            { title: <span style={{ color: '#00bba7', fontWeight: 500 }}>常规银行卡管理</span> }
                        ]}
                    />
                )}
            </div>

            {/* 主体 Card 容器 */}
            <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <Tabs
                    destroyOnHidden={true}
                    activeKey={activeTab}
                    onChange={(key) => setActiveTab(key)}
                    items={[
                        {
                            key: 'bank',
                            label: '银行卡',
                            children: (
                                <div>
                                    <div style={{ marginBottom: '16px' }}>
                                        <Button
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            onClick={handleOpenAddModal}
                                            style={{ backgroundColor: '#00bba7', borderColor: '#00bba7', borderRadius: '4px', height: '36px', padding: '0 20px', fontWeight: '500' }}
                                        >
                                            添加
                                        </Button>
                                    </div>
                                    <Table
                                        columns={bankColumns}
                                        dataSource={bankData}
                                        pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '25', '50'], showTotal: (total, range) => `显示第 ${range[0]} 至 ${range[1]} 项结果，共 ${total} 项` }}
                                        scroll={{ x: isMobile ? 650 : undefined }}
                                    />
                                </div>
                            )
                        },
                        {
                            key: 'crypto',
                            label: '数字货币',
                            children: (
                                <div>
                                    <div style={{ marginBottom: '16px' }}>
                                        <Button
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            onClick={handleOpenAddModal}
                                            style={{ backgroundColor: '#00bba7', borderColor: '#00bba7', borderRadius: '4px', height: '36px', padding: '0 20px', fontWeight: '500' }}
                                        >
                                            添加
                                        </Button>
                                    </div>
                                    <Table
                                        columns={cryptoColumns}
                                        dataSource={cryptoData}
                                        locale={{ emptyText: '暂无数据' }}
                                        pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '25', '50'], showTotal: (total, range) => `显示第 ${range[0]} 至 ${range[1]} 项结果，共 ${total} 项` }}
                                        scroll={{ x: isMobile ? 500 : undefined }}
                                    />
                                </div>
                            )
                        }
                    ]}
                />
            </Card>

            {/* 1. 添加 / 编辑通用 Modal */}
            <Modal
                title={
                    <span style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
                        {modalMode === 'add'
                            ? (activeTab === 'bank' ? '添加' : '添加数字货币地址')
                            : (activeTab === 'bank' ? '编辑' : '编辑数字货币地址')}
                    </span>
                }
                open={isFormModalOpen}
                onCancel={() => {
                    setIsFormModalOpen(false);
                    form.resetFields();
                    setImageUrl(null);
                }}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                        <Button
                            type="primary"
                            onClick={() => form.submit()}
                            style={{ backgroundColor: '#00bba7', borderColor: '#00bba7', padding: '0 28px', height: '38px', borderRadius: '4px' }}
                        >
                            {modalMode === 'add' ? (activeTab === 'bank' ? '提交' : '保存') : '保存修改'}
                        </Button>
                        <Button
                            onClick={() => setIsFormModalOpen(false)}
                            style={{ backgroundColor: '#64748b', borderColor: '#64748b', color: '#fff', padding: '0 28px', height: '38px', borderRadius: '4px' }}
                        >
                            取消
                        </Button>
                    </div>
                }
                width={activeTab === 'bank' ? (isMobile ? '95%' : 720) : (isMobile ? '90%' : 540)}
                destroyOnClose
                centered
            >
                <Form
                    form={form}
                    layout={activeTab === 'bank' && !isMobile ? 'horizontal' : 'vertical'}
                    labelCol={activeTab === 'bank' && !isMobile ? { span: 6 } : undefined}
                    wrapperCol={activeTab === 'bank' && !isMobile ? { span: 18 } : undefined}
                    onFinish={handleFormSubmit}
                    initialValues={{
                        payeeName: 'desonfx.xie',
                        isDefault: '否'
                    }}
                    style={{ marginTop: '20px' }}
                >
                    {activeTab === 'bank' ? (
                        <>
                            {/* 银行卡图片 */}
                            <Form.Item label="银行卡图片">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                    <Upload
                                        showUploadList={false}
                                        beforeUpload={() => false}
                                        onChange={handleImageChange}
                                    >
                                        <div style={{
                                            width: '120px',
                                            height: '70px',
                                            border: '1px dashed #cbd5e1',
                                            borderRadius: '6px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            backgroundColor: '#f8fafc',
                                            overflow: 'hidden'
                                        }}>
                                            {imageUrl ? (
                                                <img src={imageUrl} alt="card" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <PictureOutlined style={{ fontSize: '28px', color: '#94a3b8' }} />
                                            )}
                                        </div>
                                    </Upload>
                                    <div>
                                        <span style={{ fontSize: '13px', color: '#475569', cursor: 'pointer' }}>点击图片更换</span>
                                        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                                            支持jpg、jpeg、gif、png、bmp格式的图片,大小限制为6M
                                        </div>
                                    </div>
                                </div>
                            </Form.Item>

                            <Form.Item label="银行卡账号" name="bankAccount" rules={[{ required: true, message: '请输入银行卡账号' }]}>
                                <Input placeholder="请输入银行卡账号" style={{ height: '38px', borderRadius: '4px' }} />
                            </Form.Item>

                            <Form.Item label="开户行名称" name="bankName" rules={[{ required: true, message: '请输入开户行名称' }]}>
                                <Input placeholder="请输入开户行名称" style={{ height: '38px', borderRadius: '4px' }} />
                            </Form.Item>

                            <Form.Item label="收款人姓名" name="payeeName" rules={[{ required: true }]}>
                                <Input disabled placeholder="desonfx.xie" style={{ height: '38px', borderRadius: '4px', backgroundColor: '#f1f5f9' }} />
                            </Form.Item>

                            {/* 银行地址 */}
                            <Form.Item label="银行地址" style={{ marginBottom: isMobile ? '0px' : '24px' }}>
                                <Row gutter={8}>
                                    <Col xs={24} sm={6}>
                                        <Form.Item name="country" noStyle>
                                            <Select placeholder="请选择国家" style={{ height: '38px', width: '100%', marginBottom: isMobile ? '8px' : 0 }}>
                                                <Option value="HK">中国香港</Option>
                                                <Option value="CN">中国大陆</Option>
                                                <Option value="SG">新加坡</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={6}>
                                        <Form.Item name="province" noStyle>
                                            <Input placeholder="请输入省份" style={{ height: '38px', borderRadius: '4px', marginBottom: isMobile ? '8px' : 0 }} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={6}>
                                        <Form.Item name="city" noStyle>
                                            <Input placeholder="请输入城市" style={{ height: '38px', borderRadius: '4px', marginBottom: isMobile ? '8px' : 0 }} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={6}>
                                        <Form.Item name="district" noStyle>
                                            <Input placeholder="请输入区县" style={{ height: '38px', borderRadius: '4px' }} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form.Item>

                            <Form.Item label="开户支行" name="branch" rules={[{ required: true, message: '请输入开户支行' }]}>
                                <Input placeholder="请输入开户支行" style={{ height: '38px', borderRadius: '4px' }} />
                            </Form.Item>

                            <Form.Item label="开户行详细地址" name="bankAddress">
                                <Input placeholder="请输入开户行详细地址" style={{ height: '38px', borderRadius: '4px' }} />
                            </Form.Item>

                            <Form.Item label="银行Swift码" name="swiftCode" style={{ marginBottom: '8px' }}>
                                <Input placeholder="请输入银行Swift码" style={{ height: '38px', borderRadius: '4px' }} />
                            </Form.Item>
                            <div style={{ marginLeft: isMobile ? '0' : '25%', color: '#94a3b8', fontSize: '12px', marginBottom: '20px' }}>
                                您的开户行SWIFT CODE可以致电开户行查询
                            </div>

                            <Form.Item label="默认出金银行卡" name="isDefault" rules={[{ required: true }]}>
                                <Radio.Group>
                                    <Radio value="是">是</Radio>
                                    <Radio value="否">否</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </>
                    ) : (
                        <>
                            <Form.Item label="币种" name="cryptoType" rules={[{ required: true, message: '请选择币种' }]}>
                                <Select placeholder="请选择币种" style={{ height: '40px' }}>
                                    <Option value="USDT-TRC20">USDT-TRC20</Option>
                                    <Option value="USDT-ERC20">USDT-ERC20</Option>
                                    <Option value="USDC">USDC</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="钱包地址" name="walletAddress" rules={[{ required: true, message: '请输入数字货币钱包地址' }]}>
                                <Input placeholder="请输入数字货币钱包地址" style={{ height: '40px', borderRadius: '4px' }} />
                            </Form.Item>
                        </>
                    )}
                </Form>
            </Modal>

            {/* 2. 查看详情 Modal */}
            <Modal
                title={<span style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>银行卡详情</span>}
                open={isDetailModalOpen}
                onCancel={() => setIsDetailModalOpen(false)}
                footer={[
                    <Button
                        key="close"
                        type="primary"
                        onClick={() => setIsDetailModalOpen(false)}
                        style={{ backgroundColor: '#00bba7', borderColor: '#00bba7', borderRadius: '4px' }}
                    >
                        关闭
                    </Button>
                ]}
                width={600}
                centered
            >
                {detailRecord && (
                    <Descriptions column={1} bordered style={{ marginTop: '16px' }}>
                        <Descriptions.Item label="银行卡账号">{detailRecord.bankAccount || '--'}</Descriptions.Item>
                        <Descriptions.Item label="开户行名称">{detailRecord.bankName || '--'}</Descriptions.Item>
                        <Descriptions.Item label="收款人姓名">{detailRecord.payeeName || 'desonfx.xie'}</Descriptions.Item>
                        <Descriptions.Item label="开户支行">{detailRecord.branch || '--'}</Descriptions.Item>
                        <Descriptions.Item label="详细地址">{detailRecord.bankAddress || '--'}</Descriptions.Item>
                        <Descriptions.Item label="银行Swift码">{detailRecord.swiftCode || '--'}</Descriptions.Item>
                        <Descriptions.Item label="默认出金银行卡">
                            <Tag color={detailRecord.isDefault === '是' ? 'green' : 'default'}>
                                {detailRecord.isDefault || '否'}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
}