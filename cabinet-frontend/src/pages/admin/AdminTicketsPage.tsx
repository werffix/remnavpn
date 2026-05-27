import { useQuery } from '@tanstack/react-query';
import { PageHeader, StatusBadge } from '@/components/ui';
import { formatDateTime } from '@/utils/format';
import api from '@/api/client';

export default function AdminTicketsPage() {
  const { data: tickets } = useQuery({ queryKey: ['admin-tickets'], queryFn: () => api.get('/admin/tickets').then(r => r.data) });

  return (
    <div>
      <PageHeader title="Тикеты" subtitle="Поддержка пользователей" />
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-dark-400 border-b border-dark-600">
            <th className="text-left py-3 px-2">ID</th>
            <th className="text-left py-3 px-2">Пользователь</th>
            <th className="text-left py-3 px-2">Тема</th>
            <th className="text-center py-3 px-2">Статус</th>
            <th className="text-left py-3 px-2">Дата</th>
          </tr></thead>
          <tbody>
            {(tickets?.items || tickets || []).map((t: any) => (
              <tr key={t.id} className="border-b border-dark-600/50 hover:bg-dark-800/50">
                <td className="py-3 px-2 font-mono text-xs">{t.id}</td>
                <td className="py-3 px-2">{t.user?.first_name || t.user_id}</td>
                <td className="py-3 px-2 font-medium">{t.title}</td>
                <td className="py-3 px-2 text-center"><StatusBadge status={t.status} /></td>
                <td className="py-3 px-2 text-dark-400 text-xs">{formatDateTime(t.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
