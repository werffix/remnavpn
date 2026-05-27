import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/ui';
import { formatKopeks } from '@/utils/format';
import api from '@/api/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

export default function AdminStatsPage() {
  const { data: stats } = useQuery({ queryKey: ['admin-stats'], queryFn: () => api.get('/admin/stats').then(r => r.data) });
  const { data: sales } = useQuery({ queryKey: ['admin-sales-stats'], queryFn: () => api.get('/admin/sales-stats').then(r => r.data) });

  const revenueData = sales?.by_day?.map((d: any) => ({ date: d.date, revenue: d.revenue_kopeks / 100 })) || [];

  return (
    <div>
      <PageHeader title="Статистика" subtitle="Аналитика сервиса" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="card text-center"><p className="text-xs text-dark-400">Пользователи</p><p className="text-2xl font-bold">{stats?.total_users || 0}</p></div>
        <div className="card text-center"><p className="text-xs text-dark-400">Активных</p><p className="text-2xl font-bold text-emerald-400">{stats?.active_users || 0}</p></div>
        <div className="card text-center"><p className="text-xs text-dark-400">Подписки</p><p className="text-2xl font-bold text-accent-400">{stats?.total_subscriptions || 0}</p></div>
        <div className="card text-center"><p className="text-xs text-dark-400">Доход</p><p className="text-2xl font-bold text-yellow-400">{formatKopeks(stats?.total_revenue_kopeks || 0)}</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Доход по дням</h3>
          {revenueData.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="100%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="url(#revGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : <p className="text-dark-400">Нет данных</p>}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Популярные тарифы</h3>
          {sales?.by_tariff?.length ? (
            <div className="space-y-2">
              {sales.by_tariff.map((t: any) => (
                <div key={t.name} className="flex items-center justify-between py-2 border-b border-dark-600 last:border-0">
                  <span>{t.name}</span>
                  <span className="font-medium">{t.count} шт. — {formatKopeks(t.revenue_kopeks)}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-dark-400">Нет данных</p>}
          <div className="mt-4 pt-4 border-t border-dark-600">
            <p className="text-sm font-medium mb-2">Методы оплаты</p>
            {sales?.by_payment_method?.length ? sales.by_payment_method.map((m: any) => (
              <div key={m.method} className="flex justify-between text-sm py-1"><span>{m.method}</span><span>{formatKopeks(m.revenue_kopeks)} ({m.count} шт.)</span></div>
            )) : <p className="text-dark-400 text-sm">Нет данных</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
