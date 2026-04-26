import { getAdminStores, getAdminStoreDetail } from '@/lib/queries/admin'
import { formatDate } from '@/lib/utils'
import { StoreSearch } from './store-search'
import { StoreDetailPanel } from './store-detail-panel'
import { AdminPagination } from '@/components/admin-pagination'
import { Store } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stores — Admin Menuly',
}

const PAGE_SIZE = 20

export default async function AdminStoresPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; storeId?: string; page?: string }>
}) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page ?? 1))
  const { data: stores, total } = await getAdminStores(params.search, page, PAGE_SIZE)

  const selectedStore = params.storeId
    ? await getAdminStoreDetail(params.storeId)
    : null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <Store className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Stores</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} toko ditemukan.</p>
        </div>
      </div>

      <StoreSearch currentSearch={params.search} />

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Nama Toko</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Slug</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Pemilik</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Dibuat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stores.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-14 text-center text-gray-400">
                    Tidak ada toko ditemukan.
                  </td>
                </tr>
              ) : (
                stores.map((store) => (
                  <tr key={store.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <a
                        href={`/admin/stores?${new URLSearchParams({ ...(params.search ? { search: params.search } : {}), storeId: store.id }).toString()}`}
                        className="text-gray-900 hover:text-red-500 transition-colors font-medium"
                      >
                        {store.name}
                      </a>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
                        /{store.slug}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">
                      {store.profiles?.display_name || store.profiles?.email || '-'}
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                      {store.created_at ? formatDate(store.created_at) : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="sm:hidden divide-y divide-gray-50">
          {stores.length === 0 ? (
            <p className="px-5 py-14 text-center text-gray-400 text-sm">Tidak ada toko ditemukan.</p>
          ) : (
            stores.map((store) => (
              <div key={store.id} className="px-4 py-4 space-y-1.5">
                <a
                  href={`/admin/stores?${new URLSearchParams({ ...(params.search ? { search: params.search } : {}), storeId: store.id }).toString()}`}
                  className="text-sm font-semibold text-gray-900 hover:text-green-500 transition-colors block"
                >
                  {store.name}
                </a>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">/{store.slug}</span>
                  <span className="text-xs text-gray-400">{store.created_at ? formatDate(store.created_at) : '-'}</span>
                </div>
                <p className="text-xs text-gray-500">{store.profiles?.display_name || store.profiles?.email || '-'}</p>
              </div>
            ))
          )}
        </div>

        <AdminPagination total={total} page={page} pageSize={PAGE_SIZE} />
      </div>

      {selectedStore && params.storeId && (
        <StoreDetailPanel detail={selectedStore} currentSearch={params.search} />
      )}
    </div>
  )
}
