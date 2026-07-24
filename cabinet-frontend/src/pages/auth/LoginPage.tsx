import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { authApi, TelegramWidgetData } from '@/api/auth'
import { Zap, AlertCircle } from 'lucide-react'

declare global {
  interface Window {
    TelegramLoginWidget?: {
      onAuth: (data: TelegramWidgetData) => void
    }
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [tgReady, setTgReady] = useState(false)
  const widgetRef = useRef<HTMLDivElement>(null)
  const { login, loginTelegramWidget, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleTelegramAuth = useCallback(async (data: TelegramWidgetData) => {
    setError('')
    try {
      await loginTelegramWidget(data)
      navigate('/')
    } catch {
      setError('Ошибка входа через Telegram')
    }
  }, [loginTelegramWidget, navigate])

  useEffect(() => {
    // Set global callback for Telegram Widget
    window.TelegramLoginWidget = {
      onAuth: handleTelegramAuth,
    }

    // Load the widget script
    const loadWidget = async () => {
      try {
        const { data: config } = await authApi.getTelegramWidgetConfig()
        const username = config.bot_username

        if (!username) {
          setError('Telegram бот не настроен')
          return
        }

        const script = document.createElement('script')
        script.src = 'https://telegram.org/js/telegram-widget.js?2'
        script.setAttribute('data-telegram-login', username)
        script.setAttribute('data-size', config.size || 'large')
        script.setAttribute('data-radius', String(config.radius || 10))
        script.setAttribute('data-userpic', String(config.userpic ?? true))
        script.setAttribute('data-request-access', config.request_access ? 'write' : '')
        script.setAttribute('data-onauth', 'TelegramLoginWidget.onAuth(user)')
        script.async = true

        script.onload = () => setTgReady(true)
        script.onerror = () => setError('Не удалось загрузить виджет Telegram')

        if (widgetRef.current) {
          widgetRef.current.innerHTML = ''
          widgetRef.current.appendChild(script)
        }
      } catch {
        setError('Не удалось загрузить конфигурацию виджета')
      }
    }

    loadWidget()

    return () => {
      delete window.TelegramLoginWidget
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
          {/* Telegram Widget */}
          <div className="flex flex-col items-center gap-3">
            <div ref={widgetRef} className="min-h-[50px]" />
            {!tgReady && !error && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                Загрузка виджета...
              </div>
            )}
          </div>

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
            {error && <p className="text-red-400 text-sm">{error}</p>}
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
