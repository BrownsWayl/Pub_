import React, { useState, useEffect, useRef } from 'react';
import { Breadcrumb, Form, Button, Radio, message, notification, Modal } from 'antd';
import styles from './RiskAssessment.module.css';
import { useAuth } from '../components/AuthContext'; // 引入自定义的 AuthContext
import api from '../utils/api'; // 引入封装的 axios 实例


const RiskAssessment = () => {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState('notice'); // notice: 须知页, quiz: 答题页

    const questions = [
        {
            id: 'q1',
            number: '1',
            title: '您是否有或预期有任何特殊的健康或财政状况，需本公司在评估您的产品合适性时作出特别考虑?',
            options: [
                { label: '是', value: '1' },
                { label: '否', value: '2' }
            ]
        },
        {
            id: 'q2',
            number: '2',
            title: '您年收入是否超过港币10万或拥有可投资资产超过港币36万，令您于财政上能支持您的基本日常生活?',
            options: [
                { label: '是', value: '1' },
                { label: '否', value: '2' }
            ]
        },
        {
            id: 'q3',
            number: '3',
            title: '您所属的年龄组别。',
            options: [
                { label: '18 - 25 岁', value: 'A' },
                { label: '25 - 31 岁', value: 'B' },
                { label: '31 岁 - 59 岁', value: 'C' },
                { label: '59 岁以上', value: 'D' }
            ]
        },
        {
            id: 'q4',
            number: '4',
            title: '您的最高学历是?',
            options: [
                { label: '小学以下', value: 'A' },
                { label: '大专', value: 'B' },
                { label: '本科', value: 'C' },
                { label: '本科以上', value: 'D' }
            ]
        },
        {
            id: 'q5',
            number: '5',
            title: '您可以用作储蓄或投资的款项平均占您收入百分比为?',
            options: [
                { label: '少于 5%', value: 'A' },
                { label: '5% 至少于 10%', value: 'B' },
                { label: '10% 至少于 20%', value: 'C' },
                { label: '20% 至少于 30%', value: 'D' },
                { label: '30% 或以上', value: 'E' }
            ]
        },
        {
            id: 'q6',
            number: '6',
            title: '您打算用作为投资用途的款项平均占您的总资产净值中的百分比为 (物业除外)?',
            options: [
                { label: '少于 5%', value: 'A' },
                { label: '5% 至少于 10%', value: 'B' },
                { label: '10% 至少于 20%', value: 'C' },
                { label: '20% 至少于 30%', value: 'D' },
                { label: '30% 或以上', value: 'E' }
            ]
        },
        {
            id: 'q7',
            number: '7',
            title: '下列那项陈述最能表达您的主要投资目的及投资取向。',
            options: [
                { label: '在一般情况下，本人的主要投资目的以资本增值为主，可承受 -50% 以上至 +50% 以上的投资回报。', value: 'A' },
                { label: '在一般情况下，本人的主要投资目的以资本保障为主，不可承受金融投资上任何价格波动。', value: 'B' }
            ]
        },
        {
            id: 'q8',
            number: '8',
            title: '您在贵金属投资方面的经验。',
            options: [
                { label: '没有经验', value: 'A' },
                { label: '少于 1 年', value: 'B' },
                { label: '1 至 5 年', value: 'C' },
                { label: '超过 5 年', value: 'D' }
            ]
        },
        {
            id: 'q9',
            number: '9',
            title: '您明白及了解所有投资附带风险，投资价格可升可跌，甚至变成毫无价值，过往表现并非代表未来表现的指标。',
            options: [
                { label: '是，本人完全明白', value: 'A' },
                { label: '否，本人仍有疑问', value: 'B' }
            ]
        },
        {
            id: 'q10',
            number: '10',
            title: '您是否愿意接受相关杠杆投资产品，并有可能招致超出您的初始保证金的损失。',
            options: [
                { label: '是，本人愿意接受该风险', value: 'A' },
                { label: '否，本人不愿意接受', value: 'B' }
            ]
        },
        {
            id: 'q11',
            number: '11',
            title: '本人通过教育/专业知识/其它来源拥有贵金属产品/杠杆投资产品的知识，及拥有投资的经验。',
            options: [
                { label: '是', value: 'A' },
                { label: '否', value: 'B' }
            ]
        }
    ];

    // 🚀 核心逻辑：顺序拼接并生成 TXT 下载文件
    const onFinish = async (values) => {
        try {
            // 1. 定义题目的 key 顺序（1 - 11题）
            const questionKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11'];

            // 2. 依次取出对应 value 并拼成一长串字符串
            const resultString = questionKeys.map(key => values[key]).join('');

            console.log('🎉 成功生成的问卷值串:', resultString); // 控制台可见如 "AABCABAAA"
            // 将用户的数据传送的后端保存
            //      await api.post('/user/risk-assessment', { ressultString }); // 替换为你的提交 API
            //      completeRiskAssessment(); // 更新全局状态和 sessionStorage，标记用户已完成风险评估
            //      message.success('问卷已成功提交并已为您自动导出结果 TXT 文件！');
            navigate('/dashboard'); // 提交成功后跳转到 dashboard 首页
        } catch (error) {
            console.error('提交失败:', error);
            message.error('生成文件失败，请检查选项是否填答完整。');
        }
    };

    //   const hasShownModal = useRef(false); // 用于确保 Modal 只显示一次
    useEffect(() => {

        Modal.warning({
            title: '需要进行风险评估',
            content: '检测到您尚未完成风险评估，请先填写以下问卷以解锁完整功能。',
            okText: '好的，开始填写',
        });
        //    hasShownModal.current = true; // 标记为已显示

    }, []);

    return (
        <div className={styles.pageGlobalBackground}>
            <div className={styles.tableTitleArea}>
                <Breadcrumb className={styles.breadcrumb} separator=">">
                    <Breadcrumb.Item>客户中心</Breadcrumb.Item>
                    <Breadcrumb.Item className={styles.breadcrumbActive}>风险评估</Breadcrumb.Item>
                </Breadcrumb>
                <h2>投资风险取向评估问卷</h2>
            </div>

            <div className={styles.formCardWrapper}>
                {currentStep === 'notice' ? (
                    <div className={styles.noticeContainer}>
                        <div className={styles.sectionHeader}>客户须知</div>
                        <ol className={styles.noticeList}>
                            <li>本问卷用以协助 Deson 公司评估您的投资风险取向，并收集有关您的风险取向、财务状况、投资经验的资料。如您不提供有关资料，Deson 公司可能无法处理您的申请。本问卷并不构成任何投资产品或服务的邀约、招揽或建议，且不应被当作为一项投资建议。</li>
                            <li>为作出合理的产品合适性评估，Deson 公司需要您提供有关财务状况、投资经验及投资目标的资料。您在作出任何投资决定前，亦应考虑您的个人状况，包括但不限于您的财政状况、投资经验及投资目标。在作出任何投资决定前，请考虑咨询您的独立投资顾问。</li>
                            <li>有关您的财务或投资资料之问题，例如可投资资产、某一产品的总投资金额或投资经验等，您在 Deson 公司之内及 Deson 公司以外的所有资产及交易均应计算在内。</li>
                            <li>Deson 公司将会根据资料政策通告使用并保密处理本问卷所收集的资料。</li>
                            <li>本问卷的结果来自您向本行提供的资料。您必须提供有效、真实、完整、准确及最新的资料，否则将会严重影响合适性评估。</li>
                            <li>请选取最适合您情况的答案。</li>
                        </ol>

                        <div className={styles.sectionHeader} style={{ marginTop: '24px' }}>重要事项</div>
                        <div className={styles.importantBox}>
                            Deson 公司将就您对整份问卷提供的答案而综合评估您的投资风险取向，而非取决于问卷内任何单一问题的答案。
                        </div>

                        <div className={styles.buttonCenterBar}>
                            <Button
                                type="primary"
                                className={styles.actionPrimaryBtn}
                                onClick={() => setCurrentStep('quiz')}
                            >
                                开始填写问卷
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
                        {questions.map((q) => (
                            <div key={q.id} className={styles.quizBlock}>
                                <div className={styles.questionTitle}>
                                    <span className={styles.questionNumber}>{q.number}.</span> {q.title}
                                </div>
                                <Form.Item
                                    name={q.id}
                                    rules={[{ required: true, message: '请选择符合您的对应选项' }]}
                                >
                                    <Radio.Group className={styles.radioCustomGroup}>
                                        {q.options.map((opt) => (
                                            <Radio
                                                key={opt.value}
                                                value={opt.value}
                                                className={styles.radioCustomCard}
                                            >
                                                {opt.label}
                                            </Radio>
                                        ))}
                                    </Radio.Group>
                                </Form.Item>
                            </div>
                        ))}

                        <div className={styles.formBottomActionsBar}>
                            <Button
                                onClick={() => setCurrentStep('notice')}
                                className={styles.actionSecondaryBtn}
                            >
                                返回阅读须知
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className={styles.actionPrimaryBtn}
                            >
                                提交评估问卷
                            </Button>
                        </div>
                    </Form>
                )}
            </div>
        </div>
    );
};

export default RiskAssessment;