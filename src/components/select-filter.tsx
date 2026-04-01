'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Option {
  value: string
  label: string
}

interface Props {
  value: string
  onChange: (value: string) => void
  options: Option[]
  className?: string
}

export function SelectFilter({ value, onChange, options, className }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = options.find(o => o.value === value) ?? options[0]

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', keyHandler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', keyHandler)
    }
  }, [])

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 pl-4 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all min-w-[140px] justify-between"
      >
        <span className="truncate">{selected.label}</span>
        <ChevronDown className={cn('w-4 h-4 text-gray-400 flex-shrink-0 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute top-full mt-1.5 left-0 bg-white rounded-2xl border border-gray-100 shadow-xl py-1.5 z-50 min-w-full overflow-hidden">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors hover:bg-green-50 hover:text-green-600 outline-none"
            >
              <span className="flex-1">{opt.label}</span>
              {opt.value === value && <Check className="w-4 h-4 text-green-500 flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
