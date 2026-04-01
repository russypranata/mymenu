'use client'

import { useRouter, usePathname } from 'next/navigation'
import { SelectFilter } from '@/components/select-filter'

const STATUS_OPTIONS = [
  { value: '', label: 'Semua Status' },
  { value: 'trial', label: 'Trial' },
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
  { value: 'cancelled', label: 'Cancelled' },
]

export function SubFilters({ currentStatus }: { currentStatus?: string }) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex gap-3">
      <SelectFilter
        value={currentStatus ?? ''}
        onChange={(v) => {
          const params = new URLSearchParams()
          if (v) params.set('status', v)
          router.push(`${pathname}?${params.toString()}`)
        }}
        options={STATUS_OPTIONS}
      />
    </div>
  )
}
