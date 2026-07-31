import React, { useState } from 'react';
import { Card, Form, Input, Select, Button, Tabs, Checkbox, Breadcrumb, Row, Col, App, Modal, Table, message } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

export default function CashOut({ isMobile }) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('bank');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bankForm] = Form.useForm();
    const [cryptoForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    //   const { message } = App.useApp();

    // 模拟常用银行卡列表数据
    const mockBankCards = [
        {
            key: '1',
            bankAccount: '5215015132156416',
            bankName: '恒生银行',
            branch: '香港上水支行',
            swiftCode: '',
            province: '香港',
            city: '香港',
            district: '上水',
            country: 'HK',
            bankAddress: '香港上水支行'
        }
    ];

    // 选择银行卡，自动填充数据至电汇表单
    const handleSelectBankCard = (card) => {
        bankForm.setFieldsValue({
            bankAccount: card.bankAccount,
            bankName: card.bankName,
            branch: card.branch,
            country: card.country,
            bankAddress: card.bankAddress,
        });
        setIsModalOpen(false);
        message.success('已自动填充所选常用银行卡信息！');
    };

    // 常用银行卡表格列配置
    const modalColumns = [
        { title: '', dataIndex: 'key', width: 50, align: 'center' },
        { title: '银行账号', dataIndex: 'bankAccount' },
        { title: '开户行名称', dataIndex: 'bankName' },
        { title: '开户支行', dataIndex: 'branch' },
        { title: 'Swift码', dataIndex: 'swiftCode' },
        { title: '省份', dataIndex: 'province' },
        { title: '城市', dataIndex: 'city' },
        { title: '区县', dataIndex: 'district' },
    ];

    // 提交处理
    const handleSubmit = (type, values) => {
        setLoading(true);
        console.log(`${type}出金申请数据：`, values);

        setTimeout(() => {
            setLoading(false);
            message.success(`${type}出金申请提交成功，正在审核中！`);
        }, 1000);
    };

    // 统一的表单栅格布局
    const formLayout = {
        labelCol: { span: isMobile ? 24 : 7 },
        wrapperCol: { span: isMobile ? 24 : 17 },
    };

    // 电汇出金说明
    const BankNotice = () => (
        <div>
            <p style={{ margin: '0 0 12px 0' }}>
                客户银行卡出金时，要求银行卡持卡人与CRM账户持有人为同一人，方给予出金。用户名和账户名也需与注册身份证名称一致。
            </p>
            <p style={{ margin: '0 0 12px 0' }}>出入金币种必须一致。</p>
            <p style={{ margin: '0 0 12px 0' }}>
                申请取款金额将默认提取到您本次取款所选择的绑定银行卡或电子钱包账户内。
            </p>
            <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>取款有两种情况需收取手续费：</p>
            <ol style={{ paddingLeft: '20px', margin: '0 0 16px 0' }}>
                <li>小额取款。MT5账户单笔取款50美元以下，收取3美元手续费。</li>
                <li>客户注资后没有交易，或者交易手数不足注资金额的1/2500，取款将扣收取款金额的6%作为手续费。</li>
            </ol>

            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '6px', marginBottom: '16px', border: '1px solid #f1f5f9' }}>
                <p style={{ margin: '0 0 6px 0', fontWeight: '600' }}>举例：</p>
                <p style={{ margin: '0 0 4px 0' }}>客户A注资2500美元，交易不足 1 手（2500/2500=1），取款需扣除手续费。</p>
                <p style={{ margin: 0 }}>客户B注资1000美元，交易不足 0.4手（1000/2500=0.4），取款需扣除手续费。</p>
            </div>

            <p style={{ margin: 0, color: '#64748b' }}>
                取款货币：中国内地银行账户均为人民币，其他国家或地区的银行账户为美元，电子钱包为USDT币种。实际兑换汇率与金额请以支付平台的最终交易结果显示为准。
            </p>
        </div>
    );

    // 数字货币出金说明
    const CryptoNotice = () => (
        <div>
            <ul style={{ paddingLeft: '18px', margin: '0 0 16px 0' }}>
                <li style={{ marginBottom: '10px' }}>
                    申请取款金额将默认提取到您本次取款所选择的绑定银行卡或电子钱包账户内。
                </li>
                <li style={{ marginBottom: '10px' }}>
                    取款有两种情况需收取手续费：
                    <div style={{ marginTop: '6px' }}>1）小额取款。MT5账户单笔取款50美元以下，收取3美元手续费。</div>
                    <div style={{ marginTop: '4px' }}>2）客户注资后没有交易，或者交易手数不足注资金额的1/2500，取款将扣收取款金额的6%作为手续费。</div>
                </li>
            </ul>

            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '6px', marginBottom: '16px', border: '1px solid #f1f5f9' }}>
                <p style={{ margin: '0 0 6px 0', fontWeight: '600' }}>举例：</p>
                <p style={{ margin: '0 0 4px 0' }}>客户A注资2500美元，交易不足 1 手（2500/2500=1），取款需扣除手续费。</p>
                <p style={{ margin: 0 }}>客户B注资1000美元，交易不足 0.4手（1000/2500=0.4），取款需扣除手续费。</p>
            </div>

            <ul style={{ paddingLeft: '18px', margin: 0, color: '#64748b' }}>
                <li>
                    取款货币：中国内地银行账户均为人民币，其他国家或地区的银行账户为美元，电子钱包为USDT币种。实际兑换汇率与金额请以支付平台的最终交易结果显示为准。
                </li>
            </ul>
        </div>
    );

    // 右侧说明卡片封装
    const NoticeCard = () => (
        <Card
            bordered={false}
            style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: '100%' }}
        >
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginTop: 0, marginBottom: '16px' }}>
                出金说明
            </h3>
            <div style={{ color: '#475569', fontSize: '13px', lineHeight: '1.8' }}>
                {activeTab === 'bank' ? <BankNotice /> : <CryptoNotice />}
            </div>
        </Card>
    );

    // 选项卡 1：电汇出金表单
    const BankFormContent = (
        <Form
            {...formLayout}
            form={bankForm}
            onFinish={(values) => handleSubmit('电汇', values)}
            initialValues={{
                payeeName: 'desonfx.xie',
                saveCommon: true
            }}
            style={{ maxWidth: '640px', marginTop: '16px' }}
        >
            <Form.Item label="取款账号" name="account" rules={[{ required: true, message: '请选择取款账号' }]}>
                <Select placeholder="交易账号" style={{ height: '40px' }}>
                    <Option value="861005">861005 ($12,850.00)</Option>
                    <Option value="861004">861004 ($5,200.00)</Option>
                </Select>
            </Form.Item>

            <Form.Item label="收款币种" name="currency" rules={[{ required: true, message: '请选择收款币种' }]}>
                <Select placeholder="收款币种" style={{ height: '40px' }}>
                    <Option value="USD">USD (美元)</Option>
                </Select>
            </Form.Item>

            <Form.Item label="取款金额($)" name="amount" rules={[{ required: true, message: '请输入取款金额' }]}>
                <Input prefix={<span style={{ color: '#94a3b8' }}>$</span>} placeholder="请输入美元金额" style={{ height: '40px', borderRadius: '6px' }} />
            </Form.Item>

            <Form.Item label="银行账号" name="bankAccount" rules={[{ required: true, message: '请输入银行账号' }]}>
                <Input
                    placeholder="请输入银行账号"
                    style={{ height: '40px', borderRadius: '6px' }}
                    addonAfter={
                        <Button
                            type="text"
                            icon={<SearchOutlined />}
                            onClick={() => setIsModalOpen(true)} // 👈 点击触发弹出 Modal
                            style={{ border: 'none', height: '32px', color: '#475569' }}
                        >
                            常用银行卡
                        </Button>
                    }
                />
            </Form.Item>

            <Form.Item label="收款人姓名" name="payeeName">
                <Input
                    disabled
                    placeholder="收款人姓名"
                    style={{ height: '40px', borderRadius: '6px' }}
                    addonAfter={
                        <Form.Item name="saveCommon" valuePropName="checked" noStyle>
                            <Checkbox disabled style={{ fontSize: '13px', color: '#64748b' }}>保存为常用银行卡</Checkbox>
                        </Form.Item>
                    }
                />
            </Form.Item>

            <Form.Item label="开户行名称" name="bankName" rules={[{ required: true, message: '请输入开户行名称' }]}>
                <Input placeholder="恒生银行" style={{ height: '40px', borderRadius: '6px' }} />
            </Form.Item>

            <Form.Item label="银行所在国家" name="country" rules={[{ required: true, message: '请选择国家' }]}>
                <Select placeholder="请选择国家" style={{ height: '40px' }}>
                    <Option value="HK">中国香港</Option>
                    <Option value="CN">中国大陆</Option>
                    <Option value="SG">新加坡</Option>
                </Select>
            </Form.Item>

            <Form.Item label="开户支行" name="branch" rules={[{ required: true, message: '请输入开户支行' }]}>
                <Input placeholder="香港上水支行" style={{ height: '40px', borderRadius: '6px' }} />
            </Form.Item>

            <Form.Item label="银行地址" name="bankAddress">
                <Input placeholder="香港上水支行" style={{ height: '40px', borderRadius: '6px' }} />
            </Form.Item>

            <Form.Item label="备注" name="remark">
                <Input.TextArea placeholder="请输入备注" rows={3} style={{ borderRadius: '6px' }} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: isMobile ? 0 : 7, span: isMobile ? 24 : 17 }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{
                        backgroundColor: '#00bba7',
                        borderColor: '#00bba7',
                        height: '42px',
                        padding: '0 48px',
                        fontSize: '15px',
                        fontWeight: '500',
                        borderRadius: '6px',
                        marginTop: '12px'
                    }}
                >
                    提交
                </Button>
            </Form.Item>
        </Form>
    );

    // 选项卡 2：数字货币出金表单
    const CryptoFormContent = (
        <Form
            {...formLayout}
            form={cryptoForm}
            onFinish={(values) => handleSubmit('数字货币', values)}
            style={{ maxWidth: '640px', marginTop: '16px' }}
        >
            <Form.Item label="取款账号" name="account" rules={[{ required: true, message: '请选择取款账号' }]}>
                <Select placeholder="交易账号" style={{ height: '40px' }}>
                    <Option value="861005">861005 ($12,850.00)</Option>
                    <Option value="861004">861004 ($5,200.00)</Option>
                </Select>
            </Form.Item>

            <Form.Item label="收款币种" name="currency" rules={[{ required: true, message: '请选择收款币种' }]}>
                <Select placeholder="收款币种" style={{ height: '40px' }}>
                    <Option value="USDT">USDT</Option>
                    <Option value="USDC">USDC</Option>
                </Select>
            </Form.Item>

            <Form.Item label="取款金额($)" name="amount" rules={[{ required: true, message: '请输入取款金额' }]}>
                <Input prefix={<span style={{ color: '#94a3b8' }}>$</span>} placeholder="请输入美元金额" style={{ height: '40px', borderRadius: '6px' }} />
            </Form.Item>

            <Form.Item label="币种" name="cryptoType" rules={[{ required: true, message: '请选择币种' }]}>
                <Select placeholder="币种" style={{ height: '40px' }}>
                    <Option value="TRC20">USDT - TRC20</Option>
                    <Option value="ERC20">USDT - ERC20</Option>
                </Select>
            </Form.Item>

            <Form.Item label="数字货币地址" name="walletAddress" rules={[{ required: true, message: '请输入数字货币地址' }]}>
                <Input placeholder="请输入数字货币地址" style={{ height: '40px', borderRadius: '6px' }} />
            </Form.Item>

            <Form.Item
                label="确认数字货币地址"
                name="confirmWalletAddress"
                dependencies={['walletAddress']}
                rules={[
                    { required: true, message: '请确认数字货币地址' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('walletAddress') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('两次输入的数字货币地址不一致！'));
                        },
                    }),
                ]}
            >
                <Input placeholder="确认数字货币地址" style={{ height: '40px', borderRadius: '6px' }} />
            </Form.Item>

            <Form.Item label="备注" name="remark">
                <Input.TextArea placeholder="请输入备注" rows={3} style={{ borderRadius: '6px' }} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: isMobile ? 0 : 7, span: isMobile ? 24 : 17 }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{
                        backgroundColor: '#00bba7',
                        borderColor: '#00bba7',
                        height: '42px',
                        padding: '0 48px',
                        fontSize: '15px',
                        fontWeight: '500',
                        borderRadius: '6px',
                        marginTop: '12px'
                    }}
                >
                    提交
                </Button>
            </Form.Item>
        </Form>
    );

    return (
        <div style={{ padding: isMobile ? '12px' : '20px 24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>

            {/* 页头标题与面包屑 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '18px', backgroundColor: '#00bba7', borderRadius: '2px' }} />
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>出金申请</h2>
                </div>

                {!isMobile && (
                    <Breadcrumb
                        items={[
                            { title: '资金管理' },
                            { title: <span style={{ color: '#00bba7', fontWeight: 500 }}>出金申请</span> }
                        ]}
                    />
                )}
            </div>

            {/* 主体两栏布局 */}
            <Row gutter={[20, 20]}>
                {/* 左侧：Tab 切换与表单 */}
                <Col xs={24} lg={15}>
                    <Card
                        bordered={false}
                        style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                    >
                        <Tabs
                            destroyOnHidden={true}
                            activeKey={activeTab}
                            onChange={(key) => setActiveTab(key)}
                            items={[
                                { key: 'bank', label: '电汇出金', children: BankFormContent },
                                { key: 'crypto', label: '数字货币出金', children: CryptoFormContent }
                            ]}
                        />
                    </Card>
                </Col>

                {/* 右侧：出金说明 */}
                <Col xs={24} lg={9}>
                    <NoticeCard />
                </Col>
            </Row>

            {/* 常用银行卡选择 Modal */}
            <Modal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={800}
                centered
                destroyOnClose
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00bba7', fontSize: '18px', fontWeight: '600' }}>
                        <span>我的常用银行卡</span>
                        <ReloadOutlined style={{ fontSize: '16px', cursor: 'pointer' }} onClick={() => message.info('列表已刷新')} />
                    </div>
                }
            >
                <div style={{ marginTop: '16px' }}>
                    <Table
                        columns={modalColumns}
                        dataSource={mockBankCards}
                        pagination={false}
                        size="middle"
                        rowClassName={() => 'custom-bank-card-row'}
                        onRow={(record) => ({
                            onClick: () => handleSelectBankCard(record), // 👈 点击整行回填数据
                            style: { cursor: 'pointer' }
                        })}
                        components={{
                            header: {
                                cell: (props) => (
                                    <th {...props} style={{ ...props.style, backgroundColor: '#4b5563', color: '#ffffff', fontWeight: '500' }} />
                                )
                            }
                        }}
                    />

                    <div style={{ marginTop: '20px', color: '#64748b', fontSize: '13px', lineHeight: '1.8' }}>
                        <p style={{ margin: '0 0 4px 0' }}>1、您可以直接选择您常用的银行卡</p>
                        <p style={{ margin: 0 }}>
                            2、如果您需要添加或管理常用银行卡,请使用{' '}
                            <span
                                onClick={() => {
                                    setIsModalOpen(false);
                                    navigate('/dashboard/bankcard')
                                }}
                                style={{ color: '#00bba7', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' }}
                            >
                                我的银行卡
                            </span>{' '}
                            管理功能
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
}