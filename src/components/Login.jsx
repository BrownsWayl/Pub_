import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { useAuth } from './AuthContext'; // 引入自定义的 AuthContext
import api from '../utils/api'; // 引入封装的 axios 实例

export const Login = () => {
    //  const { loginUser } = useAuth(); // 恢复并解构登录状态函数
    const navigate = useNavigate();

    const onFinish = (values) => {
        console.log("登录提交数据:", values);
        navigate('/dashboard'); // 直接跳转到 dashboard，RiskGuard 会根据 isRiskAssessed 自动拦截或放行
    }
    // 真实的后端与前端状态交互逻辑  将用户数据放在ssessionstorage中
    /*     const onFinish = async (values) => {
            console.log("登录提交数据:", values);
            try {
                // 发送请求，values 包含 username 和 password
                const response = await api.post('/user/login', {
                    username: values.username,
                    password: values.password
                });
    
                // 解构后端返回的核心数据
                const { token, isRiskAssessed } = response;
    
                // 缓存 Token 凭证
                sessionStorage.setItem('token', token);
    
                // 更新 AuthContext 的全局状态（由前端路由守卫 RiskGuard 自动拦截或放行）
                if (loginUser) {
                    loginUser(isRiskAssessed);
                }
    
                // 尝试进入 dashboard，如未通过风险评估，将被守卫自动截留在风险评估页
                navigate('/dashboard');
            } catch (error) {
                console.error("登录失败:", error);
                message.error('登录失败，请检查您的账号和密码。');
            }
        }; */

    return (
        <div className={styles.authPageContainer}>

            {/* 🌄 【左半边】：网页端 50% 插画区 */}
            <div className={styles.authLeftBanner}>
                <div className={styles.leftBannerInner}>
                    <h2>全球专业黄金交易平台</h2>
                    <p>16年专注现货金银，权威认证护航您的财富增值。</p>
                    <img
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
                        alt="Platform Illustration"
                    />
                </div>
            </div>

            {/* 📝 【右半边】：表单交互区 */}
            <div className={styles.authRightFormWrapper}>
                <div className={styles.formInnerBlock}>

                    <h1 className={styles.loginMainTitle}>欢迎加入DS</h1>

                    <div className={styles.formScrollBox}>
                        <div style={{ width: '100%', height: '100%' }}>
                            <Form name="login_form" onFinish={onFinish} layout="vertical" requiredMark={false} style={{ margin: 0 }}>

                                {/* 👤 账号输入框（替换了原本的复合手机号组件） */}
                                <Form.Item
                                    name="username"
                                    rules={[{ required: true, message: '请输入用户名/邮箱/主账户!' }]}
                                    style={{ marginBottom: '20px' }}
                                >
                                    <Input
                                        prefix={<UserOutlined className={styles.lockIcon} />} // 可选：添加用户图标保持视觉对称
                                        placeholder="请输入账号 / 用户名"
                                        className={styles.passwordLargeInput} // 复用你的大输入框类名以维持高大圆角风格
                                    />
                                </Form.Item>

                                {/* 🔒 密码输入框 */}
                                <Form.Item
                                    name="password"
                                    rules={[{ required: true, message: '请输入登录密码!' }]}
                                    style={{ marginBottom: '16px' }}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className={styles.lockIcon} />}
                                        placeholder="请输入登录密码(非交易密码)"
                                        className={styles.passwordLargeInput}
                                    />
                                </Form.Item>

                                {/* 🔗 忘记密码 */}
                                <div className={styles.forgotRow}>
                                    <span onClick={() => navigate('/forgot-password')} className={styles.forgotLink}>
                                        忘记密码？
                                    </span>
                                </div>

                                {/* 🔴 登录胶囊大按钮 */}
                                <Form.Item style={{ marginBottom: 0 }}>
                                    <Button
                                        htmlType="submit"
                                        className={styles.submitBtn}
                                    >
                                        登 录
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>

                    {/* 底部跳转注册 */}
                    <div className={styles.registerFooter}>
                        没有账户？ <span onClick={() => navigate('/register')}>立即开户</span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;