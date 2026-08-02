import React, { useState } from 'react';
import { Card, Form, Input, Select, Button, Breadcrumb, message, Row, Col } from 'antd';
import { FormOutlined } from '@ant-design/icons';

const { Option } = Select;

export default function DepositPages({ isMobile }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // 模拟提交入金申请
    const handleSubmit = (values) => {
        setLoading(true);
        console.log('入金提交参数：', values);

        setTimeout(() => {
            setLoading(false);
            message.success('入金申请已提交，请等待处理！');
        }, 1000);
    };

    return (
        <div style={{ padding: isMobile ? '12px' : '20px 24px', backgroundColor: '#f1f5f9', minHeight: '100%' }}>

            {/* 顶部标题与面包屑导航 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '18px', backgroundColor: '#00bba7', borderRadius: '2px' }} />
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>在线入金</h2>
                </div>

                {!isMobile && (
                    <Breadcrumb
                        items={[
                            { title: '资金管理' },
                            { title: <span style={{ color: '#00bba7', fontWeight: 500 }}>在线入金</span> }
                        ]}
                    />
                )}
            </div>

            {/* 主体两栏布局 */}
            <Row gutter={[20, 20]}>
                {/* 左侧：表单主区域 */}
                <Col xs={24} lg={16}>
                    <Card
                        bordered={false}
                        style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', padding: isMobile ? '8px' : '16px 24px' }}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            initialValues={{
                                username: 'desonfx.xie(1Z4Y)',
                                account: '861005',
                                channel: 'ChipPay'
                            }}
                        >
                            {/* 用户名 */}
                            <Form.Item
                                label={<span style={{ fontWeight: 600, color: '#334155' }}>用户名</span>}
                                name="username"
                                style={{ marginBottom: '16px' }}
                            >
                                <Input disabled style={{ backgroundColor: '#f1f5f9', color: '#475569', height: '40px', borderRadius: '6px' }} />
                            </Form.Item>

                            {/* 入金账号 */}
                            <Form.Item
                                label={<span style={{ fontWeight: 600, color: '#334155' }}>入金账号 <span style={{ color: '#ef4444' }}>*</span></span>}
                                name="account"
                                rules={[{ required: true, message: '请选择入金账号' }]}
                                style={{ marginBottom: '16px' }}
                            >
                                <Select placeholder="请选择账号" style={{ height: '40px' }}>
                                    <Option value="861005">861005</Option>
                                    <Option value="861004">861004</Option>
                                </Select>
                            </Form.Item>

                            {/* 支付渠道 */}
                            <Form.Item
                                label={<span style={{ fontWeight: 600, color: '#334155' }}>支付渠道 <span style={{ color: '#ef4444' }}>*</span></span>}
                                name="channel"
                                rules={[{ required: true, message: '请选择支付渠道' }]}
                                style={{ marginBottom: '16px' }}
                            >
                                <Select placeholder="请选择支付渠道" style={{ height: '40px' }}>
                                    <Option value="ChipPay">ChipPay</Option>
                                    <Option value="USDT">USDT-TRC20</Option>
                                    <Option value="BankTransfer">板料入金</Option>
                                </Select>
                            </Form.Item>

                            {/* 支付货币 */}
                            <Form.Item
                                label={<span style={{ fontWeight: 600, color: '#334155' }}>支付货币 <span style={{ color: '#ef4444' }}>*</span></span>}
                                name="currency"
                                rules={[{ required: true, message: '请选择支付货币' }]}
                                style={{ marginBottom: '16px' }}
                            >
                                <Select placeholder="--请选择--" style={{ height: '40px' }}>
                                    <Option value="CNY">CNY (人民币)</Option>
                                    {/*     <Option value="USD">USD (美元)</Option>
                                    <Option value="USDT">USDT</Option> */}
                                </Select>
                            </Form.Item>

                            {/* 入金金额 */}
                            <Form.Item
                                label={<span style={{ fontWeight: 600, color: '#334155' }}>入金金额 <span style={{ color: '#ef4444' }}>*</span></span>}
                                name="depositAmount"
                                rules={[{ required: true, message: '请输入入金金额' }]}
                                style={{ marginBottom: '16px' }}
                            >
                                <Input placeholder="美元" style={{ height: '40px', borderRadius: '6px' }} />
                            </Form.Item>

                            {/* 支付金额 (只读/自动计算) */}
                            <Form.Item
                                label={<span style={{ fontWeight: 600, color: '#334155' }}>支付金额 <span style={{ color: '#ef4444' }}>*</span></span>}
                                name="payAmount"
                                style={{ marginBottom: '16px' }}
                            >
                                <Input placeholder="支付金额" disabled style={{ backgroundColor: '#f1f5f9', color: '#475569', height: '40px', borderRadius: '6px' }} />
                            </Form.Item>

                            {/* 备注 */}
                            <Form.Item
                                label={<span style={{ fontWeight: 600, color: '#334155' }}>备注</span>}
                                name="remark"
                                style={{ marginBottom: '28px' }}
                            >
                                <Input.TextArea placeholder="请输入备注" rows={3} style={{ borderRadius: '6px' }} />
                            </Form.Item>

                            {/* 提交按钮 (居中) */}
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
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
                                        borderRadius: '6px'
                                    }}
                                >
                                    提交
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </Col>

                {/* 右侧：入金说明 */}
                <Col xs={24} lg={8}>
                    <Card
                        bordered={false}
                        style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: '100%' }}
                    >
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginTop: 0, marginBottom: '16px' }}>
                            入金说明
                        </h3>
                        <ul style={{ paddingLeft: '20px', margin: 0, color: '#64748b', fontSize: '14px', lineHeight: '1.8' }}>
                            <li>当前汇率为预测汇率，请以通道实际汇率为准，如有疑问请咨询客服。</li>
                        </ul>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}