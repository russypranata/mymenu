'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

export function StoreSearch({ currentSearch }: { currentSearch?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return (
    <div className="relative w-72">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="search"
        placeholder="Cari nama toko atau slug..."
        defaultValue={currentSearch}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString())
          if (e.target.value) params.set('search', e.target.value)
          else params.delete('search')
          params.delete('storeId')
          router.push(`${pathname}?${params.toString()}`)
        }}
        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 text-gray-900 text-sm rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all"
      />
    </div>
  )
}

