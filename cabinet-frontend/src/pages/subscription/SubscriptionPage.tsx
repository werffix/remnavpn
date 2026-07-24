import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { subscriptionApi } from '@/api/subscription'
import { formatKopeks, formatDate } from '@/lib/utils'
import { Zap, Wifi, HardDrive, RefreshCw, Trash2, Settings } from 'lucide-react'

interface Device {
  hwid: string
  name?: string
  last_connected_at?: string
}

export default function SubscriptionPage() {
  const [info, setInfo] = useState<any>(null)
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      subscriptionApi.info().then((r) => setInfo(r.data)),
      subscriptionApi.devices().then((r) => setDevices(r.data?.devices || [])),
    ]).finally(() => setLoading(false))
  }, [])

  const handleRevoke = async () => {
    if (!confirm('Перевыпустить подписку? Старая ссылка перестанет работать.')) return
    await subscriptionApi.revoke()
    const { data } = await subscriptionApi.info()
    setInfo(data)
  }

  const handleDeleteDevice = async (hwid: string) => {
    if (!confirm('Отключить устройство?')) return
    await subscriptionApi.deleteDevice(hwid)
    setDevices((prev) => prev.filter((d) => d.hwid !== hwid))
  }

  if (loading) return <div className="text-center py-12 text-gray-400">Загрузка...</div>
  if (!info) return <div className="text-center py-12 text-gray-400">Нет данных</div>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Подписка</h1>

      {/* Info */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
        {info.tariff_name && (
          <div className="flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-brand-400" />
            <span className="text-gray-400">Тариф:</span>
            <span className="font-medium">{info.tariff_name}</span>
          </div>
        )}
        {info.end_date && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Действует до:</span>
            <span>{formatDate(info.end_date)}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <Wifi className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400">Трафик:</span>
          <span>{info.traffic_used_gb || 0} / {info.traffic_limit_gb || '∞'} ГБ</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <HardDrive className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400">Устройства:</span>
          <span>{info.devices_used || 0} / {info.device_limit || '∞'}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
        <h2 className="text-lg font-semibold mb-3">Действия</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link to="/subscription/purchase" className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors justify-center">
            <Zap className="w-4 h-4" /> Продлить / Сменить тариф
          </Link>
          <button onClick={handleRevoke} className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors justify-center">
            <RefreshCw className="w-4 h-4" /> Перевыпустить подписку
          </button>
        </div>
      </div>

      {/* Devices */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-3">Устройства</h2>
        {devices.length === 0 ? (
          <p className="text-gray-400 text-sm">Нет подключённых устройств</p>
        ) : (
          <div className="space-y-2">
            {devices.map((d) => (
              <div key={d.hwid} className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{d.name || 'Устройство'}</p>
                  <p className="text-xs text-gray-500">{d.hwid.slice(0, 16)}...</p>
                </div>
                <button onClick={() => handleDeleteDevice(d.hwid)} className="text-gray-400 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
