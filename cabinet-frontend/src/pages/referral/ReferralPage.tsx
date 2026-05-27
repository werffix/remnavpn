import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api';
import { PageHeader, EmptyState, StatusBadge } from '@/components/ui';
import { formatKopeks, formatDate } from '@/utils/format';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Users, HandCoins, TrendingUp, Plus, Send, Link as LinkIcon, X, ExternalLink } from 'lucide-react';

export default function ReferralPage() {
  const { data: stats } = useQuery({ queryKey: ['referral-stats'], queryFn: api.referral.stats });
  const { data: referrals } = useQuery({ queryKey: ['referrals-list'], queryFn: () => api.referral.list() });
  const { data: withdrawals, refetch: refetchW } = useQuery({ queryKey: ['withdrawals'], queryFn: api.referral.withdrawals });
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [requisites, setRequisites] = useState('');
  const qc = useQueryClient();

  const withdrawMut = useMutation({
    mutationFn: () => api.referral.requestWithdrawal({ amount_kopeks: parseInt(withdrawAmount) * 100, requisites }),
    onSuccess: () => { toast.success('Заявка создана'); setShowWithdraw(false); refetchW(); qc.invalidateQueries({ queryKey: ['referral-stats'] }); },
    onError: (err: any) => toast.error(err.response?.data?.detail || 'Ошибка'),
  });

  const referralLink = stats?.referral_link || `${window.location.origin}/register?ref=${stats?.referral_code}`;

  return (
    <div>
      <PageHeader title="Реферальная программа" subtitle="Приглашайте друзей и получайте бонусы" />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <div className="card text-center"><p className="text-xs text-dark-400">Приглашено</p><p className="text-xl font-bold">{stats?.total_invited || 0}</p></div>
        <div className="card text-center"><p className="text-xs text-dark-400">Оплатили</p><p className="text-xl font-bold text-emerald-400">{stats?.paid_referrals || 0}</p></div>
        <div className="card text-center"><p className="text-xs text-dark-400">Активных</p><p className="text-xl font-bold text-accent-400">{stats?.active_referrals || 0}</p></div>
        <div className="card text-center"><p className="text-xs text-dark-400">Конверсия</p><p className="text-xl font-bold text-yellow-400">{stats?.conversion_rate || 0}%</p></div>
        <div className="card text-center"><p className="text-xs text-dark-400">Заработано</p><p className="text-xl font-bold text-emerald-400">{formatKopeks(stats?.total_earnings_kopeks || 0)}</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><LinkIcon size={18} className="text-accent-400" /> Ваша ссылка</h2>
          <div className="flex gap-2">
            <input type="text" className="input flex-1 font-mono text-xs" value={referralLink} readOnly />
            <button onClick={() => { navigator.clipboard.writeText(referralLink); toast.success('Скопировано!'); }} className="btn-primary">Копировать</button>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2"><HandCoins size={18} className="text-accent-400" /> Вывод средств</h2>
            <button onClick={() => setShowWithdraw(true)} className="btn-primary btn-sm"><Plus size={14} /> Запросить вывод</button>
          </div>
          {withdrawals?.length ? (
            <div className="space-y-2">{withdrawals.map((w: any) => (
              <div key={w.id} className="flex items-center justify-between py-2 border-b border-dark-600 last:border-0">
                <div><p className="text-sm">{formatKopeks(w.amount_kopeks)}</p><p className="text-xs text-dark-400">{formatDate(w.created_at)}</p></div>
                <StatusBadge status={w.status} />
              </div>
            ))}</div>
          ) : <p className="text-dark-400 text-sm">Нет заявок</p>}
        </div>
      </div>

      {referrals?.items?.length ? (
        <div className="card mt-6">
          <h2 className="text-lg font-semibold mb-4">Приглашённые пользователи</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-dark-400 border-b border-dark-600"><th className="text-left py-2">Пользователь</th><th className="text-left py-2">Дата</th><th className="text-right py-2">Заработано</th></tr></thead>
              <tbody>{referrals.items.map((ref: any) => (
                <tr key={ref.id} className="border-b border-dark-600/50"><td className="py-2">{ref.first_name} {ref.username && `@${ref.username}`}</td><td className="py-2 text-dark-400">{formatDate(ref.created_at)}</td><td className="py-2 text-right font-medium text-emerald-400">{formatKopeks(ref.earnings_kopeks)}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      ) : null}

      {showWithdraw && (
        <div className="modal-overlay" onClick={() => setShowWithdraw(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold">Запрос вывода</h2><button onClick={() => setShowWithdraw(false)} className="text-dark-400 hover:text-white"><X size={18} /></button></div>
            <div className="space-y-4">
              <div><label className="label">Сумма (₽)</label><input type="number" className="input" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} /></div>
              <div><label className="label">Реквизиты</label><textarea className="input" rows={3} value={requisites} onChange={e => setRequisites(e.target.value)} placeholder="Номер карты, кошелька и т.д." /></div>
              <button onClick={() => withdrawMut.mutate()} className="btn-primary w-full py-3" disabled={withdrawMut.isPending}>Отправить заявку</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
