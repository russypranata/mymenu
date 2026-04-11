'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

interface Props {
  openingHours: string
  isDark: boolean
  primaryColor: string
}

function parseIsOpen(openingHours: string): boolean {
  const match = openingHours.match(/(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/)
  if (!match) return true
  const now = new Date()
  const current = now.getHours() * 60 + now.getMinutes()
  const open = parseInt(match[1]) * 60 + parseInt(match[2])
  const close = parseInt(match[3]) * 60 + parseInt(match[4])
  return current >= open && current < close
}

export function OpeningHoursBadge({ openingHours, isDark, primaryColor }: Props) {
  const [isOpen, setIsOpen] = useState<boolean | null>(null)

  useEffect(() => {
    setIsOpen(parseIsOpen(openingHours))
    // re-check every minute
    const interval = setInterval(() => setIsOpen(parseIsOpen(openingHours)), 60_000)
    return () => clearInterval(interval)
  }, [openingHours])

  return (
    <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border-b`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${primaryColor}20` }}>
          <Clock className="w-4 h-4" style={{ color: primaryColor }} />
        </div>
        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Jam Operasional:
        </span>
        <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {openingHours}
        </span>
        {isOpen !== null && (
          <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            {isOpen ? 'Sedang Buka' : 'Sedang Tutup'}
          </span>
        )}
      </div>
    </div>
  )
}
