import { useEffect, useState } from 'react'
import { referralApi } from '@/api/referral'
import { formatKopeks, formatDate } from '@/lib/utils'
import { Users, Copy, ExternalLink } from 'lucide-react'

export default function ReferralPage() {
  const [info, setInfo] = useState<any>(null)
  const [referrals, setReferrals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      referralApi.info().then((r) => setInfo(r.data)),
      referralApi.list({ limit: 50 }).then((r) => setReferrals(r.data?.items || r.data || [])),
    ]).finally(() => setLoading(false))
  }, [])

  const copyCode = () => {
    if (info?.code) navigator.clipboard.writeText(info.code)
  }

  if (loading) return <div className="text-center py-12 text-gray-400">Загрузка...</div>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Реферальная программа</h1>

      {/* Stats */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-400">Код</p>
            <div className="flex items-center gap-2 mt-1">
              <code className="text-lg font-bold text-brand-400">{info?.code || '—'}</code>
              <button onClick={copyCode} className="text-gray-400 hover:text-white transition-colors">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400">Приглашено</p>
            <p className="text-lg font-bold mt-1">{info?.total_referrals || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Баланс рефералов</p>
            <p className="text-lg font-bold mt-1">{formatKopeks(info?.referral_balance_kopeks || 0)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Комиссия</p>
            <p className="text-lg font-bold mt-1">{info?.commission_percent || 0}%</p>
          </div>
        </div>
      </div>

      {/* Referral link */}
      {info?.referral_link && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
          <ExternalLink className="w-5 h-5 text-gray-400" />
          <code className="flex-1 text-sm text-gray-300 truncate">{info.referral_link}</code>
          <button
            onClick={() => navigator.clipboard.writeText(info.referral_link)}
            className="text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors"
          >
            Копировать
          </button>
        </div>
      )}

      {/* List */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Приглашённые</h2>
        {referrals.length === 0 ? (
          <p className="text-gray-400 text-sm">Пока никто не приглашён</p>
        ) : (
          <div className="space-y-2">
            {referrals.map((r: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <div>
                  <p className="text-sm">{r.full_name || r.username || `ID: ${r.telegram_id}`}</p>
                  <p className="text-xs text-gray-500">{r.registered_at ? formatDate(r.registered_at) : ''}</p>
                </div>
                <span className="text-sm text-green-400">{formatKopeks(r.earned_kopeks || 0)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
