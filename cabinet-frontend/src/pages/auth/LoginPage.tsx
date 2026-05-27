import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/api';
import { loadTelegramScript } from '@/utils/telegram';
import toast from 'react-hot-toast';

interface WidgetConfig {
  bot_username: string; oidc_enabled: boolean;
  oidc_client_id: string; size?: string;
  radius?: number; userpic?: boolean; request_access?: boolean;
}

export default function LoginPage() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.auth.login({ email, password });
      setAuth(res.access_token, res.refresh_token, res.user);
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Ошибка входа');
    } finally { setLoading(false); }
  };

  const handleTelegramOidc = async () => {
    try {
      await loadTelegramScript();
      const cfg: WidgetConfig = await api.auth.getWidgetConfig();
      if (!cfg.oidc_enabled || !cfg.oidc_client_id) {
        toast.error('OIDC не настроен');
        return;
      }
      const clientId = parseInt(cfg.oidc_client_id);
      if (!window.Telegram?.Login) { toast.error('SDK не загрузился'); return; }
      window.Telegram.Login.init({ client_id: clientId, lang: 'ru' }, async (data) => {
        if (data.id_token) {
          try {
            const res = await api.auth.telegramOidc({ id_token: data.id_token });
            setAuth(res.access_token, res.refresh_token, res.user);
            navigate('/');
          } catch (err: any) { toast.error(err.response?.data?.detail || 'Ошибка авторизации'); }
        } else if (data.error) { toast.error('Авторизация отменена'); }
      });
      window.Telegram.Login.open();
    } catch { toast.error('Не удалось загрузить Telegram SDK'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-900">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">V</span>
          </div>
          <h1 className="text-2xl font-bold">Вход в кабинет</h1>
          <p className="text-dark-400 mt-1">VPN Сервис</p>
        </div>

        <div className="space-y-3 mb-6">
          <button onClick={handleTelegramOidc} className="btn-primary w-full py-3 text-base">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.127-.007.25-.059.363-.095.212-.284.597-.462.934-1.163 2.204-1.622 3.102-2.157 4.362-.296.698-.64 1.509-.88 1.925-.345.595-.666.77-1.049.738-.555-.046-.973-.373-1.518-.739-.609-.408-1.19-.855-1.742-1.305-.313-.256-.688-.55-1.004-.876-.218-.226-.248-.454-.05-.684.21-.245.751-.694 1.147-1.025.26-.217.387-.326.492-.476.045-.064.049-.12.028-.184-.02-.064-.08-.116-.173-.244l-.222-.317c-.41-.581-.802-1.104-1.102-1.41-.174-.178-.34-.322-.522-.41-.193-.095-.33-.134-.488-.12-.175.015-.354.075-.53.182-.421.256-1.067.83-1.47 1.22-.667.645-1.07 1.174-1.18 2.009-.07.53.086.97.374 1.311.022.026.044.052.064.077.044.06.048.088.032.152-.07.295-.137.45-.24.71-.017.04-.02.065.019.113.148.189.487.39.793.562.288.163.55.322.813.534.347.28.68.58.988.91.257.276.432.554.495.885.028.145.013.278-.05.403-.203.405-.924.839-1.434 1.082l-.459.219c-.335.157-.692.32-.957.468-.466.26-.896.438-1.158.656-.164.138-.21.25-.191.406.036.28.299.518.773.69.378.138.872.304 1.32.424.326.087.665.162 1.003.23.537.107 1.06.175 1.573.196.365.015.732-.006 1.097-.064.544-.086 1.023-.258 1.434-.458.392-.19.724-.405.956-.597.971-.804 2.042-2.154 2.774-3.502.213-.392.405-.795.59-1.201.148-.326.237-.626.267-.886.013-.11-.022-.173-.078-.22-.057-.047-.16-.066-.243-.066z"/></svg>
            Войти через Telegram
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dark-600" /></div>
          <div className="relative flex justify-center"><span className="px-3 bg-dark-900 text-dark-400 text-sm">или email</span></div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
          </div>
          <div>
            <label className="label">Пароль</label>
            <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-dark-400 space-x-4">
          <Link to="/register" className="text-accent-400 hover:text-accent-300">Регистрация</Link>
          <Link to="/forgot-password" className="text-accent-400 hover:text-accent-300">Забыли пароль?</Link>
        </div>
      </div>
    </div>
  );
}
