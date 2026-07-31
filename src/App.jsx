import React from 'react';
import { Grid } from 'antd';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomeContent from './HomeContent';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { UserDashboard } from './pages/UserDashboard';
import { BrokerPage } from './pages/BrokerPages';
import { TraderPage } from './pages/TraderPages';
import { AccountListPage } from './pages/AccountListPages';
import { FundRecordsPage } from './pages/FundRecordsPages';
import { PositionPage } from './pages/PositionPages';
import { TradeHistoryPage } from './pages/TradeHistoryPages';
import { CommissionReportPage } from './pages/CommissionReportPages';
import RiskAssessment from './pages/RiskAssessment';
import { UserAgreement } from './pages/UserAgreement';
import DepositPage from './pages/DepositPages';
import CashOut from './pages/CashOut';
import BankCard from './pages/BankCard';
import Transfer from './pages/Transfer';
import { Profile } from './pages/Profile';
import Security from './pages/Security';

const { useBreakpoint } = Grid;

export default function App() {
  const screens = useBreakpoint();
  const isMobile = screens.md === false;

  return (
    <Router>
      <Routes>
        {/* 前台页面 */}
        <Route path="/" element={<HomeContent isMobile={isMobile} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/useragreement" element={<UserAgreement />} />

        {/* 👑 后台控制台整体路由（左右穿透式布局结构） */}
        <Route path="/dashboard" element={<UserDashboard isMobile={isMobile} />}>
          <Route index element={<Navigate to="/dashboard/broker" replace />} />
          <Route path="broker" element={<BrokerPage />} />
          <Route path="trader" element={<TraderPage />} />
          <Route path="accountlist" element={<AccountListPage />} />
          <Route path="fundrecords" element={<FundRecordsPage />} />
          <Route path="position" element={<PositionPage />} />
          <Route path="tradehistory" element={<TradeHistoryPage />} />
          <Route path="commissionreport" element={<CommissionReportPage />} />
          <Route path="riskassessment" element={<RiskAssessment />} />
          <Route path="deposit" element={<DepositPage />} />
          <Route path="cashout" element={<CashOut />} />
          <Route path="bankcard" element={<BankCard />} />
          <Route path="transfer" element={<Transfer />} />
          <Route path='profile' element={<Profile />} />
          <Route path='security' element={<Security />} />

        </Route>
      </Routes>
    </Router>
  );
}