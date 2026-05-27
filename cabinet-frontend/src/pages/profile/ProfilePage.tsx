import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/api';
import { PageHeader } from '@/components/ui';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { User, Mail, Globe, Shield, Bell, Link, Languages } from 'lucide-react';

export default function ProfilePage() {
  const { user, setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const linkEmail = useMutation({
    mutationFn: () => api.auth.register({ email, password }),
    onSuccess: () => { toast.success('Email привязан!'); setShowEmailForm(false); },
    onError: (err: any) => toast.error(err.response?.data?.detail || 'Ошибка'),
  });

  return (
    <div>
      <PageHeader title="Профиль" subtitle="Ваши данные и настройки" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-accent-500 flex items-center justify-center text-xl font-bold">{user?.first_name?.[0]}</div>
            <div>
              <h2 className="text-xl font-bold">{user?.first_name} {user?.last_name}</h2>
              <p className="text-dark-400">@{user?.username || '—'}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-dark-600">
              <span className="text-sm text-dark-400 flex items-center gap-2"><Mail size={14} /> Email</span>
              <span className="text-sm">{user?.email || 'не указан'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-dark-600">
              <span className="text-sm text-dark-400 flex items-center gap-2"><Globe size={14} /> Язык</span>
              <span className="text-sm uppercase">{user?.language_code || 'ru'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-dark-600">
              <span className="text-sm text-dark-400 flex items-center gap-2"><Shield size={14} /> Статус</span>
              <span className={`text-sm font-medium ${user?.is_partner ? 'text-yellow-400' : 'text-dark-300'}`}>
                {user?.is_partner ? 'Партнёр' : user?.status}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-dark-400 flex items-center gap-2"><Bell size={14} /> Уведомления</span>
              <span className="text-sm">Telegram</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Настройки аккаунта</h2>
          <div className="space-y-3">
            {!user?.email && (
              <div>
                {showEmailForm ? (
                  <div className="space-y-3 p-3 bg-dark-800 rounded-xl">
                    <input className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" />
                    <input className="input" value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль" type="password" />
                    <button onClick={() => linkEmail.mutate()} className="btn-primary w-full">Привязать</button>
                    <button onClick={() => setShowEmailForm(false)} className="btn-ghost w-full">Отмена</button>
                  </div>
                ) : (
                  <button onClick={() => setShowEmailForm(true)} className="btn-secondary w-full"><Mail size={14} /> Привязать email</button>
                )}
              </div>
            )}

            {user?.auth_type === 'telegram' && (
              <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="btn-secondary w-full"><Link size={14} /> Создать пароль</button>
            )}

            {user?.email && !user?.email_verified && (
              <button className="btn-secondary w-full">Подтвердить email</button>
            )}

            <div className="mt-4 pt-4 border-t border-dark-600">
              <p className="text-sm text-dark-400 mb-2">Реферальный код</p>
              <div className="flex gap-2">
                <input className="input font-mono flex-1" value={user?.referral_code || ''} readOnly />
                <button onClick={() => { navigator.clipboard.writeText(user?.referral_code || ''); toast.success('Скопировано!'); }} className="btn-primary">Копировать</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
