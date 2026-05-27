import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { toast.error('Пароли не совпадают'); return; }
    setLoading(true);
    try {
      const res = await api.auth.register({ email, password, referral_code: referralCode || undefined });
      setAuth(res.access_token, res.refresh_token, res.user);
      toast.success('Регистрация успешна!');
      navigate('/');
    } catch (err: any) { toast.error(err.response?.data?.detail || 'Ошибка регистрации'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-900">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Регистрация</h1>
          <p className="text-dark-400 mt-1">Создайте аккаунт</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          <div><label className="label">Email</label><input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} required /></div>
          <div><label className="label">Пароль</label><input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} minLength={6} required /></div>
          <div><label className="label">Подтвердите пароль</label><input type="password" className="input" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required /></div>
          <div><label className="label">Реферальный код (опционально)</label><input type="text" className="input" value={referralCode} onChange={e => setReferralCode(e.target.value)} /></div>
          <button type="submit" className="btn-primary w-full py-3" disabled={loading}>{loading ? 'Регистрация...' : 'Зарегистрироваться'}</button>
        </form>
        <p className="mt-4 text-center text-sm text-dark-400">Уже есть аккаунт? <Link to="/login" className="text-accent-400 hover:text-accent-300">Войти</Link></p>
      </div>
    </div>
  );
}
