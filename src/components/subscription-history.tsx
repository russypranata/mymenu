import { History } from 'lucide-react'
import type { SubscriptionHistory } from '@/lib/queries/dashboard'
import { getPlanLabel, getPlanBadgeClass, isSubscriptionActive } from '@/lib/subscription-helpers'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

interface SubscriptionHistoryProps {
  history: SubscriptionHistory[]
}

export function SubscriptionHistorySection({ history }: SubscriptionHistoryProps) {
  if (history.length === 0) return null

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-3">
        <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <History className="w-4 h-4 text-gray-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">Riwayat Langganan</p>
          <p className="text-xs text-gray-400 mt-0.5">Semua periode langganan Anda</p>
        </div>
      </div>

      <ul className="divide-y divide-gray-50">
        {history.map((item) => {
          const isActive = isSubscriptionActive(item.ended_at)
          const dotColor = isActive ? 'bg-green-500' : 'bg-gray-300'
          
          return (
            <li key={item.id} className="px-5 py-3.5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className={`w-1.5 h-1.5 rounded-full ${dotColor} flex-shrink-0 mt-2`} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getPlanBadgeClass(item.plan_type, item.origin)}`}>
                      {getPlanLabel(item.plan_type, item.origin)}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-green-500 text-white">
                        Aktif
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    {formatDate(item.started_at)}
                    {item.ended_at && ` — ${formatDate(item.ended_at)}`}
                  </p>
                  {item.note && (
                    <p className="text-xs text-gray-400 mt-0.5 italic">{item.note}</p>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
