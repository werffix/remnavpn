import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { balanceApi } from '@/api/balance'
import { useAuthStore } from '@/store/auth'
import { formatKopeks, formatDateTime } from '@/lib/utils'
import { CreditCard, ArrowRight, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function BalancePage() {
  const { user, fetchUser } = useAuthStore()
  const [transactions, setTransactions] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    balanceApi.transactions({ page: 1, limit: 20 }).then((r) => {
      setTransactions(r.data?.items || r.data || [])
      setHasMore((r.data?.items || r.data || []).length >= 20)
      setLoading(false)
    })
  }, [])

  const loadMore = async () => {
    const nextPage = page + 1
    const { data } = await balanceApi.transactions({ page: nextPage, limit: 20 })
    const items = data?.items || data || []
    setTransactions((prev) => [...prev, ...items])
    setPage(nextPage)
    if (items.length < 20) setHasMore(false)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Баланс</h1>

      {/* Balance card */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Текущий баланс</p>
            <p className="text-3xl font-bold text-brand-400">{formatKopeks(user?.balance_kopeks || 0)}</p>
          </div>
          <Link
            to="/balance/topup"
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            Пополнить
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">История операций</h2>
        {loading ? (
          <p className="text-gray-400 text-sm">Загрузка...</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-400 text-sm">Нет операций</p>
        ) : (
          <div className="space-y-2">
            {transactions.map((t: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <div className="flex items-center gap-3">
                  {t.type === 'income' || t.amount_kopeks > 0 ? (
                    <ArrowDownRight className="w-4 h-4 text-green-400" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-red-400" />
                  )}
                  <div>
                    <p className="text-sm">{t.description || t.type}</p>
                    <p className="text-xs text-gray-500">{t.created_at ? formatDateTime(t.created_at) : ''}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${t.amount_kopeks > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {t.amount_kopeks > 0 ? '+' : ''}{formatKopeks(t.amount_kopeks)}
                </span>
              </div>
            ))}
          </div>
        )}
        {hasMore && !loading && (
          <button onClick={loadMore} className="w-full mt-4 text-sm text-brand-400 hover:text-brand-300 transition-colors">
            Показать ещё
          </button>
        )}
      </div>
    </div>
  )
}
