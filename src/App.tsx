import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSession } from './hooks/useSession';

import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';

import { AuthGuard, GuestGuard } from './components/guards/AuthGuard';

// Pages
import Landing from './pages/Landing';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import OtpVerification from './features/auth/pages/OtpVerification';
import SetupMFA from './pages/dashboard/SetupMFA';
import Dashboard from './pages/dashboard/Dashboard';
import Transactions from './pages/dashboard/Transactions';
import Transfer from './pages/dashboard/Transfer';
import TransactionDetails from './pages/dashboard/TransactionDetails';
import Security from './pages/dashboard/Security';
import Profile from './pages/dashboard/Profile';
import Logs from './pages/dashboard/Logs';
import NotFound from './pages/NotFound';

function SessionWrapper({ children }: { children: React.ReactNode }) {
  useSession(); // initializes AuthStore and manages idle timeout
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <SessionWrapper>
        <Routes>
          <Route path="/" element={<Landing />} />
          
          <Route element={<GuestGuard />}>
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
            <Route path="/login" element={<Navigate to="/auth/login" replace />} />
            <Route path="/register" element={<Navigate to="/auth/register" replace />} />
          </Route>

          <Route path="/verify-otp" element={<AuthLayout />}>
            <Route index element={<OtpVerification />} />
          </Route>

          <Route path="/dashboard" element={<AuthGuard />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="transactions/:id" element={<TransactionDetails />} />
              <Route path="transfer" element={<Transfer />} />
              <Route path="security" element={<Security />} />
              <Route path="security/setup-mfa" element={<SetupMFA />} />
              <Route path="profile" element={<Profile />} />
              <Route path="logs" element={<Logs />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </SessionWrapper>
    </BrowserRouter>
  );
}
