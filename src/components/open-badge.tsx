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

  if (!isOpen) return null

  return (
    <span className="text-[10px] sm:text-xs font-extrabold tracking-wide text-white bg-gradient-to-r from-green-500 to-emerald-500 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg flex-shrink-0 shadow-lg animate-pulse">
      BUKA
    </span>
  )
}
