import React, { useState } from 'react';
import { Form, Input, Button, Upload, message, Breadcrumb } from 'antd';
import { UserOutlined, LockOutlined, UploadOutlined } from '@ant-design/icons';
import './profile.css';

export const Profile = () => {
    const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'password'
    const [form] = Form.useForm();

    // 模拟用户数据
    const userData = {
        avatar: '',
        username: 'desonfx.xie',
        agentId: '1Z4Y',
        tradeId: '1Z4N',
        email: 'desonfx.xie@icloud.com',
        phone: '84024318',
        birthday: '2001-07-12',
        address: '中国香港特别行政区 香港 上水 上水',
        detailAddress: ''
    };

    const handlePasswordSubmit = (values) => {
        message.success('密码修改成功');
        form.resetFields();
    };

    return (
        <div style={{
            padding: '20px',
            backgroundColor: '#f3f4f6',
            minHeight: '100vh',
            boxSizing: 'border-box'
        }}>
            {/* 🟢 1. 顶部标题与面包屑导航 */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '4px',
                        height: '18px',
                        backgroundColor: '#10b981', // 绿色标志竖条
                        borderRadius: '2px'
                    }} />
                    <span style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                        我的信息
                    </span>
                </div>

                <Breadcrumb
                    items={[
                        { title: '设置' },
                        { title: '基本资料' }
                    ]}
                    style={{ fontSize: '13px', color: '#6b7280' }}
                />
            </div>

            {/* ⚪ 2. 主卡片容器 */}
            <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '4px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                overflow: 'hidden'
            }}>
                {/* Tab 切换栏 */}
                <div style={{
                    display: 'flex',
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: '#ffffff'
                }}>
                    <div
                        onClick={() => setActiveTab('basic')}
                        style={{
                            padding: '12px 24px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: activeTab === 'basic' ? '500' : '400',
                            color: activeTab === 'basic' ? '#10b981' : '#4b5563',
                            borderRight: '1px solid #e5e7eb',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: activeTab === 'basic' ? '#ffffff' : '#fafafa'
                        }}
                    >
                        <UserOutlined />
                        基本信息
                    </div>
                    <div
                        onClick={() => setActiveTab('password')}
                        style={{
                            padding: '12px 24px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: activeTab === 'password' ? '500' : '400',
                            color: activeTab === 'password' ? '#10b981' : '#4b5563',
                            borderRight: '1px solid #e5e7eb',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: activeTab === 'password' ? '#ffffff' : '#fafafa'
                        }}
                    >
                        <LockOutlined />
                        修改密码
                    </div>
                </div>

                {/* 🔵 3. 基本信息页 */}
                {activeTab === 'basic' && (
                    <div className="profile-info-container" style={{ padding: '24px 16px' }}>
                        {/* 头像行 */}
                        <div className="profile-row">
                            <div className="profile-label">头像</div>
                            <div className="profile-value">
                                <Upload
                                    name="avatar"
                                    showUploadList={false}
                                    beforeUpload={() => false}
                                >
                                    <div style={{ cursor: 'pointer', display: 'inline-block', textAlign: 'center' }}>
                                        <div style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            backgroundColor: '#fcd34d',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '6px',
                                            overflow: 'hidden'
                                        }}>
                                            <UserOutlined style={{ fontSize: '42px', color: '#ffffff' }} />
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>点击头像更换</div>
                                    </div>
                                </Upload>
                            </div>
                        </div>

                        <div className="profile-row">
                            <div className="profile-label">用户名</div>
                            <div className="profile-value">{userData.username}</div>
                        </div>

                        <div className="profile-row">
                            <div className="profile-label">代理识别ID</div>
                            <div className="profile-value">{userData.agentId}</div>
                        </div>

                        <div className="profile-row">
                            <div className="profile-label">交易识别ID</div>
                            <div className="profile-value">{userData.tradeId}</div>
                        </div>

                        <div className="profile-row">
                            <div className="profile-label">邮箱</div>
                            <div className="profile-value">{userData.email}</div>
                        </div>

                        <div className="profile-row">
                            <div className="profile-label">电话</div>
                            <div className="profile-value">{userData.phone}</div>
                        </div>

                        <div className="profile-row">
                            <div className="profile-label">出生日期</div>
                            <div className="profile-value">{userData.birthday}</div>
                        </div>

                        <div className="profile-row">
                            <div className="profile-label">地址</div>
                            <div className="profile-value">{userData.address}</div>
                        </div>

                        <div className="profile-row" style={{ borderBottom: 'none' }}>
                            <div className="profile-label">详细地址</div>
                            <div className="profile-value">{userData.detailAddress || '-'}</div>
                        </div>
                    </div>
                )}

                {/* 🔴 4. 修改密码页 */}
                {activeTab === 'password' && (
                    <div style={{ padding: '24px', maxWidth: '800px' }}>
                        <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '24px' }}>
                            密码必须6-18位包含大小写字母/数字/符号任意两者组合
                        </div>

                        <Form
                            form={form}
                            layout="horizontal"
                            labelCol={{ span: 5 }}
                            wrapperCol={{ span: 18 }}
                            onFinish={handlePasswordSubmit}
                            style={{ maxWidth: '600px' }}
                        >
                            <Form.Item
                                label={<span style={{ fontWeight: '500', color: '#374151' }}>原始密码</span>}
                                name="oldPassword"
                                rules={[{ required: true, message: '请输入原始密码' }]}
                            >
                                <Input.Password placeholder="请输入原始密码" style={{ borderRadius: '4px' }} />
                            </Form.Item>

                            <Form.Item
                                label={<span style={{ fontWeight: '500', color: '#374151' }}>新密码</span>}
                                name="newPassword"
                                rules={[
                                    { required: true, message: '请输入新密码' },
                                    { min: 6, max: 18, message: '密码长度在6-18位之间' }
                                ]}
                            >
                                <Input.Password placeholder="请输入6-18位由小写字母/大写字母/数字组合的新密码" style={{ borderRadius: '4px' }} />
                            </Form.Item>

                            <Form.Item
                                label={<span style={{ fontWeight: '500', color: '#374151' }}>确认密码</span>}
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
                                <Input.Password placeholder="请输入确认密码" style={{ borderRadius: '4px' }} />
                            </Form.Item>

                            <Form.Item wrapperCol={{ offset: 5, span: 18 }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{
                                        backgroundColor: '#00bfa5',
                                        borderColor: '#00bfa5',
                                        padding: '0 28px',
                                        borderRadius: '4px',
                                        height: '36px',
                                        fontSize: '14px'
                                    }}
                                >
                                    提交
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;