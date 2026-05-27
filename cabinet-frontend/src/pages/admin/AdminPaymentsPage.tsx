import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader, StatusBadge } from '@/components/ui';
import { formatKopeks, formatDateTime } from '@/utils/format';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle } from 'lucide-react';
import api from '@/api/client';

export default function AdminPaymentsPage() {
  const qc = useQueryClient();
  const { data: payments } = useQuery({ queryKey: ['admin-payments'], queryFn: () => api.get('/admin/payments', { params: { size: 50 } }).then(r => r.data) });

  const verify = useMutation({
    mutationFn: (id: number) => api.post(`/admin/payments/${id}/verify`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-payments'] }); toast.success('Платёж подтверждён'); },
    onError: (err: any) => toast.error(err.response?.data?.detail || 'Ошибка'),
  });

  return (
    <div>
      <PageHeader title="Платежи" subtitle="Управление платежами" />
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-dark-400 border-b border-dark-600">
            <th className="text-left py-3 px-2">ID</th>
            <th className="text-left py-3 px-2">Пользователь</th>
            <th className="text-left py-3 px-2">Метод</th>
            <th className="text-right py-3 px-2">Сумма</th>
            <th className="text-center py-3 px-2">Статус</th>
            <th className="text-left py-3 px-2">Дата</th>
            <th className="text-right py-3 px-2">Действия</th>
          </tr></thead>
          <tbody>
            {(payments?.items || payments || []).map((p: any) => (
              <tr key={p.id} className="border-b border-dark-600/50 hover:bg-dark-800/50">
                <td className="py-3 px-2 font-mono text-xs">{p.id}</td>
                <td className="py-3 px-2">{p.user?.first_name || p.user_id}</td>
                <td className="py-3 px-2 text-dark-400">{p.payment_method}</td>
                <td className="py-3 px-2 text-right font-medium">{formatKopeks(p.amount_kopeks)}</td>
                <td className="py-3 px-2 text-center"><StatusBadge status={p.status} /></td>
                <td className="py-3 px-2 text-dark-400 text-xs">{formatDateTime(p.created_at)}</td>
                <td className="py-3 px-2 text-right">
                  {p.status === 'PENDING' && (
                    <button onClick={() => verify.mutate(p.id)} className="btn-success btn-sm"><CheckCircle size={14} /> Подтвердить</button>
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
