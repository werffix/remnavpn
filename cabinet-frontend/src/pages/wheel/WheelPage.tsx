import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/api';
import { PageHeader, EmptyState } from '@/components/ui';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FerrisWheel, Sparkles, Trophy, History, RotateCcw } from 'lucide-react';

const prizeColors: Record<string, string> = {
  subscription_days: 'from-emerald-500 to-emerald-600',
  balance_bonus: 'from-yellow-500 to-yellow-600',
  traffic_gb: 'from-blue-500 to-blue-600',
  promocode: 'from-purple-500 to-purple-600',
  nothing: 'from-gray-500 to-gray-600',
};

const prizeIcons: Record<string, string> = {
  subscription_days: '📅', balance_bonus: '💰', traffic_gb: '📊', promocode: '🎫', nothing: '😔',
};

export default function WheelPage() {
  const { data: config } = useQuery({ queryKey: ['wheel-config'], queryFn: api.wheel.config });
  const { data: history, refetch: refetchH } = useQuery({ queryKey: ['wheel-history'], queryFn: api.wheel.history });
  const [spinning, setSpinning] = useState(false);
  const [lastPrize, setLastPrize] = useState<string | null>(null);

  const spin = useMutation({
    mutationFn: api.wheel.spin,
    onSuccess: (res) => {
      setLastPrize(`${prizeIcons[res.prize_type] || '🎁'} ${res.prize_type}: ${res.prize_value}`);
      refetchH();
      setTimeout(() => setLastPrize(null), 5000);
    },
    onError: (err: any) => toast.error(err.response?.data?.detail || 'Ошибка'),
    onSettled: () => setSpinning(false),
  });

  const handleSpin = () => {
    setSpinning(true);
    spin.mutate();
  };

  return (
    <div>
      <PageHeader title="Колесо фортуны" subtitle="Крутите колесо и выигрывайте призы" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card flex flex-col items-center">
          <div className="relative w-64 h-64 mb-6">
            <div className={`w-full h-full rounded-full bg-gradient-to-br from-accent-500 to-purple-600 flex items-center justify-center ${spinning ? 'animate-spin' : ''}`} style={{ animationDuration: '2s' }}>
              <div className="w-48 h-48 rounded-full bg-dark-800 flex flex-col items-center justify-center">
                <FerrisWheel size={48} className="text-accent-400 mb-2" />
                <span className="text-lg font-bold">Крути!</span>
              </div>
            </div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full shadow-lg" />
          </div>

          <button onClick={handleSpin} disabled={spinning} className="btn-primary btn-lg w-full max-w-xs">
            <RotateCcw size={18} className={spinning ? 'animate-spin' : ''} />
            {spinning ? 'Крутится...' : 'Крутить'}
          </button>

          {config && (
            <p className="text-sm text-dark-400 mt-3">
              Стоимость: {config.spin_cost_amount} {config.spin_cost_type === 'stars' ? '⭐' : 'дней подписки'}
              {config.daily_free_spins > 0 && ` (${config.daily_free_spins} бесплатно в день)`}
            </p>
          )}

          {lastPrize && (
            <div className="mt-4 px-4 py-2 bg-emerald-500/10 rounded-xl text-emerald-400 font-medium animate-bounce">
              {lastPrize}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Trophy size={18} className="text-accent-400" /> Призы</h2>
          <div className="space-y-2 mb-6">
            {config?.prizes?.filter(p => p.is_active).map(prize => (
              <div key={prize.id} className="card-hover flex items-center justify-between">
                <span className="text-sm">{prizeIcons[prize.type]} {prize.type}: {prize.value}</span>
                <span className="text-xs text-dark-400">{prize.weight}%</span>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><History size={18} className="text-accent-400" /> История</h3>
          {history?.length ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {history.slice(0, 10).map(h => (
                <div key={h.id} className="flex items-center justify-between text-sm py-2 border-b border-dark-600">
                  <span>{prizeIcons[h.prize_type]} {h.prize_type}: {h.prize_value}</span>
                  <span className="text-dark-400 text-xs">{new Date(h.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-dark-400 text-sm">Нет истории</p>}
        </div>
      </div>
    </div>
  );
}
