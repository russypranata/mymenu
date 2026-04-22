'use client'

import { useState } from 'react'
import { TrendingUp, MessageCircle, Eye } from 'lucide-react'
import type { DailyAnalytics } from '@/lib/queries/dashboard'

interface Props {
  data: DailyAnalytics[]
}

const DAYS_OPTIONS = [7, 14, 30] as const

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

export function AnalyticsChart({ data }: Props) {
  const [metric, setMetric] = useState<'page_views' | 'whatsapp_clicks'>('page_views')

  const values = data.map(d => d[metric])
  const maxVal = Math.max(...values, 1)

  const totalViews = data.reduce((s, d) => s + d.page_views, 0)
  const totalWA = data.reduce((s, d) => s + d.whatsapp_clicks, 0)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Statistik {data.length} Hari Terakhir</h2>
          </div>
        </div>
      </div>

      {/* Metric toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMetric('page_views')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            metric === 'page_views'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          <Eye className="w-3 h-3" />
          Views ({totalViews})
        </button>
        <button
          onClick={() => setMetric('whatsapp_clicks')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            metric === 'whatsapp_clicks'
              ? 'bg-emerald-500 text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          <MessageCircle className="w-3 h-3" />
          WA Clicks ({totalWA})
        </button>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-1 h-28">
        {data.map((d, i) => {
          const val = d[metric]
          const heightPct = maxVal > 0 ? (val / maxVal) * 100 : 0
          const isToday = i === data.length - 1
          const color = metric === 'page_views' ? 'bg-blue-400' : 'bg-emerald-400'
          const colorToday = metric === 'page_views' ? 'bg-blue-500' : 'bg-emerald-500'

          return (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] font-semibold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {val} — {formatDate(d.date)}
              </div>
              <div className="w-full flex items-end" style={{ height: '96px' }}>
                <div
                  className={`w-full rounded-t-lg transition-all ${isToday ? colorToday : color} ${isToday ? 'opacity-100' : 'opacity-60'}`}
                  style={{ height: `${Math.max(heightPct, val > 0 ? 4 : 0)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* X-axis labels — show only first, middle, last */}
      <div className="flex justify-between text-[10px] text-gray-400 font-medium -mt-1">
        <span>{formatDate(data[0]?.date ?? '')}</span>
        <span>{formatDate(data[Math.floor(data.length / 2)]?.date ?? '')}</span>
        <span>Hari ini</span>
      </div>
    </div>
  )
}
