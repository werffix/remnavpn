import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/auth'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/auth/LoginPage'
import CabinetPage from './pages/cabinet/CabinetPage'
import SubscriptionPage from './pages/subscription/SubscriptionPage'
import PurchasePage from './pages/subscription/PurchasePage'
import BalancePage from './pages/balance/BalancePage'
import TopupPage from './pages/balance/TopupPage'
import ReferralPage from './pages/referral/ReferralPage'
import TicketsPage from './pages/support/TicketsPage'
import NewsPage from './pages/news/NewsPage'
import AdminUsersPage from './pages/admin/users/UsersPage'
import AdminTariffsPage from './pages/admin/tariffs/TariffsPage'
import AdminPaymentsPage from './pages/admin/payments/PaymentsPage'
import AdminStatsPage from './pages/admin/stats/StatsPage'

export default function App() {
  const isAuth = useAuthStore((s) => s.isAuthenticated)

  return (
    <Routes>
      <Route path="/login" element={isAuth ? <Navigate to="/" /> : <LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<CabinetPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/subscription/purchase" element={<PurchasePage />} />
          <Route path="/balance" element={<BalancePage />} />
          <Route path="/balance/topup" element={<TopupPage />} />
          <Route path="/referral" element={<ReferralPage />} />
          <Route path="/support" element={<TicketsPage />} />
          <Route path="/news" element={<NewsPage />} />

          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/tariffs" element={<AdminTariffsPage />} />
          <Route path="/admin/payments" element={<AdminPaymentsPage />} />
          <Route path="/admin/stats" element={<AdminStatsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
