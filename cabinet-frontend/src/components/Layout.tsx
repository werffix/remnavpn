import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import {
  User, CreditCard, Users, HeadphonesIcon, Newspaper,
  Shield, LogOut, Menu, X, Zap
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { to: '/', icon: User, label: 'Кабинет' },
  { to: '/subscription', icon: Zap, label: 'Подписка' },
  { to: '/balance', icon: CreditCard, label: 'Баланс' },
  { to: '/referral', icon: Users, label: 'Рефералы' },
  { to: '/support', icon: HeadphonesIcon, label: 'Поддержка' },
  { to: '/news', icon: Newspaper, label: 'Новости' },
]

const adminItems = [
  { to: '/admin/stats', icon: Shield, label: 'Статистика' },
  { to: '/admin/users', icon: Users, label: 'Пользователи' },
  { to: '/admin/tariffs', icon: Zap, label: 'Тарифы' },
  { to: '/admin/payments', icon: CreditCard, label: 'Платежи' },
]

export default function Layout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
      isActive
        ? 'bg-brand-600/20 text-brand-400'
        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
    }`

  return (
    <div className="flex h-screen">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800
        flex flex-col transform transition-transform lg:transform-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-brand-500" />
            <span className="text-lg font-bold">q1 vpn</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} onClick={() => setSidebarOpen(false)}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}

          {user?.is_admin && (
            <>
              <div className="pt-3 pb-1 px-3 text-xs font-semibold text-gray-500 uppercase">Админ</div>
              {adminItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={linkClass} onClick={() => setSidebarOpen(false)}>
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        <div className="p-3 border-t border-gray-800">
          <div className="px-3 py-2 text-sm text-gray-400">
            {user?.full_name || 'Пользователь'}
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 w-full transition-colors">
            <LogOut className="w-4 h-4" />
            Выйти
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-gray-800 flex items-center px-4 gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <div className="ml-auto text-sm text-gray-400">
            {user?.balance_kopeks !== undefined && (
              <span>Баланс: <b className="text-gray-200">{(user.balance_kopeks / 100).toFixed(0)} ₽</b></span>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
