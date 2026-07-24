import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { balanceApi } from '@/api/balance'
import { formatKopeks } from '@/lib/utils'
import { ArrowLeft, CreditCard, Check } from 'lucide-react'

export default function TopupPage() {
  const [methods, setMethods] = useState<any[]>([])
  const [amount, setAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const presets = [100, 300, 500, 1000, 2000, 5000]

  useEffect(() => {
    balanceApi.paymentMethods().then((r) => {
      setMethods(r.data || [])
      setLoading(false)
    })
  }, [])

  const handleTopup = async () => {
    if (!amount || !selectedMethod) return
    setSubmitting(true)
    try {
      const { data } = await balanceApi.topup(Math.round(parseFloat(amount) * 100), selectedMethod)
      if (data?.payment_url) {
        window.open(data.payment_url, '_blank')
      }
      navigate('/balance')
    } catch {
      alert('Ошибка создания платежа')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="text-center py-12 text-gray-400">Загрузка...</div>

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Пополнение баланса</h1>
      </div>

      {/* Amount */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <label className="block text-sm text-gray-400">Сумма (₽)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Введите сумму"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-xl font-bold text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => setAmount(String(p))}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                amount === String(p)
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {p} ₽
            </button>
          ))}
        </div>
      </div>

      {/* Payment method */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
        <label className="block text-sm text-gray-400">Способ оплаты</label>
        {methods.map((m: any) => (
          <button
            key={m.id || m.name}
            onClick={() => setSelectedMethod(m.id || m.name)}
            className={`w-full flex items-center justify-between bg-gray-800 border rounded-lg px-4 py-3 text-sm transition-all ${
              selectedMethod === (m.id || m.name)
                ? 'border-brand-500 ring-1 ring-brand-500/50'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <span>{m.display_name || m.name}</span>
            {selectedMethod === (m.id || m.name) && <Check className="w-4 h-4 text-brand-400" />}
          </button>
        ))}
      </div>

      {amount && selectedMethod && (
        <button
          onClick={handleTopup}
          disabled={submitting}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {submitting ? 'Создание платежа...' : `Пополнить на ${amount} ₽`}
        </button>
      )}
    </div>
  )
}
