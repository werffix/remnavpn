import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LayoutDashboard, Subscription, Wallet, Gift, Tickets, Newspaper, Info, Trophy, ChartNoAxesColumnIncreasing, User, Settings, LogOut, Menu, X, Swords, HandCoins, FerrisWheel } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const navItems = [
  { to: '/', label: 'Главная', icon: LayoutDashboard },
  { to: '/subscription', label: 'Подписка', icon: Subscription },
  { to: '/tariffs', label: 'Тарифы', icon: Gift },
  { to: '/balance', label: 'Баланс', icon: Wallet },
  { to: '/referral', label: 'Рефералы', icon: HandCoins },
  { to: '/tickets', label: 'Поддержка', icon: Tickets },
  { to: '/wheel', label: 'Колесо', icon: FerrisWheel },
  { to: '/contests', label: 'Конкурсы', icon: Swords },
  { to: '/polls', label: 'Опросы', icon: ChartNoAxesColumnIncreasing },
  { to: '/news', label: 'Новости', icon: Newspaper },
  { to: '/info', label: 'Инфо', icon: Info },
  { to: '/profile', label: 'Профиль', icon: User },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={clsx('fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-dark-800 border-r border-dark-600 flex flex-col transition-transform lg:translate-x-0', sidebarOpen ? 'translate-x-0' : '-translate-x-full')}>
        <div className="p-5 border-b border-dark-600 flex items-center justify-between">
          <span className="text-lg font-bold text-white">VPN Cabinet</span>
          <button className="lg:hidden text-dark-300 hover:text-white" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => clsx('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                isActive ? 'bg-accent-500/10 text-accent-400' : 'text-dark-200 hover:text-white hover:bg-dark-700')}>
              <item.icon size={18} /> {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-dark-600">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center text-xs font-bold">{user?.first_name?.[0]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.first_name}</p>
              <p className="text-xs text-dark-400">{(user?.balance_kopeks ?? 0) / 100} ₽</p>
            </div>
            <button onClick={logout} className="text-dark-400 hover:text-red-400 transition-colors"><LogOut size={16} /></button>
          </div>
        </div>
      </aside>
      <main className="flex-1 min-h-screen">
        <header className="sticky top-0 z-30 bg-dark-900/80 backdrop-blur-md border-b border-dark-600 px-4 lg:px-6 h-14 flex items-center gap-4">
          <button className="lg:hidden text-dark-300 hover:text-white" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
          <div className="flex-1" />
          <NavLink to="/balance" className="text-sm font-medium text-accent-400 hover:text-accent-300 transition-colors">{((user?.balance_kopeks ?? 0) / 100).toFixed(2)} ₽</NavLink>
        </header>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
