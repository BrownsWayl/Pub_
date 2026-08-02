import React, { useState } from 'react';
import { Card, Form, Input, Select, Button, Tabs, Breadcrumb, Row, Col, App } from 'antd';

const { Option } = Select;

export default function Transfer({ isMobile }) {
    const [activeTab, setActiveTab] = useState('same');
    const [sameForm] = Form.useForm();
    const [differentForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { message } = App.useApp();

    // 提交处理
    const handleSubmit = (type, values) => {
        setLoading(true);
        console.log(`${type}转账申请数据：`, values);

        setTimeout(() => {
            setLoading(false);
            message.success(`${type}申请提交成功！`);
        }, 1000);
    };

    // 表单栅格布局设置
    const formLayout = {
        labelCol: { span: isMobile ? 24 : 6 },
        wrapperCol: { span: isMobile ? 24 : 18 },
    };

    // 手机号国家代码前缀下拉
    const prefixSelector = (
        <Form.Item name="prefix" noStyle initialValue="86">
            <Select style={{ width: 80 }}>
                <Option value="86">+86</Option>
                <Option value="852">+852</Option>
                <Option value="853">+853</Option>
                <Option value="886">+886</Option>
            </Select>
        </Form.Item>
    );

    // 选项卡 1：同名转账表单 (图1)
    const SameNameTransferForm = (
        <Form
            {...formLayout}
            form={sameForm}
            onFinish={(values) => handleSubmit('同名转账', values)}
            initialValues={{
                senderName: 'desonfx.xie',
                receiverName: 'desonfx.xie',
            }}
            style={{ maxWidth: '560px', marginTop: '16px' }}
        >
            <Form.Item label="转出姓名" name="senderName" rules={[{ required: true }]}>
                <Input disabled style={{ height: '38px', borderRadius: '4px', backgroundColor: '#f1f5f9' }} />
            </Form.Item>

            <Form.Item label="转出交易账号" name="fromAccount" rules={[{ required: true, message: '请选择转出交易账号' }]}>
                <Select placeholder="请选择转出交易账号" style={{ height: '38px' }}>
                    <Option value="861005">861005 ($12,850.00)</Option>
                    <Option value="861004">861004 ($5,200.00)</Option>
                </Select>
            </Form.Item>

            <Form.Item label="转账金额" name="amount" rules={[{ required: true, message: '请输入转账金额' }]}>
                <Input prefix={<span style={{ color: '#94a3b8' }}>$</span>} placeholder="美元" style={{ height: '38px', borderRadius: '4px' }} />
            </Form.Item>

            <Form.Item label="转入姓名" name="receiverName" rules={[{ required: true }]}>
                <Input disabled style={{ height: '38px', borderRadius: '4px', backgroundColor: '#f1f5f9' }} />
            </Form.Item>

            <Form.Item label="转入交易账号" name="toAccount" rules={[{ required: true, message: '请选择转入交易账号' }]}>
                <Select placeholder="请选择转入交易账号" style={{ height: '38px' }}>
                    <Option value="861005">861005 ($12,850.00)</Option>
                    <Option value="861004">861004 ($5,200.00)</Option>
                </Select>
            </Form.Item>

            <Form.Item label="备注" name="remark">
                <Input placeholder="请输入备注" style={{ height: '38px', borderRadius: '4px' }} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: isMobile ? 0 : 6, span: isMobile ? 24 : 18 }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{
                        backgroundColor: '#00bba7',
                        borderColor: '#00bba7',
                        height: '38px',
                        padding: '0 36px',
                        fontSize: '14px',
                        fontWeight: '500',
                        borderRadius: '4px',
                        marginTop: '8px'
                    }}
                >
                    提交
                </Button>
            </Form.Item>
        </Form>
    );

    // 选项卡 2：异名转账表单 (图2)
    const DifferentNameTransferForm = (
        <Form
            {...formLayout}
            form={differentForm}
            onFinish={(values) => handleSubmit('异名转账', values)}
            initialValues={{
                senderName: 'desonfx.xie',
            }}
            style={{ maxWidth: '560px', marginTop: '16px' }}
        >
            <Form.Item label="转出姓名" name="senderName" rules={[{ required: true }]}>
                <Input disabled style={{ height: '38px', borderRadius: '4px', backgroundColor: '#f1f5f9' }} />
            </Form.Item>

            <Form.Item label="转出交易账号" name="fromAccount" rules={[{ required: true, message: '请选择转出交易账号' }]}>
                <Select placeholder="请选择转出交易账号" style={{ height: '38px' }}>
                    <Option value="861005">861005 ($12,850.00)</Option>
                    <Option value="861004">861004 ($5,200.00)</Option>
                </Select>
            </Form.Item>

            <Form.Item label="转账金额" name="amount" rules={[{ required: true, message: '请输入转账金额' }]}>
                <Input prefix={<span style={{ color: '#94a3b8' }}>$</span>} placeholder="美元" style={{ height: '38px', borderRadius: '4px' }} />
            </Form.Item>

            <Form.Item label="转入手机号" name="receiverPhone" rules={[{ required: true, message: '请输入转入手机号' }]}>
                <Input
                    addonBefore={prefixSelector}
                    placeholder="请输入转入手机号"
                    style={{ height: '38px', borderRadius: '4px' }}
                />
            </Form.Item>

            <Form.Item label="转入交易账号" name="toAccount" rules={[{ required: true, message: '请输入转入交易账号' }]}>
                <Input placeholder="请输入转入交易账号" style={{ height: '38px', borderRadius: '4px' }} />
            </Form.Item>

            <Form.Item label="备注" name="remark">
                <Input placeholder="请输入备注" style={{ height: '38px', borderRadius: '4px' }} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: isMobile ? 0 : 6, span: isMobile ? 24 : 18 }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{
                        backgroundColor: '#00bba7',
                        borderColor: '#00bba7',
                        height: '38px',
                        padding: '0 36px',
                        fontSize: '14px',
                        fontWeight: '500',
                        borderRadius: '4px',
                        marginTop: '8px'
                    }}
                >
                    提交
                </Button>
            </Form.Item>
        </Form>
    );

    return (
        <div style={{ background: '#f1f5f9', padding: isMobile ? '12px' : '20px 24px' }}>

            {/* 顶栏标题与面包屑 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '18px', backgroundColor: '#00bba7', borderRadius: '2px' }} />
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>内部转账</h2>
                </div>

                {!isMobile && (
                    <Breadcrumb
                        items={[
                            { title: '资金管理' },
                            { title: <span style={{ color: '#00bba7', fontWeight: 500 }}>内部转账</span> }
                        ]}
                    />
                )}
            </div>

            {/* 表单卡片容器 */}
            <Row gutter={[20, 20]}>
                <Col xs={24} lg={16}>
                    <Card
                        variant={false}
                        style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', minHeight: '520px' }}
                    >
                        <Tabs
                            destroyOnHidden={true}
                            activeKey={activeTab}
                            onChange={(key) => setActiveTab(key)}
                            items={[
                                { key: 'same', label: '同名转账', children: SameNameTransferForm },
                                { key: 'different', label: '异名转账', children: DifferentNameTransferForm }
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}