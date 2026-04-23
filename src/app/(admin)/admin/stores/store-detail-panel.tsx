'use client'

import Link from 'next/link'
import type { AdminStoreDetail } from '@/lib/queries/admin'
import { formatWhatsAppNumber } from '@/lib/utils'
import { X, ExternalLink, UtensilsCrossed, MapPin, Phone, User, Store } from 'lucide-react'

export function StoreDetailPanel({
  detail,
  currentSearch,
}: {
  detail: AdminStoreDetail
  currentSearch?: string
}) {
  const { store, owner, menuCount } = detail

  const closeHref = `/admin/stores${currentSearch ? `?search=${currentSearch}` : ''}`

  if (!store) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Store className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="font-bold text-gray-900">{store.name}</p>
              <p className="text-xs font-mono text-gray-400 mt-0.5">/{store.slug}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/${store.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Lihat Menu
            </a>
            <Link
              href={closeHref}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Owner */}
          <div className="flex items-start gap-3 bg-gray-50 rounded-xl px-4 py-3">
            <User className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Pemilik</p>
              <p className="text-sm font-semibold text-gray-900">{owner?.display_name || owner?.email || '-'}</p>
              {owner?.email && owner.display_name && (
                <p className="text-xs text-gray-400">{owner.email}</p>
              )}
            </div>
          </div>

          {/* Description */}
          {store.description && (
            <div className="bg-gray-50 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-400 mb-1">Deskripsi</p>
              <p className="text-sm text-gray-700">{store.description}</p>
            </div>
          )}

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <UtensilsCrossed className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Total Menu</p>
                <p className="text-xl font-extrabold text-gray-900">{menuCount}</p>
              </div>
            </div>
            {(store as any).whatsapp && (
              <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">WhatsApp</p>
                  <p className="text-sm font-semibold text-gray-900">{formatWhatsAppNumber((store as any).whatsapp)}</p>
                </div>
              </div>
            )}
          </div>

          {(store as any).address && (
            <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Alamat</p>
                <p className="text-sm text-gray-700">{(store as any).address}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

