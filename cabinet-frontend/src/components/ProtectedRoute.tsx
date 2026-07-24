import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'

export default function ProtectedRoute() {
  const isAuth = useAuthStore((s) => s.isAuthenticated)
  if (!isAuth) return <Navigate to="/login" replace />
  return <Outlet />
}
