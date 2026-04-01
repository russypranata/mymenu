'use client'

import { useState } from 'react'
import { updateUserStatus } from '@/lib/actions/admin'

export function UserActions({
  userId,
  currentStatus,
  isSelf,
}: {
  userId: string
  currentStatus: string
  isSelf?: boolean
}) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleAction(status: 'active' | 'suspended') {
    setLoading(true)
    setError(null)
    const result = await updateUserStatus(userId, status)
    if (result.error) setError(result.error)
    setLoading(false)
  }

  if (isSelf) {
    return <span className="text-xs text-gray-300 px-3 py-1.5">Akun Anda</span>
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {error && <span className="text-xs text-red-500">{error}</span>}
      {currentStatus === 'suspended' ? (
        <button
          onClick={() => handleAction('active')}
          disabled={loading}
          className="text-xs font-semibold px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
        >
          Aktifkan
        </button>
      ) : (
        <button
          onClick={() => handleAction('suspended')}
          disabled={loading}
          className="text-xs font-semibold px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
        >
          Suspend
        </button>
      )}
    </div>
  )
}

