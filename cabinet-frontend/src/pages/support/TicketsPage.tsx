import { useEffect, useState } from 'react'
import { ticketsApi } from '@/api/misc'
import { formatDateTime } from '@/lib/utils'
import { HeadphonesIcon, Plus, Send, ArrowLeft } from 'lucide-react'

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  useEffect(() => {
    ticketsApi.list().then((r) => {
      setTickets(r.data?.items || r.data || [])
      setLoading(false)
    })
  }, [])

  const openTicket = async (ticket: any) => {
    setSelected(ticket)
    const { data } = await ticketsApi.get(ticket.id)
    setMessages(data?.messages || [])
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selected) return
    await ticketsApi.sendMessage(selected.id, newMessage)
    setMessages((prev) => [...prev, { content: newMessage, is_admin: false, created_at: new Date().toISOString() }])
    setNewMessage('')
  }

  const createTicket = async () => {
    if (!subject || !body) return
    await ticketsApi.create(subject, body)
    setShowCreate(false)
    setSubject('')
    setBody('')
    const { data } = await ticketsApi.list()
    setTickets(data?.items || data || [])
  }

  if (selected) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">{selected.subject || `Тикет #${selected.id}`}</h1>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {messages.map((m: any, i: number) => (
            <div key={i} className={`flex ${m.is_admin ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                m.is_admin ? 'bg-gray-800 text-gray-200' : 'bg-brand-600 text-white'
              }`}>
                <p>{m.content}</p>
                <p className="text-xs opacity-50 mt-1">{m.created_at ? formatDateTime(m.created_at) : ''}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Сообщение..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button onClick={sendMessage} className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-lg transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Поддержка</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Новый тикет
        </button>
      </div>

      {showCreate && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Тема"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Опишите проблему..."
            rows={4}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
          <div className="flex gap-2">
            <button onClick={createTicket} className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Создать
            </button>
            <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-white px-4 py-2 text-sm">
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-400 text-sm">Загрузка...</p>
        ) : tickets.length === 0 ? (
          <p className="p-6 text-gray-400 text-sm">Нет тикетов</p>
        ) : (
          tickets.map((t: any) => (
            <button
              key={t.id}
              onClick={() => openTicket(t)}
              className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-colors text-left"
            >
              <div>
                <p className="font-medium">{t.subject || `Тикет #${t.id}`}</p>
                <p className="text-xs text-gray-500 mt-1">{t.created_at ? formatDateTime(t.created_at) : ''}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                t.status === 'open' ? 'bg-green-900/50 text-green-400' : 'bg-gray-800 text-gray-400'
              }`}>
                {t.status === 'open' ? 'Открыт' : t.status}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
