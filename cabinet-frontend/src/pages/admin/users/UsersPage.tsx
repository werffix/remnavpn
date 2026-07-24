import { useEffect, useState } from 'react'
import { adminUsersApi } from '@/api/admin'
import { formatDate, formatKopeks } from '@/lib/utils'
import { Search, Ban, Unban, ChevronLeft, ChevronRight } from 'lucide-react'

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchUsers = async (p = 1, q = '') => {
    setLoading(true)
    try {
      const { data } = await adminUsersApi.list({ page: p, limit: 20, search: q || undefined })
      setUsers(data?.items || data || [])
      setTotal(data?.total || 0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleSearch = () => { setPage(1); fetchUsers(1, search) }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Пользователи</h1>

      {/* Search */}
      <div className="flex gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Поиск по имени, username, ID..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button onClick={handleSearch} className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2.5 rounded-lg transition-colors">
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-left">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Имя</th>
                <th className="px-4 py-3">Баланс</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3">Регистрация</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Загрузка...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Не найдено</td></tr>
              ) : (
                users.map((u: any) => (
                  <tr key={u.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{u.telegram_id}</td>
                    <td className="px-4 py-3">
                      <div>{u.full_name || '—'}</div>
                      {u.username && <div className="text-xs text-gray-500">@{u.username}</div>}
                    </td>
                    <td className="px-4 py-3">{formatKopeks(u.balance_kopeks || 0)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        u.status === 'active' || !u.status
                          ? 'bg-green-900/50 text-green-400'
                          : 'bg-red-900/50 text-red-400'
                      }`}>
                        {u.status || 'active'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{u.created_at ? formatDate(u.created_at) : '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 20 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
            <span className="text-sm text-gray-400">Всего: {total}</span>
            <div className="flex gap-2">
              <button
                onClick={() => { setPage((p) => p - 1); fetchUsers(page - 1, search) }}
                disabled={page <= 1}
                className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-400">Стр. {page}</span>
              <button
                onClick={() => { setPage((p) => p + 1); fetchUsers(page + 1, search) }}
                disabled={users.length < 20}
                className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
