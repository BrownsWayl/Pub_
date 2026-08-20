import React from 'react';
import { Card, Row, Col, Dropdown } from 'antd';
// 🚀 核心：直接引入同级目录下的专属扁平化侧边栏样式表
import './menuConfig.css';
import {
  LaptopOutlined, LineChartOutlined, TabletOutlined,
  BookOutlined, CompassOutlined, SafetyCertificateOutlined, QuestionCircleOutlined,
  TeamOutlined, IdcardOutlined, HistoryOutlined, PieChartOutlined, BarChartOutlined,
  // 🚀 引入图 2 同款的高级扁平化大类图标
  HomeOutlined,       // 对应总览/持仓
  SlidersOutlined,    // 对应交易账号
  WalletOutlined,     // 对应资产/资金管理
  BellOutlined,       // 对应消息中心
  SettingOutlined,      // 对应设置
  DollarCircleOutlined,
  DollarOutlined,
  PayCircleOutlined, TransactionOutlined
} from '@ant-design/icons';




// =================== 🚀 扁平化重新设计的后台管理菜单（全外层平铺） ===================
export const dashboardMenuItems = [


];

export const defaultMenuItems = [
  // 核心业务区块：总览与持仓
  // 交易管理区块
  { key: '/dashboard/accountlist', label: '我的交易账号', icon: <SlidersOutlined /> },
  { key: '/dashboard/position', label: '我的持仓列表', icon: <HomeOutlined /> },
  { key: '/dashboard/tradehistory', label: '交易历史记录', icon: <HistoryOutlined /> },
  { type: 'divider' },

  // 资产与报表区块
  { key: '/dashboard/deposit', label: '在线入金', isOpenNewTab: true, icon: <DollarOutlined /> },
  { key: '/dashboard/cashout', label: '出金申请', icon: <PayCircleOutlined /> },
  { key: '/dashboard/transfer', label: '内部转账', icon: <TransactionOutlined /> },
  { type: 'divider' },
  { key: '/dashboard/accountrecord', label: '申请记录', icon: <TransactionOutlined/>},
  { key: '/dashboard/fundrecords', label: '账户资金记录', icon: <WalletOutlined /> },

];

// 🟢 特殊用户/专业版专属控制台菜单
export const specialMenuItems = [
  // 客户管理区块
  { key: '/dashboard/broker', label: 'Broker用户管理', icon: <TeamOutlined /> },
  { type: 'divider' },
  { key: '/dashboard/trader', label: 'Trader用户管理', icon: <IdcardOutlined /> },
  { type: 'divider' },
  { key: '/dashboard/commissionreport', label: '佣金报表', icon: <BarChartOutlined /> },
];