import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Plus, UtensilsCrossed, Settings, ExternalLink } from 'lucide-react'
import { MenuList } from '@/components/menu-list'
import { getMenusByStore, getCategoriesByStore } from '@/lib/queries/menu'
import { StatusFilter } from '@/components/status-filter'

export default async function StoreMenuPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { id } = await params
  const { data: store } = await supabase
    .from('stores')
    .select('id, name, slug')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!store) notFound()

  const { q, status } = await searchParams
  const [menus, categories] = await Promise.all([
    getMenusByStore(store.id, { q, status }),
    getCategoriesByStore(store.id),
  ])

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Menu</h1>
              <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <UtensilsCrossed className="w-4 h-4 text-green-500" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm text-gray-500">{store.name}</span>
              <span className="text-gray-300">·</span>
              <span className="text-sm text-gray-400">{menus.length} item</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/${store.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-xl transition-colors"
            title="Lihat menu publik"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <Link
            href={`/store/${store.id}/settings`}
            className="p-2.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            title="Pengaturan toko"
          >
            <Settings className="w-4 h-4" />
          </Link>
          <Link
            href={`/store/${store.id}/menu/new`}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tambah Menu</span>
            <span className="sm:hidden">Tambah</span>
          </Link>
        </div>
      </div>

      {/* Search & filter */}
      <form method="GET" className="flex flex-col sm:flex-row gap-2.5">
        <input
          type="search" name="q" defaultValue={q}
          placeholder="Cari nama menu..."
          className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all"
        />
        <StatusFilter currentStatus={status} baseHref={`/store/${store.id}/menu`} />
        <button type="submit" className="px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors">
          Cari
        </button>
        {(q || status) && (
          <Link href={`/store/${store.id}/menu`} className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors text-center">
            Reset
          </Link>
        )}
      </form>

      {menus.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed className="w-7 h-7 text-green-400" />
          </div>
          {q || status ? (
            <>
              <h3 className="text-base font-bold text-gray-900 mb-1">Tidak ada hasil</h3>
              <p className="text-sm text-gray-500 mb-4">Coba ubah kata kunci atau filter pencarian.</p>
              <Link href={`/store/${store.id}/menu`} className="text-sm text-green-500 font-semibold hover:text-green-600">Lihat semua menu</Link>
            </>
          ) : (
            <>
              <h3 className="text-base font-bold text-gray-900 mb-1">Belum ada menu</h3>
              <p className="text-sm text-gray-500 mb-6">Mulai tambahkan item menu untuk toko ini.</p>
              <Link href={`/store/${store.id}/menu/new`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors">
                <Plus className="w-4 h-4" />
                Tambah Menu Pertama
              </Link>
            </>
          )}
        </div>
      ) : (
        <MenuList initialMenus={menus} storeId={store.id} />
      )}
    </div>
  )
}
