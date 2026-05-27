import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/ui';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Search, ChevronDown, Ban, CheckCircle, Eye } from 'lucide-react';
import api from '@/api/client';
import type { User } from '@/types';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [balanceChange, setBalanceChange] = useState('');
  const qc = useQueryClient();

  const { data: users } = useQuery({
    queryKey: ['admin-users', search],
    queryFn: () => api.get('/admin/users', { params: { search: search || undefined, size: 50 } }).then(r => r.data),
  });

  const banUser = useMutation({
    mutationFn: (id: number) => api.post(`/admin/users/${id}/ban`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('Пользователь заблокирован'); },
    onError: (err: any) => toast.error(err.response?.data?.detail || 'Ошибка'),
  });

  const balanceMut = useMutation({
    mutationFn: () => api.post(`/admin/users/${selectedUser?.id}/balance`, { amount_kopeks: parseInt(balanceChange) * 100 }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('Баланс изменён'); setSelectedUser(null); },
    onError: (err: any) => toast.error(err.response?.data?.detail || 'Ошибка'),
  });

  return (
    <div>
      <PageHeader title="Пользователи" />
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" size={16} />
        <input className="input pl-10" value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по имени, email, Telegram ID..." />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-dark-400 border-b border-dark-600">
            <th className="text-left py-3 px-2">ID</th>
            <th className="text-left py-3 px-2">Имя</th>
            <th className="text-left py-3 px-2">Email</th>
            <th className="text-left py-3 px-2">Telegram</th>
            <th className="text-right py-3 px-2">Баланс</th>
            <th className="text-center py-3 px-2">Статус</th>
            <th className="text-right py-3 px-2">Действия</th>
          </tr></thead>
          <tbody>
            {(users?.items || users || []).map((u: User) => (
              <tr key={u.id} className="border-b border-dark-600/50 hover:bg-dark-800/50">
                <td className="py-3 px-2 font-mono text-xs">{u.id}</td>
                <td className="py-3 px-2 font-medium">{u.first_name} {u.last_name}</td>
                <td className="py-3 px-2 text-dark-400">{u.email || '—'}</td>
                <td className="py-3 px-2 text-dark-400">{u.username ? `@${u.username}` : '—'}</td>
                <td className="py-3 px-2 text-right font-medium">{(u.balance_kopeks / 100).toFixed(2)} ₽</td>
                <td className="py-3 px-2 text-center">
                  <span className={`badge ${u.status === 'ACTIVE' ? 'badge-green' : u.status === 'BLOCKED' ? 'badge-red' : 'badge-gray'}`}>{u.status}</span>
                </td>
                <td className="py-3 px-2 text-right">
                  <button onClick={() => setSelectedUser(u)} className="btn-ghost btn-sm"><Eye size={14} /></button>
                  {u.status === 'ACTIVE' ? (
                    <button onClick={() => banUser.mutate(u.id)} className="btn-ghost btn-sm text-red-400"><Ban size={14} /></button>
                  ) : (
                    <button onClick={() => api.post(`/admin/users/${u.id}/unban`).then(() => { qc.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('Разблокирован'); })} className="btn-ghost btn-sm text-emerald-400"><CheckCircle size={14} /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Пользователь #{selectedUser.id}</h2>
              <button onClick={() => setSelectedUser(null)} className="text-dark-400 hover:text-white">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-dark-800 rounded-xl p-3"><p className="text-xs text-dark-400">Имя</p><p className="font-medium">{selectedUser.first_name} {selectedUser.last_name}</p></div>
              <div className="bg-dark-800 rounded-xl p-3"><p className="text-xs text-dark-400">Username</p><p className="font-medium">@{selectedUser.username || '—'}</p></div>
              <div className="bg-dark-800 rounded-xl p-3"><p className="text-xs text-dark-400">Email</p><p className="font-medium">{selectedUser.email || '—'}</p></div>
              <div className="bg-dark-800 rounded-xl p-3"><p className="text-xs text-dark-400">Telegram ID</p><p className="font-medium">{selectedUser.telegram_id || '—'}</p></div>
              <div className="bg-dark-800 rounded-xl p-3"><p className="text-xs text-dark-400">Баланс</p><p className="font-medium text-emerald-400">{(selectedUser.balance_kopeks / 100).toFixed(2)} ₽</p></div>
              <div className="bg-dark-800 rounded-xl p-3"><p className="text-xs text-dark-400">Реф. код</p><p className="font-mono text-xs">{selectedUser.referral_code}</p></div>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium">Изменить баланс</p>
              <div className="flex gap-2">
                <input type="number" className="input" value={balanceChange} onChange={e => setBalanceChange(e.target.value)} placeholder="Сумма в ₽" />
                <button onClick={() => balanceMut.mutate()} className="btn-primary" disabled={!balanceChange}>Применить</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
