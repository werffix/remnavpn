import { useEffect, useState } from 'react'
import { adminPaymentsApi } from '@/api/admin'
import { formatKopeks, formatDateTime } from '@/lib/utils'
import { Search } from 'lucide-react'

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminPaymentsApi.list({ limit: 50 }).then((r) => {
      setPayments(r.data?.items || r.data || [])
      setLoading(false)
    })
  }, [])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Платежи</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-left">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Пользователь</th>
                <th className="px-4 py-3">Сумма</th>
                <th className="px-4 py-3">Метод</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3">Дата</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Загрузка...</td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Нет платежей</td></tr>
              ) : (
                payments.map((p: any) => (
                  <tr key={p.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{String(p.id).slice(0, 8)}...</td>
                    <td className="px-4 py-3">{p.user_full_name || p.user_id || '—'}</td>
                    <td className="px-4 py-3 font-medium">{formatKopeks(p.amount_kopeks || 0)}</td>
                    <td className="px-4 py-3 text-gray-400">{p.method || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        p.status === 'completed' || p.status === 'succeeded'
                          ? 'bg-green-900/50 text-green-400'
                          : p.status === 'pending'
                          ? 'bg-yellow-900/50 text-yellow-400'
                          : 'bg-red-900/50 text-red-400'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{p.created_at ? formatDateTime(p.created_at) : '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
