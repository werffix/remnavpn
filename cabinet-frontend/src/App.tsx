import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/layout/ProtectedRoute';

import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import SubscriptionPage from '@/pages/subscription/SubscriptionPage';
import TariffsPage from '@/pages/subscription/TariffsPage';
import BalancePage from '@/pages/balance/BalancePage';
import ReferralPage from '@/pages/referral/ReferralPage';
import TicketsPage from '@/pages/tickets/TicketsPage';
import NewsPage from '@/pages/news/NewsPage';
import InfoPage from '@/pages/info/InfoPage';
import WheelPage from '@/pages/wheel/WheelPage';
import ContestsPage from '@/pages/contests/ContestsPage';
import PollsPage from '@/pages/polls/PollsPage';
import ProfilePage from '@/pages/profile/ProfilePage';

import AdminDashboard, { AdminSection } from '@/pages/admin/AdminLayout';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminPaymentsPage from '@/pages/admin/AdminPaymentsPage';
import AdminTicketsPage from '@/pages/admin/AdminTicketsPage';
import AdminTariffsPage from '@/pages/admin/AdminTariffsPage';
import AdminWithdrawalsPage from '@/pages/admin/AdminWithdrawalsPage';
import AdminStatsPage from '@/pages/admin/AdminStatsPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30000 } },
});

function AppContent() {
  const { init, isLoading } = useAuthStore();
  useEffect(() => { init(); }, []);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-dark-400 text-sm">Загрузка...</p>
      </div>
    </div>
  );

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155', borderRadius: 12 }, success: { iconTheme: { primary: '#22c55e', secondary: '#1e293b' } }, error: { iconTheme: { primary: '#ef4444', secondary: '#1e293b' } } }} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/tariffs" element={<TariffsPage />} />
            <Route path="/balance" element={<BalancePage />} />
            <Route path="/referral" element={<ReferralPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/info" element={<InfoPage />} />
            <Route path="/wheel" element={<WheelPage />} />
            <Route path="/contests" element={<ContestsPage />} />
            <Route path="/polls" element={<PollsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminSection />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="payments" element={<AdminPaymentsPage />} />
              <Route path="tickets" element={<AdminTicketsPage />} />
              <Route path="tariffs" element={<AdminTariffsPage />} />
              <Route path="withdrawals" element={<AdminWithdrawalsPage />} />
              <Route path="stats" element={<AdminStatsPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
