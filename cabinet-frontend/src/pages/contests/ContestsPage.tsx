import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/api';
import { PageHeader, EmptyState } from '@/components/ui';
import toast from 'react-hot-toast';
import { Swords, Trophy, Users, Zap } from 'lucide-react';

export default function ContestsPage() {
  const { data: contests } = useQuery({ queryKey: ['contests'], queryFn: api.contests.list });

  return (
    <div>
      <PageHeader title="Конкурсы" subtitle="Участвуйте и выигрывайте призы" />
      {contests?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contests.filter(c => c.is_active).map(c => (
            <ContestCard key={c.id} contest={c} />
          ))}
        </div>
      ) : <EmptyState title="Нет активных конкурсов" />}
    </div>
  );
}

function ContestCard({ contest }: { contest: any }) {
  const attempt = useMutation({
    mutationFn: () => api.contests.attempt(contest.id),
    onSuccess: () => toast.success('Участие принято!'),
    onError: (err: any) => toast.error(err.response?.data?.detail || 'Ошибка'),
  });

  return (
    <div className="card-hover">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center"><Swords className="text-purple-400" size={20} /></div>
        <div>
          <h3 className="font-semibold">{contest.title}</h3>
          <p className="text-xs text-dark-400">{contest.type}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm text-dark-300 mb-3">
        <span><Trophy size={14} className="inline mr-1" />{contest.prize_amount} {contest.prize_type}</span>
        <span>до {new Date(contest.end_date).toLocaleDateString()}</span>
      </div>
      <button onClick={() => attempt.mutate()} className="btn-primary w-full" disabled={attempt.isPending}>
        <Zap size={14} /> Участвовать
      </button>
    </div>
  );
}
