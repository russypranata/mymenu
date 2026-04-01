'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { UtensilsCrossed, ChevronRight, Store } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StoreOption {
  id: string
  name: string
}

interface Props {
  stores: StoreOption[]
  mobile?: boolean
}

export function MenuNavLink({ stores, mobile }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const isActive = pathname.startsWith('/store/') && pathname.includes('/menu')

  // Close on outside click or Escape
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  const handleClick = () => {
    if (stores.length === 0) {
      router.push('/store/new')
    } else if (stores.length === 1) {
      router.push(`/store/${stores[0].id}/menu`)
    } else {
      setOpen(prev => !prev)
    }
  }

  const handleSelect = (storeId: string) => {
    setOpen(false)
    router.push(`/store/${storeId}/menu`)
  }

  if (mobile) {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={handleClick}
          className={cn(
            'flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium rounded-xl transition-colors',
            isActive ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'
          )}
        >
          <UtensilsCrossed className={cn('w-5 h-5', isActive ? 'text-green-500' : 'text-gray-400')} />
          Menu
        </button>

        {open && stores.length > 1 && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white rounded-2xl border border-gray-100 shadow-xl w-48 py-2 z-50">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-1.5">Pilih Toko</p>
            {stores.map(store => (
              <button key={store.id} onClick={() => handleSelect(store.id)}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors text-left"
              >
                <Store className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{store.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleClick}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl transition-colors group',
          isActive
            ? 'bg-green-50 text-green-600'
            : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
        )}
      >
        <UtensilsCrossed className={cn(
          'w-5 h-5 flex-shrink-0 transition-colors',
          isActive ? 'text-green-500' : 'text-gray-400 group-hover:text-green-500'
        )} />
        <span className="flex-1 text-left">Menu</span>
        {stores.length > 1 && (
          <ChevronRight className={cn(
            'w-4 h-4 transition-transform flex-shrink-0',
            open ? 'rotate-90 text-green-400' : 'text-gray-300'
          )} />
        )}
      </button>

      {open && stores.length > 1 && (
        <div className="mt-1 bg-white rounded-2xl border border-gray-100 shadow-xl py-2 z-50 overflow-hidden">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-1.5">Pilih Toko</p>
          {stores.map(store => (
            <button key={store.id} onClick={() => handleSelect(store.id)}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors text-left outline-none focus:bg-green-50"
            >
              <Store className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate flex-1">{store.name}</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
