import { useEffect, useState } from 'react'
import { adminStatsApi } from '@/api/admin'
import { formatKopeks } from '@/lib/utils'
import { Users, Zap, CreditCard, TrendingUp } from 'lucide-react'

export default function StatsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminStatsApi.dashboard().then((r) => {
      setStats(r.data)
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="text-center py-12 text-gray-400">Загрузка...</div>
  if (!stats) return <div className="text-center py-12 text-gray-400">Нет данных</div>

  const cards = [
    { label: 'Пользователей', value: stats.total_users || 0, icon: Users, color: 'text-blue-400' },
    { label: 'Активных подписок', value: stats.active_subscriptions || 0, icon: Zap, color: 'text-green-400' },
    { label: 'Доход за месяц', value: formatKopeks(stats.monthly_revenue_kopeks || 0), icon: CreditCard, color: 'text-brand-400' },
    { label: 'Конверсия', value: `${stats.conversion_rate || 0}%`, icon: TrendingUp, color: 'text-purple-400' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Статистика</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <c.icon className={`w-5 h-5 ${c.color}`} />
              <span className="text-sm text-gray-400">{c.label}</span>
            </div>
            <p className="text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Recent activity placeholder */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Последние активности</h2>
        <p className="text-gray-400 text-sm">Раздел в разработке — скоро здесь будут графики и подробная аналитика.</p>
      </div>
    </div>
  )
}
