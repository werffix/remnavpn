import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { subscriptionApi } from '@/api/subscription'
import { formatKopeks } from '@/lib/utils'
import { Zap, Check, ArrowLeft } from 'lucide-react'

interface Tariff {
  id: number
  name: string
  traffic_limit_gb: number
  device_limit: number
  prices: Record<string, number>
}

export default function PurchasePage() {
  const [tariffs, setTariffs] = useState<Tariff[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    subscriptionApi.purchaseOptions().then((r) => {
      setTariffs(r.data?.tariffs || r.data || [])
      setLoading(false)
    })
  }, [])

  const handlePurchase = async () => {
    if (!selected) return
    setPurchasing(true)
    try {
      await subscriptionApi.purchaseTariff(selected)
      navigate('/subscription')
    } catch {
      alert('Ошибка покупки. Проверьте баланс.')
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) return <div className="text-center py-12 text-gray-400">Загрузка тарифов...</div>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Выберите тариф</h1>
      </div>

      <div className="space-y-3">
        {tariffs.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelected(t.id)}
            className={`w-full text-left bg-gray-900 border rounded-xl p-5 transition-all ${
              selected === t.id
                ? 'border-brand-500 ring-1 ring-brand-500/50'
                : 'border-gray-800 hover:border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-brand-400" />
                  <h3 className="font-semibold text-lg">{t.name}</h3>
                </div>
                <div className="mt-2 flex gap-4 text-sm text-gray-400">
                  <span>🌐 {t.traffic_limit_gb > 0 ? `${t.traffic_limit_gb} ГБ` : 'Безлимит'}</span>
                  <span>📱 {t.device_limit} устр.</span>
                </div>
              </div>
              <div className="text-right">
                {t.prices && Object.entries(t.prices).map(([days, price]) => (
                  <div key={days} className="text-sm">
                    <span className="text-gray-400">{days}д:</span>{' '}
                    <span className="font-semibold">{formatKopeks(price)}</span>
                  </div>
                ))}
              </div>
              {selected === t.id && (
                <Check className="w-5 h-5 text-brand-400 ml-3" />
              )}
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <button
          onClick={handlePurchase}
          disabled={purchasing}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {purchasing ? 'Покупка...' : 'Купить подписку'}
        </button>
      )}
    </div>
  )
}
