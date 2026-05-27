import { PageHeader } from '@/components/ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatKopeks, formatDateTime } from '@/utils/format';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Search } from 'lucide-react';
import api from '@/api/client';

export default function AdminWithdrawalsPage() {
  const qc = useQueryClient();
  const { data: withdrawals } = useQuery({ queryKey: ['admin-withdrawals'], queryFn: () => api.get('/admin/withdrawals', { params: { size: 50 } }).then(r => r.data) });

  const approve = useMutation({
    mutationFn: (id: number) => api.post(`/admin/withdrawals/${id}/approve`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-withdrawals'] }); toast.success('Вывод одобрен'); },
    onError: (err: any) => toast.error(err.response?.data?.detail || 'Ошибка'),
  });

  const reject = useMutation({
    mutationFn: (id: number) => api.post(`/admin/withdrawals/${id}/reject`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-withdrawals'] }); toast.success('Вывод отклонён'); },
  });

  return (
    <div>
      <PageHeader title="Заявки на вывод" subtitle="Управление выводами реферального баланса" />
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-dark-400 border-b border-dark-600">
            <th className="text-left py-3 px-2">ID</th>
            <th className="text-left py-3 px-2">Пользователь</th>
            <th className="text-right py-3 px-2">Сумма</th>
            <th className="text-left py-3 px-2">Реквизиты</th>
            <th className="text-left py-3 px-2">Дата</th>
            <th className="text-center py-3 px-2">Статус</th>
            <th className="text-right py-3 px-2">Действия</th>
          </tr></thead>
          <tbody>
            {(withdrawals?.items || withdrawals || []).map((w: any) => (
              <tr key={w.id} className="border-b border-dark-600/50 hover:bg-dark-800/50">
                <td className="py-3 px-2 font-mono text-xs">{w.id}</td>
                <td className="py-3 px-2">{w.user?.first_name || w.user_id}</td>
                <td className="py-3 px-2 text-right font-medium">{formatKopeks(w.amount_kopeks)}</td>
                <td className="py-3 px-2 text-xs text-dark-400 max-w-xs truncate">{w.requisites}</td>
                <td className="py-3 px-2 text-xs text-dark-400">{formatDateTime(w.created_at)}</td>
                <td className="py-3 px-2 text-center">
                  <span className={`badge ${w.status === 'PENDING' ? 'badge-yellow' : w.status === 'APPROVED' ? 'badge-green' : 'badge-red'}`}>{w.status}</span>
                </td>
                <td className="py-3 px-2 text-right">
                  {w.status === 'PENDING' && (
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => approve.mutate(w.id)} className="btn-success btn-sm"><CheckCircle size={14} /></button>
                      <button onClick={() => reject.mutate(w.id)} className="btn-danger btn-sm"><XCircle size={14} /></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
