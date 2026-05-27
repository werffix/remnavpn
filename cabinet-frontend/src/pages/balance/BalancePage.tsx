import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/api';
import { PageHeader, EmptyState } from '@/components/ui';
import { formatKopeks, formatDateTime } from '@/utils/format';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Wallet, ArrowDownToLine, CreditCard, History, ExternalLink } from 'lucide-react';

export default function BalancePage() {
  const { data: balance } = useQuery({ queryKey: ['balance'], queryFn: api.balance.get });
  const { data: methods } = useQuery({ queryKey: ['payment-methods'], queryFn: api.balance.paymentMethods });
  const { data: transactions, refetch: refetchTx } = useQuery({ queryKey: ['transactions'], queryFn: () => api.balance.transactions({ size: 20 }) });
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');

  const topup = useMutation({
    mutationFn: () => api.balance.topup({ method: selectedMethod, amount_kopeks: parseInt(amount) * 100 }),
    onSuccess: (res: any) => {
      toast.success('Счёт создан');
      if (res.payment_url) window.open(res.payment_url, '_blank');
      refetchTx();
    },
    onError: (err: any) => toast.error(err.response?.data?.detail || 'Ошибка'),
  });

  const quickAmounts = [5000, 10000, 25000, 50000, 100000, 250000];

  return (
    <div>
      <PageHeader title="Баланс" subtitle="Пополнение и история операций" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center"><Wallet className="text-emerald-400" size={28} /></div>
            <div>
              <p className="text-sm text-dark-400">Текущий баланс</p>
              <p className="text-3xl font-bold">{formatKopeks(balance?.balance_kopeks || 0)}</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="label">Сумма пополнения (₽)</label>
            <input type="number" className="input text-lg" value={amount} onChange={e => setAmount(e.target.value)} placeholder="1000" min="1" />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {quickAmounts.map(a => (
              <button key={a} onClick={() => setAmount(String(a / 100))} className="btn-sm border border-dark-500 text-dark-300 hover:border-accent-500 hover:text-accent-400">
                {formatKopeks(a)}
              </button>
            ))}
          </div>

          {methods && methods.length > 0 && (
            <div className="mb-4">
              <label className="label">Способ оплаты</label>
              <div className="grid grid-cols-2 gap-2">
                {methods.filter(m => m.enabled).map(m => (
                  <button key={m.id} onClick={() => setSelectedMethod(m.id)}
                    className={`btn border ${selectedMethod === m.id ? 'border-accent-500 bg-accent-500/10 text-accent-400' : 'border-dark-500 text-dark-300'}`}>
                    <CreditCard size={14} /> {m.display_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => topup.mutate()} className="btn-primary w-full py-3" disabled={!amount || !selectedMethod || topup.isPending}>
            {topup.isPending ? 'Создание счёта...' : 'Пополнить'}
          </button>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2"><History size={18} className="text-accent-400" /> История операций</h2>
          </div>
          {transactions?.items?.length ? (
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {transactions.items.map(tx => (
                <div key={tx.id} className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-dark-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.amount_kopeks > 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                      <ArrowDownToLine size={14} className={tx.amount_kopeks > 0 ? 'text-emerald-400' : 'text-red-400'} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tx.description || tx.type}</p>
                      <p className="text-xs text-dark-500">{formatDateTime(tx.created_at)}</p>
                    </div>
                  </div>
                  <span className={`font-medium text-sm ${tx.amount_kopeks > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
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
