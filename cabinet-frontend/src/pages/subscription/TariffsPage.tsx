import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/api';
import { PageHeader } from '@/components/ui';
import { formatKopeks } from '@/utils/format';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Check, Zap, Globe, Monitor, Calendar } from 'lucide-react';

export default function TariffsPage() {
  const { data: tariffs, isLoading } = useQuery({ queryKey: ['tariffs'], queryFn: api.subscription.tariffs });
  const { data: servers } = useQuery({ queryKey: ['servers'], queryFn: api.subscription.servers });
  const [selectedTariff, setSelectedTariff] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30');
  const [selectedServers, setSelectedServers] = useState<string[]>([]);
  const navigate = useNavigate();

  const preview = useMutation({
    mutationFn: (data: { tariff_id: number; period_days: number }) => api.subscription.preview(data),
  });

  const purchase = useMutation({
    mutationFn: (data: { tariff_id: number; period_days: number; servers?: string[]; payment_method: string }) => api.subscription.purchase(data),
    onSuccess: (res) => { toast.success('Подписка оформлена!'); navigate('/subscription'); },
    onError: (err: any) => toast.error(err.response?.data?.detail || 'Ошибка'),
  });

  const handleTariffSelect = (id: number) => {
    setSelectedTariff(id);
    preview.mutate({ tariff_id: id, period_days: parseInt(selectedPeriod) });
  };

  return (
    <div>
      <PageHeader title="Тарифы" subtitle="Выберите подходящий тарифный план" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {(tariffs || []).filter(t => t.is_active).sort((a, b) => a.sort_order - b.sort_order).map(tariff => {
          const periods = Object.entries(tariff.period_prices).sort(([a], [b]) => parseInt(a) - parseInt(b));
          const isSelected = selectedTariff === tariff.id;
          return (
            <div key={tariff.id} className={`card cursor-pointer transition-all ${isSelected ? 'border-accent-500 ring-1 ring-accent-500' : 'hover:border-dark-500'}`}
              onClick={() => handleTariffSelect(tariff.id)}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold">{tariff.name}</h3>
                {isSelected && <div className="w-6 h-6 rounded-full bg-accent-500 flex items-center justify-center"><Check size={14} /></div>}
              </div>
              <p className="text-sm text-dark-400 mb-4">{tariff.description}</p>
              <div className="flex items-center gap-2 text-sm text-dark-300 mb-4">
                <span className="flex items-center gap-1"><Zap size={14} /> {tariff.traffic_limit_gb || '∞'} ГБ</span>
                <span className="flex items-center gap-1"><Monitor size={14} /> {tariff.device_limit} устр.</span>
              </div>
              {selectedTariff === tariff.id && (
                <div className="space-y-3 mt-4 pt-4 border-t border-dark-600">
                  <p className="text-sm font-medium text-dark-200">Выберите период</p>
                  <div className="grid grid-cols-2 gap-2">
                    {periods.map(([days, price]) => (
                      <button key={days} onClick={(e) => { e.stopPropagation(); setSelectedPeriod(days); preview.mutate({ tariff_id: tariff.id, period_days: parseInt(days) }); }}
                        className={`btn border ${selectedPeriod === days ? 'border-accent-500 bg-accent-500/10 text-accent-400' : 'border-dark-500 text-dark-200'} btn-sm`}>
                        <Calendar size={14} /> {days} дн.<br /><span className="font-bold">{formatKopeks(price)}</span>
                      </button>
                    ))}
                  </div>

                  {servers && servers.length > 0 && (
                    <>
                      <p className="text-sm font-medium text-dark-200 mt-3">Серверы</p>
                      <div className="flex flex-wrap gap-2">
                        {servers.map(s => (
                          <button key={s.uuid} onClick={(e) => { e.stopPropagation(); setSelectedServers(prev => prev.includes(s.uuid) ? prev.filter(x => x !== s.uuid) : [...prev, s.uuid]); }}
                            className={`btn-sm border ${selectedServers.includes(s.uuid) ? 'border-accent-500 bg-accent-500/10 text-accent-400' : 'border-dark-500 text-dark-300'}`}>
                            <Globe size={12} /> {s.name}
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {preview.data && (
                    <div className="bg-dark-800 rounded-xl p-3 mt-3">
                      <div className="flex justify-between text-sm"><span>Тариф</span><span>{tariff.name}</span></div>
                      <div className="flex justify-between text-sm mt-1"><span>Период</span><span>{selectedPeriod} дн.</span></div>
                      <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-dark-600">
                        <span>Итого</span><span className="text-accent-400">{formatKopeks(preview.data.total_price_kopeks || preview.data.price_kopeks || 0)}</span>
                      </div>
                    </div>
                  )}

                  <button onClick={(e) => { e.stopPropagation(); purchase.mutate({ tariff_id: tariff.id, period_days: parseInt(selectedPeriod), servers: selectedServers.length ? selectedServers : undefined, payment_method: 'balance' }); }}
                    className="btn-primary w-full" disabled={purchase.isPending}>
                    {purchase.isPending ? 'Оформление...' : 'Купить'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
