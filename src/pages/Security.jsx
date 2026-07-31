import React, { useState } from 'react';
import { Breadcrumb, Modal, Form, Input, Button, message } from 'antd';
import { LockFilled } from '@ant-design/icons';
import './security.css';

export const Security = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const handleSubmit = (values) => {
        message.success('资金密码设置成功');
        handleCloseModal();
    };

    return (
        <div className="security-page-wrapper">
            {/* 🟢 1. 顶部标题与面包屑导航 */}
            <div className="security-header">
                <div className="security-title-box">
                    <div className="green-bar" />
                    <span className="security-title-text">账号安全设置</span>
                </div>

                <Breadcrumb
                    items={[
                        { title: '设置' },
                        { title: '账号安全设置' }
                    ]}
                    className="security-breadcrumb"
                />
            </div>

            {/* ⚪ 2. 安全设置选项卡片 */}
            <div className="security-card">
                <div className="security-item">
                    <div className="security-item-left">
                        <div className="lock-icon-wrapper">
                            <LockFilled style={{ fontSize: '28px', color: '#64748b' }} />
                        </div>
                        <div className="security-info">
                            <div className="security-item-title">
                                资金密码 <span className="configured-tag">（已配置）</span>
                            </div>
                            <div className="security-item-desc">用于出金安全验证。</div>
                        </div>
                    </div>

                    <div className="security-item-right">
                        <span className="config-btn" onClick={handleOpenModal}>
                            配置
                        </span>
                    </div>
                </div>
            </div>

            {/* 🔴 3. 资金密码弹窗 Modal */}
            <Modal
                title={<span className="security-modal-title">资金密码</span>}
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                centered
                width={480}
                className="security-custom-modal"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    style={{ marginTop: '20px' }}
                >
                    <Form.Item
                        label={<span className="modal-label">新密码:</span>}
                        name="newPassword"
                        rules={[
                            { required: true, message: '请输入新密码' },
                            { min: 6, max: 18, message: '密码长度需在6-18位之间' }
                        ]}
                    >
                        <Input.Password
                            placeholder="请输入6-18位由小写字母/大写字母/数字组合的新密码"
                            className="modal-input"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="modal-label">确认密码:</span>}
                        name="confirmPassword"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: '请确认新密码' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次输入的密码不一致'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            placeholder="请输入确认密码"
                            className="modal-input"
                        />
                    </Form.Item>

                    {/* 弹窗底部按钮 */}
                    <div className="modal-footer-btns">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="btn-submit"
                        >
                            提交
                        </Button>
                        <Button
                            onClick={handleCloseModal}
                            className="btn-close"
                        >
                            关闭
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default Security;