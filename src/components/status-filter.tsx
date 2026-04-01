'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ChevronDown, Check } from 'lucide-react'

const OPTIONS = [
  { value: '', label: 'Semua Status' },
  { value: 'active', label: 'Aktif' },
  { value: 'inactive', label: 'Nonaktif' },
]

interface Props {
  currentStatus?: string
  baseHref: string
}

export function StatusFilter({ currentStatus = '', baseHref }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = OPTIONS.find(o => o.value === currentStatus) ?? OPTIONS[0]

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (value: string) => {
    setOpen(false)
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set('status', value)
    else params.delete('status')
    const q = params.get('q')
    const query = [q ? `q=${q}` : '', value ? `status=${value}` : ''].filter(Boolean).join('&')
    router.push(`${baseHref}${query ? `?${query}` : ''}`)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 pl-3.5 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all min-w-[140px] justify-between"
      >
        <span>{selected.label}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-1.5 right-0 bg-white rounded-2xl border border-gray-100 shadow-xl py-1.5 z-50 min-w-full overflow-hidden">
          {OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors hover:bg-green-50 hover:text-green-600 outline-none"
            >
              <span className="flex-1">{opt.label}</span>
              {opt.value === currentStatus && (
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
