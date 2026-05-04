import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Store, ExternalLink, Settings, UtensilsCrossed } from 'lucide-react'
import type { Metadata } from 'next'
import { getStoresByUser } from '@/lib/queries/store'
import { StoreDeleteButton } from '@/components/store-delete-button'
import { StoreQRModal } from '@/components/store-qr-modal'
import { CopyUrlButton } from '@/components/copy-url-button'

export const metadata: Metadata = {
  title: 'Toko Saya — Menuly',
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mymenu.id'

export default async function StorePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const stores = await getStoresByUser(user.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Toko Saya</h1>
            <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Store className="w-4 h-4 text-green-500" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            {stores.length === 0
              ? 'Buat halaman menu digital yang bisa dibagikan via link & QR code'
              : 'Halaman menu digital Anda yang bisa dibagikan via link & QR code'}
          </p>
        </div>
      </div>
        {stores.length === 0 && (
          <Link
            href="/store/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors"
          >
            <Store className="w-4 h-4" />
            <span className="hidden sm:inline">Buat Toko</span>
            <span className="sm:hidden">Buat</span>
          </Link>
        )}
      </div>

      {stores.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Store className="w-7 h-7 text-green-400" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">Belum ada toko</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">Buat toko pertama Anda untuk mulai mengelola menu digital.</p>
          <Link
            href="/store/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors"
          >
            <Store className="w-4 h-4" />
            Buat Toko Sekarang
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-3.5 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Daftar Toko</p>
            <p className="text-xs text-gray-400">{stores.length} toko</p>
          </div>
          <ul className="divide-y divide-gray-50">
            {stores.map((store, index) => (
              <li key={store.id} className="px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-gray-50/50 transition-colors">
                {/* Store info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-gray-400">{index + 1}</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Store className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{store.name}</p>
                    {store.description && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{store.description}</p>
                    )}
                    <p className="text-xs font-mono text-gray-400 mt-0.5 truncate">/{store.slug}</p>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0 sm:pl-0 ml-auto sm:ml-0">
                  <Link
                    href={`/${store.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-green-500 rounded-lg hover:bg-green-50 transition-colors"
                    title="Lihat menu publik"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <StoreQRModal slug={store.slug} storeName={store.name} appUrl={APP_URL} />
                  <CopyUrlButton url={`${APP_URL}/${store.slug}`} />
                  <Link
                    href={`/store/${store.id}/menu`}
                    className="p-2 text-gray-400 hover:text-green-500 rounded-lg hover:bg-green-50 transition-colors"
                    title="Kelola menu"
                  >
                    <UtensilsCrossed className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/store/${store.id}/settings`}
                    className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Pengaturan toko"
                  >
                    <Settings className="w-4 h-4" />
                  </Link>
                  <StoreDeleteButton storeId={store.id} storeName={store.name} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
