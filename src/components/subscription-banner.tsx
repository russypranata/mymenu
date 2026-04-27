import { Zap } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface SubscriptionBannerProps {
  status: 'trial' | 'active' | 'expired'
  planType: 'monthly' | 'annual' | null | undefined
  expiresAt: string | null
  daysUntilExpiry: number | null
}

export function SubscriptionBanner({
  status,
  planType,
  expiresAt,
  daysUntilExpiry,
}: SubscriptionBannerProps) {
  const resolvedPlanType = planType === 'annual' ? 'annual' : 'monthly'

  const planLabel =
    resolvedPlanType === 'annual' ? 'Paket Tahunan' : 'Paket Bulanan'

  const planBadgeClass =
    resolvedPlanType === 'annual'
      ? 'bg-green-800 text-white'
      : 'bg-green-100 text-green-800'

  if (status === 'trial') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-center gap-3.5">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-bold text-green-900">
              Trial aktif
              {daysUntilExpiry !== null && daysUntilExpiry > 0 && ` — ${daysUntilExpiry} hari tersisa`}
            </p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${planBadgeClass}`}>
              {planLabel}
            </span>
          </div>
          {expiresAt && (
            <p className="text-xs text-green-600">
              Berakhir {formatDate(expiresAt)}. Nikmati semua fitur selama masa trial.
            </p>
          )}
        </div>
      </div>
    )
  }

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

  // expired
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-center gap-3.5">
      <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
        <Zap className="w-5 h-5 text-red-500" />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-bold text-red-900">Langganan berakhir</p>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${planBadgeClass}`}>
            {planLabel}
          </span>
        </div>
        {expiresAt && (
          <p className="text-xs text-red-600">
            Berakhir {formatDate(expiresAt)}. Hubungi admin untuk perpanjangan.
          </p>
        )}
      </div>
    </div>
  )
}
