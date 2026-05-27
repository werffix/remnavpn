import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api';
import { PageHeader, EmptyState, StatusBadge } from '@/components/ui';
import { formatDateTime } from '@/utils/format';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { MessageSquare, Plus, Send, X, ChevronRight, Circle } from 'lucide-react';

export default function TicketsPage() {
  const { data: tickets, isLoading } = useQuery({ queryKey: ['tickets'], queryFn: api.tickets.list });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [replyText, setReplyText] = useState('');
  const qc = useQueryClient();

  const { data: ticketDetail } = useQuery({
    queryKey: ['ticket', selectedId], queryFn: () => api.tickets.get(selectedId!), enabled: !!selectedId,
  });

  const createMut = useMutation({
    mutationFn: () => api.tickets.create({ title, message }),
    onSuccess: () => { toast.success('Тикет создан'); setShowCreate(false); setTitle(''); setMessage(''); qc.invalidateQueries({ queryKey: ['tickets'] }); },
    onError: (err: any) => toast.error(err.response?.data?.detail || 'Ошибка'),
  });

  const replyMut = useMutation({
    mutationFn: () => api.tickets.reply(selectedId!, { message: replyText }),
    onSuccess: () => { setReplyText(''); qc.invalidateQueries({ queryKey: ['ticket', selectedId] }); qc.invalidateQueries({ queryKey: ['tickets'] }); },
    onError: (err: any) => toast.error(err.response?.data?.detail || 'Ошибка'),
  });

  const closeMut = useMutation({
    mutationFn: () => api.tickets.close(selectedId!),
    onSuccess: () => { setSelectedId(null); qc.invalidateQueries({ queryKey: ['tickets'] }); toast.success('Тикет закрыт'); },
  });

  if (selectedId && ticketDetail) {
    return (
      <div>
        <button onClick={() => setSelectedId(null)} className="btn-ghost mb-4">&larr; Назад к тикетам</button>
        <div className="card mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">{ticketDetail.ticket.title}</h2>
            <StatusBadge status={ticketDetail.ticket.status} />
          </div>
          <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
            {ticketDetail.messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.is_admin ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] rounded-xl px-4 py-2 ${msg.is_admin ? 'bg-dark-600 text-dark-100' : 'bg-accent-500/10 text-accent-100'}`}>
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs text-dark-400 mt-1">{formatDateTime(msg.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
          {ticketDetail.ticket.status !== 'CLOSED' && (
            <div className="flex gap-2">
              <input className="input flex-1" value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Написать..." />
              <button onClick={() => replyMut.mutate()} className="btn-primary" disabled={!replyText}><Send size={16} /></button>
              <button onClick={() => closeMut.mutate()} className="btn-danger">Закрыть</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Поддержка" subtitle="Тикеты и обращения" />
      <button onClick={() => setShowCreate(true)} className="btn-primary mb-4"><Plus size={16} /> Создать тикет</button>

      {tickets?.length ? (
        <div className="space-y-2">
          {tickets.map(t => (
            <div key={t.id} onClick={() => setSelectedId(t.id)} className="card-hover cursor-pointer flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-dark-600 flex items-center justify-center"><MessageSquare size={18} className="text-dark-300" /></div>
                <div>
                  <p className="font-medium">{t.title}</p>
                  <p className="text-xs text-dark-400">{formatDateTime(t.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={t.status} />
                <ChevronRight size={16} className="text-dark-400" />
              </div>
            </div>
          ))}
        </div>
      ) : <EmptyState title="Нет тикетов" description="Создайте обращение в поддержку" />}

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold">Новый тикет</h2><button onClick={() => setShowCreate(false)} className="text-dark-400 hover:text-white"><X size={18} /></button></div>
            <div className="space-y-4">
              <div><label className="label">Тема</label><input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Кратко опишите проблему" /></div>
              <div><label className="label">Сообщение</label><textarea className="input" rows={5} value={message} onChange={e => setMessage(e.target.value)} placeholder="Опишите подробнее..." /></div>
              <button onClick={() => createMut.mutate()} className="btn-primary w-full py-3" disabled={!title || !message}>Отправить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
