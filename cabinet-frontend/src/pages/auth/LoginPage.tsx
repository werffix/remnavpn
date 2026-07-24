import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { authApi } from '@/api/auth'
import { Zap, AlertCircle, ExternalLink, CheckCircle, Loader2 } from 'lucide-react'

type Step = 'idle' | 'requesting' | 'waiting' | 'done' | 'error'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [step, setStep] = useState<Step>('idle')
  const [deepLink, setDeepLink] = useState('')
  const [botUsername, setBotUsername] = useState('')
  const [countdown, setCountdown] = useState(0)
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => stopPolling()
  }, [stopPolling])

  const pollToken = useCallback(async (token: string) => {
    try {
      const { data } = await authApi.pollDeepLink(token)
      // 200 → login success
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      setStep('done')
      stopPolling()
      setTimeout(() => navigate('/'), 500)
    } catch (err: any) {
      if (err?.response?.status === 202) {
        // Still pending — continue polling
        return
      }
      // 410 expired or other error
      stopPolling()
      setStep('error')
      setError('Ссылка истекла. Попробуйте снова.')
    }
  }, [navigate, stopPolling])

  const handleTelegramLogin = useCallback(async () => {
    setError('')
    setStep('requesting')
    stopPolling()

    try {
      const { data } = await authApi.requestDeepLink()
      const link = `https://t.me/${data.bot_username}?start=webauth_${data.token}`
      setDeepLink(link)
      setBotUsername(data.bot_username)
      setStep('waiting')
      setCountdown(data.expires_in)

      // Countdown
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            stopPolling()
            setStep('error')
            setError('Ссылка истекла. Нажмите кнопку снова.')
            return 0
          }
          return prev - 1
        })
      }, 1000)

      // Poll every 2s
      pollingRef.current = setInterval(() => {
        pollToken(data.token)
      }, 2000)
    } catch {
      setStep('error')
      setError('Не удалось создать ссылку для входа')
    }
  }, [stopPolling, pollToken])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch {
      setError('Неверный email или пароль')
    }
  }

  const formatCountdown = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${String(sec).padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Zap className="w-12 h-12 text-brand-500 mx-auto mb-3" />
          <h1 className="text-2xl font-bold">q1 vpn</h1>
          <p className="text-gray-400 mt-1">Войдите в кабинет</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          {/* Telegram Deep Link */}
          {step === 'idle' && (
            <button
              onClick={handleTelegramLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#229ED9] hover:bg-[#1A7FB5] text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.96 1.25-5.54 3.66-.52.36-1 .54-1.42.53-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.02-.74 3.98-1.73 6.64-2.87 7.96-3.44 3.8-1.6 4.59-1.88 5.1-1.89.11 0 .37.03.54.17.14.12.18.28.2.55-.01.06.01.24 0 .37z" />
              </svg>
              Войти через Telegram
            </button>
          )}

          {step === 'requesting' && (
            <div className="flex items-center justify-center gap-2 py-2.5 text-sm text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              Создание ссылки...
            </div>
          )}

          {step === 'waiting' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2 text-sm text-blue-400">
                <ExternalLink className="w-4 h-4 shrink-0" />
                <span>Нажмите кнопку ниже и подтвердите вход в Telegram</span>
              </div>
              <a
                href={deepLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#229ED9] hover:bg-[#1A7FB5] text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.96 1.25-5.54 3.66-.52.36-1 .54-1.42.53-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.02-.74 3.98-1.73 6.64-2.87 7.96-3.44 3.8-1.6 4.59-1.88 5.1-1.89.11 0 .37.03.54.17.14.12.18.28.2.55-.01.06.01.24 0 .37z" />
                </svg>
                Открыть Telegram
              </a>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Ожидание подтверждения...
                {countdown > 0 && (
                  <span className="ml-1 text-gray-600">{formatCountdown(countdown)}</span>
                )}
              </div>
              <button
                onClick={handleTelegramLogin}
                className="w-full text-xs text-gray-500 hover:text-gray-400 transition-colors"
              >
                Получить новую ссылку
              </button>
            </div>
          )}

          {step === 'done' && (
            <div className="flex items-center justify-center gap-2 py-2.5 text-sm text-green-400">
              <CheckCircle className="w-4 h-4" />
              Вход выполнен! Перенаправление...
            </div>
          )}

          {step === 'error' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-sm text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
              <button
                onClick={handleTelegramLogin}
                className="w-full flex items-center justify-center gap-2 bg-[#229ED9] hover:bg-[#1A7FB5] text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                Попробовать снова
              </button>
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-gray-900 px-2 text-gray-500">или</span>
            </div>
          </div>

          {/* Email */}
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
            {error && step !== 'error' && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
