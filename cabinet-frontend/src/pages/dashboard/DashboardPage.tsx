import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { useAuthStore } from '@/store/authStore';
import { ProgressBar } from '@/components/ui';
import { formatKopeks, formatBytes, daysLeft, progressPercent } from '@/utils/format';
import { Link } from 'react-router-dom';
import { Wallet, TrendingUp, Users, Gift, ArrowRight, Zap, Activity } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: subs } = useQuery({ queryKey: ['subscriptions'], queryFn: api.subscription.get });
  const { data: stats } = useQuery({ queryKey: ['referral-stats'], queryFn: api.referral.stats });
  const { data: transactions } = useQuery({ queryKey: ['transactions'], queryFn: () => api.balance.transactions({ size: 5 }) });

  const sub = subs?.[0];
  const trafficPct = sub ? progressPercent(sub.traffic_used_bytes, sub.traffic_limit_bytes) : 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Добро пожаловать, {user?.first_name}!</h1>
        <p className="text-dark-400">Ваш личный кабинет VPN</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center"><Wallet className="text-accent-400" size={20} /></div>
            <span className="text-sm text-dark-400">Баланс</span>
          </div>
          <p className="text-2xl font-bold">{formatKopeks(user?.balance_kopeks || 0)}</p>
          <Link to="/balance" className="text-xs text-accent-400 hover:text-accent-300 mt-2 inline-flex items-center gap-1">Пополнить <ArrowRight size={12} /></Link>
        </div>
        <div className="card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><Activity className="text-emerald-400" size={20} /></div>
            <span className="text-sm text-dark-400">Подписка</span>
          </div>
          {sub ? (
            <>
              <p className="text-2xl font-bold">{daysLeft(sub.end_date)} дн.</p>
              <p className="text-xs text-dark-400 mt-1">до {sub.status === 'TRIAL' ? 'окончания триала' : 'истечения'}</p>
            </>
          ) : <p className="text-dark-400">Нет подписки</p>}
          <Link to="/subscription" className="text-xs text-accent-400 hover:text-accent-300 mt-2 inline-flex items-center gap-1">Детали <ArrowRight size={12} /></Link>
        </div>
        <div className="card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center"><Users className="text-purple-400" size={20} /></div>
            <span className="text-sm text-dark-400">Рефералы</span>
          </div>
          <p className="text-2xl font-bold">{stats?.total_invited || 0}</p>
          <p className="text-xs text-dark-400 mt-1">заработано {formatKopeks(stats?.total_earnings_kopeks || 0)}</p>
        </div>
        <div className="card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center"><TrendingUp className="text-yellow-400" size={20} /></div>
            <span className="text-sm text-dark-400">Конверсия</span>
          </div>
          <p className="text-2xl font-bold">{stats?.conversion_rate || 0}%</p>
          <p className="text-xs text-dark-400 mt-1">{stats?.paid_referrals || 0} оплатили</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sub && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2"><Zap size={18} className="text-accent-400" /> Трафик</h2>
              <Link to="/subscription" className="text-sm text-accent-400 hover:text-accent-300">Управлять</Link>
            </div>
            <ProgressBar value={sub.traffic_used_bytes} max={sub.traffic_limit_bytes} className="mb-2" />
            <div className="flex justify-between text-sm">
              <span className="text-dark-400">{formatBytes(sub.traffic_used_bytes)} использовано</span>
              <span className="text-dark-200">{formatBytes(sub.traffic_limit_bytes)} всего</span>
            </div>
          </div>
        )}

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2"><TrendingUp size={18} className="text-accent-400" /> Последние операции</h2>
            <Link to="/balance" className="text-sm text-accent-400 hover:text-accent-300">Все</Link>
          </div>
          {transactions?.items?.length ? (
            <div className="space-y-2">
              {transactions.items.map(tx => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-dark-600 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{tx.description || tx.type}</p>
                    <p className="text-xs text-dark-400">{new Date(tx.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={tx.amount_kopeks > 0 ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>
                    {tx.amount_kopeks > 0 ? '+' : ''}{formatKopeks(tx.amount_kopeks)}
                  </span>
                </div>
              ))}
            </div>
          ) : <p className="text-dark-400 text-sm">Нет операций</p>}
        </div>
      </div>
    </div>
  );
}
