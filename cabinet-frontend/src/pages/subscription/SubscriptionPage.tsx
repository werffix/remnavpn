import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api';
import { ProgressBar, PageHeader, StatusBadge, EmptyState } from '@/components/ui';
import { formatKopeks, formatBytes, daysLeft, progressPercent, formatDate } from '@/utils/format';
import { Link } from 'react-router-dom';
import { Zap, RefreshCw, AlertTriangle, Settings, RotateCcw, Trash2, Clock, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function SubscriptionPage() {
  const { data: subs, isLoading } = useQuery({ queryKey: ['subscriptions'], queryFn: api.subscription.get });
  const qc = useQueryClient();

  const toggleAutopay = useMutation({
    mutationFn: (data: { id: number; enable: boolean }) => data.enable ? api.subscription.autopayEnable(data.id) : api.subscription.autopayDisable(data.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['subscriptions'] }); toast.success('Автопродление обновлено'); },
    onError: (err: any) => toast.error(err.response?.data?.detail || 'Ошибка'),
  });

  const revoke = useMutation({
    mutationFn: (id: number) => api.subscription.revoke(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['subscriptions'] }); toast.success('Ключ отозван'); },
    onError: (err: any) => toast.error(err.response?.data?.detail || 'Ошибка'),
  });

  if (isLoading) return <div className="space-y-4">{Array.from({length:3}).map((_,i) => <div key={i} className="card"><div className="skeleton h-6 w-48 mb-4" /><div className="skeleton h-4 w-full mb-2" /><div className="skeleton h-4 w-3/4" /></div>)}</div>;

  return (
    <div>
      <PageHeader title="Мои подписки" subtitle="Управление подписками VPN" />
      {!subs?.length ? (
        <EmptyState title="Нет активных подписок" description="Приобретите тариф, чтобы пользоваться VPN" />
      ) : (
        <div className="space-y-4">
          {subs.map(sub => {
            const days = daysLeft(sub.end_date);
            const expired = new Date(sub.end_date).getTime() < Date.now();
            const trafficPct = progressPercent(sub.traffic_used_bytes, sub.traffic_limit_bytes);
            return (
              <div key={sub.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold">{sub.tariff?.name || 'Подписка'}</h3>
                      <StatusBadge status={sub.status} />
                    </div>
                    <p className="text-sm text-dark-400">UUID: <span className="font-mono text-xs">{sub.remnawave_uuid}</span></p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${expired ? 'text-red-400' : days < 3 ? 'text-yellow-400' : 'text-emerald-400'}`}>{days} дн.</p>
                    <p className="text-xs text-dark-400">до {formatDate(sub.end_date)}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-dark-400">Трафик</span>
                    <span>{formatBytes(sub.traffic_used_bytes)} / {formatBytes(sub.traffic_limit_bytes)}</span>
                  </div>
                  <ProgressBar value={sub.traffic_used_bytes} max={sub.traffic_limit_bytes} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="bg-dark-800 rounded-xl p-3 text-center">
                    <p className="text-xs text-dark-400">Устройства</p>
                    <p className="text-lg font-bold">{sub.device_count}/{sub.device_limit}</p>
                  </div>
                  <div className="bg-dark-800 rounded-xl p-3 text-center">
                    <p className="text-xs text-dark-400">Автопродление</p>
                    {sub.autopay_enabled ? <CheckCircle2 className="mx-auto text-emerald-400" size={20} /> : <XCircle className="mx-auto text-dark-400" size={20} />}
                  </div>
                  <div className="bg-dark-800 rounded-xl p-3 text-center">
                    <p className="text-xs text-dark-400">Статус</p>
                    <StatusBadge status={sub.status} />
                  </div>
                  <div className="bg-dark-800 rounded-xl p-3 text-center">
                    <p className="text-xs text-dark-400">Тариф</p>
                    <p className="text-sm font-medium">{sub.tariff?.name || '—'}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {!expired && <Link to={`/subscription/renew/${sub.id}`} className="btn-primary btn-sm"><RefreshCw size={14} /> Продлить</Link>}
                  <button onClick={() => toggleAutopay.mutate({ id: sub.id, enable: !sub.autopay_enabled })} className="btn-secondary btn-sm">
                    <Settings size={14} /> {sub.autopay_enabled ? 'Выкл автопродление' : 'Вкл автопродление'}
                  </button>
                  <button onClick={() => { if (confirm('Отозвать ключ?')) revoke.mutate(sub.id); }} className="btn-danger btn-sm"><Trash2 size={14} /> Отозвать</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
