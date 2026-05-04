'use client'

import { useEffect, useState } from 'react'

interface Props {
  openingHours: string
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

export function OpenBadge({ openingHours }: Props) {
  const [isOpen, setIsOpen] = useState<boolean | null>(null)

  useEffect(() => {
    setIsOpen(parseIsOpen(openingHours))
    const interval = setInterval(() => setIsOpen(parseIsOpen(openingHours)), 60_000)
    return () => clearInterval(interval)
  }, [openingHours])

  if (isOpen === null) return null

  return isOpen ? (
    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold tracking-wide text-white bg-green-500 px-2.5 py-1 rounded-lg flex-shrink-0">
      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
      BUKA
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold tracking-wide text-white bg-red-500 px-2.5 py-1 rounded-lg flex-shrink-0">
      <span className="w-1.5 h-1.5 rounded-full bg-white/70 inline-block" />
      TUTUP
    </span>
  )
}
