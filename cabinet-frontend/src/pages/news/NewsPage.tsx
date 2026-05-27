import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { PageHeader, EmptyState } from '@/components/ui';
import { formatDate } from '@/utils/format';
import { Newspaper, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function NewsPage() {
  const { data, isLoading } = useQuery({ queryKey: ['news'], queryFn: () => api.news.list() });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data: article } = useQuery({ queryKey: ['news', selectedId], queryFn: () => api.news.get(selectedId!), enabled: !!selectedId });

  if (article) {
    return (
      <div>
        <button onClick={() => setSelectedId(null)} className="btn-ghost mb-4">&larr; Все новости</button>
        <div className="card">
          {article.image_url && <img src={article.image_url} alt="" className="w-full h-48 object-cover rounded-xl mb-4" />}
          <h1 className="text-xl font-bold mb-2">{article.title}</h1>
          <p className="text-xs text-dark-400 mb-4">{formatDate(article.created_at)}</p>
          <div className="text-dark-200 leading-relaxed whitespace-pre-wrap">{article.content}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Новости" subtitle="Последние обновления сервиса" />
      {data?.items?.length ? (
        <div className="space-y-3">
          {data.items.map(n => (
            <div key={n.id} onClick={() => setSelectedId(n.id)} className="card-hover cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-dark-600 flex items-center justify-center flex-shrink-0"><Newspaper size={20} className="text-dark-300" /></div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{n.title}</h3>
                  <p className="text-sm text-dark-400 mt-1 line-clamp-2">{n.content?.slice(0, 120)}</p>
                  <p className="text-xs text-dark-500 mt-2">{formatDate(n.created_at)}</p>
                </div>
                <ChevronRight size={16} className="text-dark-500 mt-1" />
              </div>
            </div>
          ))}
        </div>
      ) : <EmptyState title="Нет новостей" />}
    </div>
  );
}
