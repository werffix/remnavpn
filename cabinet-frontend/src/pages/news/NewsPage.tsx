import { useEffect, useState } from 'react'
import { newsApi } from '@/api/misc'
import { formatDateTime } from '@/lib/utils'
import { Newspaper, Eye } from 'lucide-react'

export default function NewsPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    newsApi.list().then((r) => {
      setArticles(r.data?.items || r.data || [])
      setLoading(false)
    })
  }, [])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Новости</h1>

      {loading ? (
        <p className="text-gray-400">Загрузка...</p>
      ) : articles.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <Newspaper className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Нет новостей</p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((a: any) => (
            <div key={a.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
              {a.image_url && (
                <img src={a.image_url} alt="" className="w-full h-48 object-cover rounded-lg mb-3" />
              )}
              <h2 className="font-semibold text-lg">{a.title}</h2>
              <p className="text-gray-400 text-sm mt-2 line-clamp-2">{a.content || a.summary}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                {a.category && <span className="bg-gray-800 px-2 py-1 rounded">{a.category}</span>}
                {a.created_at && <span>{formatDateTime(a.created_at)}</span>}
                {a.views !== undefined && (
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {a.views}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
