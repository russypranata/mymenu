'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { AdminUserDetail } from '@/lib/queries/admin'
import { X, Store, ExternalLink, CreditCard, UserCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { createTrialSubscription } from '@/lib/actions/admin'

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-50 text-green-600',
  trial: 'bg-amber-50 text-amber-600',
  expired: 'bg-gray-100 text-gray-500',
  cancelled: 'bg-red-50 text-red-600',
}

export function UserDetailModal({
  detail,
  userId,
  currentParams,
}: {
  detail: AdminUserDetail
  userId: string
  currentParams: Record<string, string | undefined>
}) {
  const { profile, stores, subscription } = detail
  const [trialLoading, setTrialLoading] = useState(false)
  const [trialError, setTrialError] = useState<string | null>(null)
  const [trialDone, setTrialDone] = useState(false)

  async function handleActivateTrial() {
    setTrialLoading(true)
    setTrialError(null)
    const result = await createTrialSubscription(userId)
    if (result.error) setTrialError(result.error)
    else setTrialDone(true)
    setTrialLoading(false)
  }

  const closeParams = new URLSearchParams()
  if (currentParams.status) closeParams.set('status', currentParams.status)
  if (currentParams.role) closeParams.set('role', currentParams.role)
  if (currentParams.search) closeParams.set('search', currentParams.search)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <UserCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="font-bold text-gray-900">{profile?.email}</p>
              <p className="text-xs text-gray-400 mt-0.5">{profile?.display_name || 'Tanpa nama'}</p>
            </div>
          </div>
          <Link
            href={`/admin/users?${closeParams.toString()}`}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
          </Link>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Subscription */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-gray-400" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subscription</p>
            </div>
            {subscription ? (
              <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Status</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[subscription.status ?? ''] ?? 'bg-gray-100 text-gray-500'}`}>
                    {subscription.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Mulai</span>
                  <span className="font-medium text-gray-700">{subscription.started_at ? formatDate(subscription.started_at) : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Berakhir</span>
                  <span className="font-medium text-gray-700">{subscription.expires_at ? formatDate(subscription.expires_at) : '-'}</span>
                </div>
              </div>
            ) : trialDone ? (
              <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                <p className="text-sm text-green-600 font-medium">Trial 7 hari berhasil diaktifkan.</p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between">
                <p className="text-sm text-gray-400">Tidak ada subscription.</p>
                <button
                  onClick={handleActivateTrial}
                  disabled={trialLoading}
                  className="text-xs font-semibold px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  {trialLoading ? 'Memproses...' : 'Aktifkan Trial'}
                </button>
              </div>
            )}
            {trialError && <p className="text-xs text-red-500 mt-1">{trialError}</p>}
          </div>

          {/* Stores */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Store className="w-4 h-4 text-gray-400" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Stores ({stores.length})</p>
            </div>
            {stores.length > 0 ? (
              <ul className="space-y-2">
                {stores.map((store) => (
                  <li key={store.id} className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{store.name}</p>
                      <p className="text-xs text-gray-400 font-mono">/{store.slug}</p>
                    </div>
                    <a
                      href={`/${store.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 bg-gray-50 rounded-xl px-4 py-3">Tidak ada toko.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

