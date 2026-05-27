import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { PageHeader } from '@/components/ui';
import { Users, CreditCard, ShoppingBag, Tags, Ticket, BarChart3, Settings, Megaphone, HandCoins, Server, DollarSign, Gift } from 'lucide-react';

const adminCards = [
  { to: '/admin/users', label: 'Пользователи', icon: Users, desc: 'Поиск, управление', color: 'text-accent-400' },
  { to: '/admin/payments', label: 'Платежи', icon: DollarSign, desc: 'Просмотр, верификация', color: 'text-emerald-400' },
  { to: '/admin/tariffs', label: 'Тарифы', icon: Tags, desc: 'Управление тарифами', color: 'text-purple-400' },
  { to: '/admin/stats', label: 'Статистика', icon: BarChart3, desc: 'Графики и отчёты', color: 'text-yellow-400' },
  { to: '/admin/tickets', label: 'Тикеты', icon: Ticket, desc: 'Поддержка пользователей', color: 'text-accent-400' },
  { to: '/admin/settings', label: 'Настройки', icon: Settings, desc: 'Системные настройки', color: 'text-dark-200' },
  { to: '/admin/broadcasts', label: 'Рассылки', icon: Megaphone, desc: 'Создать рассылку', color: 'text-accent-400' },
  { to: '/admin/withdrawals', label: 'Выводы', icon: HandCoins, desc: 'Заявки на вывод', color: 'text-yellow-400' },
  { to: '/admin/servers', label: 'Серверы', icon: Server, desc: 'Управление серверами', color: 'text-emerald-400' },
  { to: '/admin/promocodes', label: 'Промокоды', icon: Gift, desc: 'Управление промокодами', color: 'text-accent-400' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  return (
    <div>
      <PageHeader title="Админ-панель" subtitle="Управление сервисом" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminCards.map(card => (
          <div key={card.to} className="card-hover cursor-pointer" onClick={() => navigate(card.to)}>
            <card.icon className={`${card.color} mb-2`} size={24} />
            <p className="font-semibold">{card.label}</p>
            <p className="text-xs text-dark-400">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminSection() {
  return <Outlet />;
}
