import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { useSubscriptionStore } from '@/store/subscription'
import { formatKopeks, formatDate } from '@/lib/utils'
import {
  Zap, CreditCard, Users, ArrowRight, Wifi, HardDrive,
  Calendar, AlertTriangle, CheckCircle
} from 'lucide-react'

export default function CabinetPage() {
  const { user } = useAuthStore()
  const { subscription, fetch: fetchSub, isLoading } = useSubscriptionStore()

  useEffect(() => { fetchSub() }, [fetchSub])

  const isActive = subscription?.status === 'active'
  const trafficPercent = subscription
    ? Math.min(100, (subscription.traffic_used_gb / (subscription.traffic_limit_gb || 1)) * 100)
    : 0

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* User card */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-brand-600/20 flex items-center justify-center text-brand-400 text-xl font-bold">
            {user?.full_name?.[0] || '?'}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{user?.full_name || 'Пользователь'}</h1>
            <p className="text-gray-400 text-sm">ID: {user?.telegram_id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Баланс</p>
            <p className="text-xl font-bold text-brand-400">{formatKopeks(user?.balance_kopeks || 0)}</p>
          </div>
        </div>
      </div>

      {/* Subscription status */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Подписка</h2>
          {isActive ? (
            <span className="flex items-center gap-1 text-green-400 text-sm">
              <CheckCircle className="w-4 h-4" /> Активна
            </span>
          ) : (
            <span className="flex items-center gap-1 text-gray-400 text-sm">
              <AlertTriangle className="w-4 h-4" /> Неактивна
            </span>
          )}
        </div>

        {subscription && isActive ? (
          <div className="space-y-4">
            {subscription.tariff_name && (
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-brand-400" />
                <span className="text-gray-400">Тариф:</span>
                <span className="font-medium">{subscription.tariff_name}</span>
              </div>
            )}

            {subscription.end_date && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Действует до:</span>
                <span>{formatDate(subscription.end_date)}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <Wifi className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">Трафик:</span>
              <span>{subscription.traffic_used_gb} / {subscription.traffic_limit_gb} ГБ</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${trafficPercent > 90 ? 'bg-red-500' : trafficPercent > 70 ? 'bg-yellow-500' : 'bg-brand-500'}`}
                style={{ width: `${trafficPercent}%` }}
              />
            </div>

            <div className="flex items-center gap-2 text-sm">
              <HardDrive className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">Устройства:</span>
              <span>{subscription.devices_used} / {subscription.device_limit}</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">У вас нет активной подписки</p>
        )}

        <div className="mt-4 flex gap-3">
          <Link
            to={isActive ? '/subscription' : '/subscription/purchase'}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {isActive ? 'Управление' : 'Купить подписку'}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/balance/topup"
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            Пополнить
          </Link>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { to: '/subscription', icon: Zap, label: 'Подписка', color: 'text-brand-400' },
          { to: '/balance', icon: CreditCard, label: 'Баланс', color: 'text-green-400' },
          { to: '/referral', icon: Users, label: 'Рефералы', color: 'text-purple-400' },
          { to: '/support', icon: HardDrive, label: 'Поддержка', color: 'text-yellow-400' },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-gray-700 transition-colors"
          >
            <item.icon className={`w-6 h-6 ${item.color}`} />
            <span className="text-sm text-gray-300">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
