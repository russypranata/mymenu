import { Zap, AlertCircle, CreditCard } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface SubscriptionBannerProps {
  status: 'trial' | 'active' | 'expired'
  planType: 'monthly' | 'annual' | null | undefined
  origin: 'trial' | 'paid' | null | undefined
  expiresAt: string | null
  daysUntilExpiry: number | null
  gracePeriodDaysLeft?: number | null
}

export function SubscriptionBanner({
  status,
  planType,
  origin,
  expiresAt,
  daysUntilExpiry,
  gracePeriodDaysLeft,
}: SubscriptionBannerProps) {
  const resolvedPlanType = planType === 'annual' ? 'annual' : 'monthly'
  const planLabel = resolvedPlanType === 'annual' ? 'Paket Tahunan' : 'Paket Bulanan'
  const planBadgeClass = resolvedPlanType === 'annual'
    ? 'bg-green-800 text-white'
    : 'bg-green-100 text-green-800'

  // Trial active
  if (status === 'trial') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-center gap-3.5">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-green-900 mb-0.5">
            Trial aktif
            {daysUntilExpiry !== null && daysUntilExpiry > 0 && ` — ${daysUntilExpiry} hari tersisa`}
          </p>
          {expiresAt && (
            <p className="text-xs text-green-600">
              Berakhir {formatDate(expiresAt)}. Nikmati semua fitur selama masa trial.
            </p>
          )}
        </div>
      </div>
    )
  }

  // Paid subscription active
  if (status === 'active') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-center gap-3.5">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-bold text-green-900">
              Langganan aktif
              {daysUntilExpiry !== null && daysUntilExpiry > 0 && ` — ${daysUntilExpiry} hari tersisa`}
            </p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${planBadgeClass}`}>
              {planLabel}
            </span>
          </div>
          {expiresAt && (
            <p className="text-xs text-green-600">
              Berakhir {formatDate(expiresAt)}.
            </p>
          )}
        </div>
      </div>
    )
  }

  // Expired — differentiate trial vs paid
  const expiredFromTrial = origin !== 'paid'
  const expiredTitle = expiredFromTrial
    ? 'Trial berakhir'
    : `${planLabel} berakhir`

  // Grace period warning
  const inGracePeriod = gracePeriodDaysLeft !== null && gracePeriodDaysLeft !== undefined && gracePeriodDaysLeft >= 0
  const gracePeriodText = inGracePeriod
    ? gracePeriodDaysLeft === 0
      ? 'Akses akan diblokir besok!'
      : `Akses akan diblokir dalam ${gracePeriodDaysLeft} hari.`
    : 'Perpanjang sekarang untuk akses kembali.'

  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-start gap-3.5">
      <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
        <AlertCircle className="w-5 h-5 text-red-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-bold text-red-900">{expiredTitle}</p>
            {expiresAt && (
              <p className="text-xs text-red-600 mt-0.5">
                Berakhir {formatDate(expiresAt)}. {gracePeriodText}
              </p>
            )}
            {inGracePeriod && (
              <p className="text-xs text-red-700 font-semibold mt-1">
                ⚠️ Masa tenggang 3 hari — perpanjang sekarang!
              </p>
            )}
          </div>
          <a
            href="/profile"
            className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5" />
            Perpanjang
          </a>
        </div>
      </div>
    </div>
  )
}
