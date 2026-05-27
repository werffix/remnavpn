import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/ui';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Save, Trash2 } from 'lucide-react';
import api from '@/api/client';

export default function AdminTariffsPage() {
  const qc = useQueryClient();
  const { data: tariffs } = useQuery({ queryKey: ['admin-tariffs'], queryFn: () => api.get('/admin/tariffs').then(r => r.data) });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', traffic_limit_gb: 100, device_limit: 3, period_prices: { '30': 100000, '90': 250000, '180': 450000 }, tier_level: 1, sort_order: 0 });

  const createMut = useMutation({
    mutationFn: () => api.post('/admin/tariffs', form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-tariffs'] }); setShowForm(false); toast.success('Тариф создан'); },
    onError: (err: any) => toast.error(err.response?.data?.detail || 'Ошибка'),
  });

  return (
    <div>
      <PageHeader title="Тарифы" subtitle="Управление тарифными планами" />
      <button onClick={() => setShowForm(true)} className="btn-primary mb-4"><Plus size={16} /> Создать тариф</button>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Новый тариф</h2>
            <div className="space-y-3">
              <div><label className="label">Название</label><input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div><label className="label">Описание</label><textarea className="input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Трафик (ГБ)</label><input type="number" className="input" value={form.traffic_limit_gb} onChange={e => setForm(f => ({ ...f, traffic_limit_gb: parseInt(e.target.value) }))} /></div>
                <div><label className="label">Устройства</label><input type="number" className="input" value={form.device_limit} onChange={e => setForm(f => ({ ...f, device_limit: parseInt(e.target.value) }))} /></div>
              </div>
              <div><label className="label">Цены за периоды (в копейках)</label>
                {Object.entries(form.period_prices).map(([days, price]) => (
                  <div key={days} className="flex items-center gap-2 mt-1">
                    <span className="text-sm w-8">{days}д:</span>
                    <input type="number" className="input flex-1" value={price} onChange={e => setForm(f => ({ ...f, period_prices: { ...f.period_prices, [days]: parseInt(e.target.value) } }))} />
                  </div>
                ))}
              </div>
              <button onClick={() => createMut.mutate()} className="btn-primary w-full"><Save size={16} /> Сохранить</button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <table className="w-full text-sm">
          <thead><tr className="text-dark-400 border-b border-dark-600">
            <th className="text-left py-3 px-2">Название</th>
            <th className="text-right py-3 px-2">Трафик</th>
            <th className="text-right py-3 px-2">Устр.</th>
            <th className="text-right py-3 px-2">30 дн.</th>
            <th className="text-right py-3 px-2">90 дн.</th>
            <th className="text-right py-3 px-2">180 дн.</th>
            <th className="text-center py-3 px-2">Активен</th>
          </tr></thead>
          <tbody>
            {(tariffs?.items || tariffs || []).map((t: any) => (
              <tr key={t.id} className="border-b border-dark-600/50 hover:bg-dark-800/50">
                <td className="py-3 px-2 font-medium">{t.name}</td>
                <td className="py-3 px-2 text-right">{t.traffic_limit_gb || '∞'} ГБ</td>
                <td className="py-3 px-2 text-right">{t.device_limit}</td>
                <td className="py-3 px-2 text-right">{(t.period_prices?.['30'] || 0) / 100} ₽</td>
                <td className="py-3 px-2 text-right">{(t.period_prices?.['90'] || 0) / 100} ₽</td>
                <td className="py-3 px-2 text-right">{(t.period_prices?.['180'] || 0) / 100} ₽</td>
                <td className="py-3 px-2 text-center">
                  <span className={t.is_active ? 'badge-green' : 'badge-gray'}>{t.is_active ? 'Да' : 'Нет'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
