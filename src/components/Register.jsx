import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Steps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { useAuth } from './AuthContext'; // 引入自定义的 AuthContext
import api from '../utils/api'; // 引入封装的 axios 实例

export const Register = () => {
    const navigate = useNavigate();
    const [showInvite, setShowInvite] = useState(false);

    // 表单提交成功处理
    const onFinish = async (values) => {
        console.log("注册提交表单数据:", values);

        try {
            {/* 实际后端数据处理在此处  */ }
            /*    const res = await api.post('/user/register', {
                   username: values.username,
                   password: values.password,
                   inviteCode: values.inviteCode
               });
   
               if (res.success) {
                   // 演示项目：直接提示并前往登录页
                   alert('演示：注册成功！');
                   navigate('/login');
               } */
        } catch (err) {
            console.error("注册请求发生错误:", err);
        }
    };

    return (
        <div className="auth-page-container">

            {/* 🌄 【左半边】：网页端 50% 插画区（移动端自动隐藏） */}
            <div className="auth-left-banner">
                <div className="left-banner-inner">
                    <h2>全球专业黄金交易平台</h2>
                    <p>30秒快速开通 Live 及 Demo 账户</p>
                    <img
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
                        alt="Platform Illustration"
                    />
                </div>
            </div>

            {/* 📝 【右半边】：表单交互区 */}
            <div className="auth-right-form-wrapper">
                <div className="form-inner-block">

                    {/* 1. 标题 */}
                    <h1 className="register-main-title">
                        欢迎加入XXXXX
                    </h1>

                    <div className="form-scroll-box">
                        <Form name="register_form" onFinish={onFinish} layout="vertical" requiredMark={false}>

                            {/* 👤 账号输入框 */}
                            <Form.Item
                                name="username"
                                rules={[
                                    { required: true, message: '请输入用户名/邮箱账号!' },
                                    { min: 4, message: '账号长度不能少于4位!' }
                                ]}
                                style={{ marginBottom: '20px' }}
                            >
                                <Input
                                    placeholder="请输入用户名 / 电子邮箱"
                                    className="large-input"
                                />
                            </Form.Item>

                            {/* 🔒 密码输入框 */}
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: '请输入您的登录密码!' }]}
                                style={{ marginBottom: '20px' }}
                            >
                                <Input.Password
                                    placeholder="请输入密码"
                                    className="large-input"
                                />
                            </Form.Item>

                            {/* 🔒 确认密码输入框 */}
                            <Form.Item
                                name="confirmPassword"
                                dependencies={['password']} /* 👈 依赖于密码框的值 */
                                rules={[
                                    { required: true, message: '请再次输入密码以确认!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('两次输入的密码不一致!'));
                                        },
                                    }),
                                ]}
                                style={{ marginBottom: '20px' }}
                            >
                                <Input.Password
                                    placeholder="请再次输入密码确认"
                                    className="large-input"
                                />
                            </Form.Item>

                            {/* ✉️ 邀请码折叠区域 */}
                            <div className="invite-toggle-row">
                                <div
                                    onClick={() => setShowInvite(!showInvite)}
                                    className="invite-trigger"
                                >
                                    邀请码（可选） <DownOutlined className={`invite-arrow ${showInvite ? 'rotated' : ''}`} />
                                </div>
                                {showInvite && (
                                    <Form.Item name="inviteCode" style={{ marginTop: '8px', marginBottom: 0 }}>
                                        <Input placeholder="请输入邀请码" className="invite-input" />
                                    </Form.Item>
                                )}
                            </div>

                            {/* 📝 隐私与用户协议勾选 */}
                            <Form.Item
                                name="agreement"
                                valuePropName="checked"
                                rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('请先阅读并同意相关协议')) }]}
                                style={{ marginBottom: '28px' }}
                            >
                                <Checkbox className="agreement-checkbox">
                                    <span className="agreement-text">
                                        已阅读并同意《<a href="/useragreement" target="_blank" rel="noopener noreferrer">
                                            用户协议
                                        </a>》
                                    </span>
                                </Checkbox>
                            </Form.Item>

                            {/* 🔴 大号下一步红色提交胶囊按钮 */}
                            <Form.Item style={{ marginBottom: '16px' }}>
                                <Button
                                    htmlType="submit"
                                    className="submit-btn"
                                >
                                    下一步
                                </Button>
                            </Form.Item>
                        </Form>

                        {/* 已有账户跳转链接 */}
                        <div className="register-footer">
                            已有账户？ <span onClick={() => navigate('/login')}>去登录</span>
                        </div>

                        {/* 📊 步骤条外壳 */}
                        {/*           <div className="auth-steps-wrapper">
                            <Steps
                                progressDot
                                current={0}
                                size="small"
                                items={[
                                    { title: <span className="step-title active">填写账户信息</span> },
                                    { title: <span className="step-title">实名认证</span> },
                                    { title: <span className="step-title">开户成功</span> },
                                ]}
                            />
                        </div> */}

                    </div>
                </div>
            </div>

        </div>
    );
};

export default Register;