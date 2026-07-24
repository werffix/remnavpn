import { useEffect, useState } from 'react'
import { adminTariffsApi } from '@/api/admin'
import { formatKopeks } from '@/lib/utils'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function TariffsPage() {
  const [tariffs, setTariffs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminTariffsApi.list().then((r) => {
      setTariffs(r.data || [])
      setLoading(false)
    })
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить тариф?')) return
    await adminTariffsApi.delete(id)
    setTariffs((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Тарифы</h1>
        <button className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Создать
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-400 text-sm text-center">Загрузка...</p>
        ) : tariffs.length === 0 ? (
          <p className="p-6 text-gray-400 text-sm text-center">Нет тарифов</p>
        ) : (
          <div className="divide-y divide-gray-800">
            {tariffs.map((t: any) => (
              <div key={t.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-800/50">
                <div>
                  <h3 className="font-medium">{t.name}</h3>
                  <div className="flex gap-4 text-sm text-gray-400 mt-1">
                    <span>🌐 {t.traffic_limit_gb > 0 ? `${t.traffic_limit_gb} ГБ` : 'Безлимит'}</span>
                    <span>📱 {t.device_limit} устр.</span>
                    {t.is_daily && <span>🔄 Суточный</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right text-sm">
                    {t.prices && Object.entries(t.prices).slice(0, 3).map(([days, price]) => (
                      <div key={days} className="text-gray-400">{days}д: <span className="text-gray-200">{formatKopeks(price as number)}</span></div>
                    ))}
                  </div>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="text-gray-400 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
