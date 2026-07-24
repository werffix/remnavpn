import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { authApi } from '@/api/auth'
import { Zap, AlertCircle, Loader2, CheckCircle } from 'lucide-react'

declare global {
  interface Window {
    Telegram?: {
      Login?: {
        init: (
          opts: {
            bot_username: string
            request_access?: string[]
            size?: string
            radius?: number
            userpic?: boolean
            lang?: string
          },
          callback: (data: { id_token: string } | { error: string }) => void,
        ) => void
        open: (callback: (data: { id_token: string } | { error: string }) => void) => void
      }
    }
  }
}

type Step = 'idle' | 'loading' | 'authenticating' | 'done' | 'error'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [step, setStep] = useState<Step>('idle')
  const [oidcReady, setOidcReady] = useState(false)
  const [botUsername, setBotUsername] = useState('')
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleOidcCallback = useCallback(async (result: { id_token: string } | { error: string }) => {
    if ('error' in result) {
      if (result.error === 'POPUP_CLOSED') {
        setStep('idle')
        return
      }
      setStep('error')
      setError('Ошибка авторизации в Telegram')
      return
    }

    setStep('authenticating')
    setError('')

    try {
      const referralCode = new URLSearchParams(window.location.search).get('ref') || undefined
      const { data } = await authApi.loginTelegramOidc(result.id_token, referralCode)
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      setStep('done')
      setTimeout(() => {
        window.location.href = '/'
      }, 300)
    } catch (e: any) {
      const detail = e?.response?.data?.detail
      if (detail === 'OIDC is not configured') {
        setStep('error')
        setError('Telegram OIDC не настроен на сервере')
      } else if (detail === 'Invalid or expired Telegram OIDC token') {
        setStep('error')
        setError('Токен недействителен. Попробуйте снова.')
      } else if (detail === 'User account is not active') {
        setStep('error')
        setError('Аккаунт заблокирован')
      } else if (e?.response?.status === 429) {
        setStep('error')
        setError('Слишком много попыток. Подождите немного.')
      } else {
        setStep('error')
        setError('Не удалось войти. Попробуйте снова.')
      }
    }
  }, [])

  useEffect(() => {
    let scriptEl: HTMLScriptElement | null = null
    let cancelled = false

    const init = async () => {
      try {
        const { data: config } = await authApi.getTelegramWidgetConfig()
        if (cancelled) return

        setBotUsername(config.bot_username)

        if (!config.oidc_enabled || !config.oidc_client_id) {
          setError('Telegram OIDC не включён. Обратитесь к администратору.')
          return
        }

        scriptEl = document.createElement('script')
        scriptEl.src = 'https://oauth.telegram.org/js/telegram-login.js?3'
        scriptEl.async = true
        scriptEl.onload = () => {
          if (cancelled) return
          if (window.Telegram?.Login) {
            window.Telegram.Login.init(
              {
                bot_username: config.bot_username,
                request_access: ['write'],
                size: config.size || 'large',
                radius: config.radius || 8,
                userpic: config.userpic ?? true,
                lang: 'ru',
              },
              (data) => {
                handleOidcCallback(data as { id_token: string } | { error: string })
              },
            )
            setOidcReady(true)
          }
        }
        scriptEl.onerror = () => {
          if (!cancelled) {
            setError('Не удалось загрузить SDK Telegram')
          }
        }
        document.head.appendChild(scriptEl)
      } catch {
        if (!cancelled) {
          setError('Не удалось загрузить конфигурацию')
        }
      }
    }

    init()

    return () => {
      cancelled = true
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl)
      }
    }
  }, [handleOidcCallback])

  const handleTelegramClick = () => {
    setError('')
    setStep('loading')
    if (window.Telegram?.Login) {
      window.Telegram.Login.open((data) => {
        handleOidcCallback(data as { id_token: string } | { error: string })
      })
    }
  }

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Zap className="w-12 h-12 text-brand-500 mx-auto mb-3" />
          <h1 className="text-2xl font-bold">q1 vpn</h1>
          <p className="text-gray-400 mt-1">Войдите в кабинет</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          {step === 'authenticating' && (
            <div className="flex items-center justify-center gap-2 py-2.5 text-sm text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              Проверка токена...
            </div>
          )}

          {step === 'done' && (
            <div className="flex items-center justify-center gap-2 py-2.5 text-sm text-green-400">
              <CheckCircle className="w-4 h-4" />
              Вход выполнен! Перенаправление...
            </div>
          )}

          {(step === 'idle' || step === 'error' || step === 'loading') && (
            <>
              {oidcReady && (
                <button
                  onClick={handleTelegramClick}
                  disabled={step === 'loading'}
                  className="w-full flex items-center justify-center gap-2 bg-[#229ED9] hover:bg-[#1A7FB5] text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  {step === 'loading' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.96 1.25-5.54 3.66-.52.36-1 .54-1.42.53-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.02-.74 3.98-1.73 6.64-2.87 7.96-3.44 3.8-1.6 4.59-1.88 5.1-1.89.11 0 .37.03.54.17.14.12.18.28.2.55-.01.06.01.24 0 .37z" />
                    </svg>
                  )}
                  Войти через Telegram
                </button>
              )}

              {!oidcReady && !error && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 py-2.5">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Загрузка...
                </div>
              )}
            </>
          )}

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-sm text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
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
