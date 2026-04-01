'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Search } from 'lucide-react'
import { SelectFilter } from '@/components/select-filter'

const STATUS_OPTIONS = [
  { value: '', label: 'Semua Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
]

const ROLE_OPTIONS = [
  { value: '', label: 'Semua Role' },
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
]

export function UserFilters({
  currentStatus,
  currentRole,
  currentSearch,
}: {
  currentStatus?: string
  currentRole?: string
  currentSearch?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      params.delete('userId')
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          placeholder="Cari email / nama..."
          defaultValue={currentSearch}
          onChange={(e) => updateParam('search', e.target.value)}
          className="pl-9 pr-4 py-2.5 bg-white border border-gray-200 text-gray-900 text-sm rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 w-64 transition-all"
        />
      </div>
      <SelectFilter
        value={currentStatus ?? ''}
        onChange={(v) => updateParam('status', v)}
        options={STATUS_OPTIONS}
      />
      <SelectFilter
        value={currentRole ?? ''}
        onChange={(v) => updateParam('role', v)}
        options={ROLE_OPTIONS}
      />
    </div>
  )
}
