import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/api';
import { PageHeader, EmptyState } from '@/components/ui';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ChartNoAxesColumnIncreasing, Check, Circle } from 'lucide-react';

export default function PollsPage() {
  const { data: polls } = useQuery({ queryKey: ['polls'], queryFn: api.polls.list });
  const [selectedPoll, setSelectedPoll] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const respond = useMutation({
    mutationFn: () => api.polls.respond(selectedPoll!, { answers }),
    onSuccess: () => { toast.success('Ответы сохранены!'); setSelectedPoll(null); setAnswers({}); },
    onError: (err: any) => toast.error(err.response?.data?.detail || 'Ошибка'),
  });

  const poll = polls?.find(p => p.id === selectedPoll);

  if (poll) {
    return (
      <div>
        <button onClick={() => setSelectedPoll(null)} className="btn-ghost mb-4">&larr; Назад</button>
        <div className="card max-w-lg">
          <h2 className="text-lg font-semibold mb-1">{poll.title}</h2>
          <p className="text-sm text-dark-400 mb-4">{poll.description}</p>
          {poll.reward_kopeks > 0 && <p className="text-xs text-emerald-400 mb-4">+{poll.reward_kopeks / 100} ₽ за прохождение</p>}
          <div className="space-y-4">
            {poll.questions?.map(q => (
              <div key={q.id}>
                <p className="text-sm font-medium mb-2">{q.question}</p>
                <div className="space-y-1">
                  {q.options.map((opt, i) => (
                    <label key={i} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${answers[q.id] === opt ? 'border-accent-500 bg-accent-500/10' : 'border-dark-600 hover:border-dark-500'}`}>
                      <input type="radio" name={`q-${q.id}`} value={opt} checked={answers[q.id] === opt} onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))} className="sr-only" />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${answers[q.id] === opt ? 'border-accent-500' : 'border-dark-400'}`}>
                        {answers[q.id] === opt && <div className="w-2.5 h-2.5 rounded-full bg-accent-500" />}
                      </div>
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => respond.mutate()} className="btn-primary w-full mt-6" disabled={respond.isPending || Object.keys(answers).length !== (poll.questions?.length || 0)}>
            Отправить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Опросы" subtitle="Пройдите опрос и получите бонус" />
      {polls?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {polls.filter(p => p.is_active).map(p => (
            <div key={p.id} onClick={() => setSelectedPoll(p.id)} className="card-hover cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center"><ChartNoAxesColumnIncreasing className="text-accent-400" size={20} /></div>
                <div>
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-xs text-dark-400">{p.questions?.length || 0} вопросов</p>
                </div>
              </div>
              <p className="text-sm text-dark-400 line-clamp-2">{p.description}</p>
              {p.reward_kopeks > 0 && <p className="text-xs text-emerald-400 mt-2">+{p.reward_kopeks / 100} ₽</p>}
            </div>
          ))}
        </div>
      ) : <EmptyState title="Нет активных опросов" />}
    </div>
  );
}
