import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Store, Plus } from 'lucide-react'
import { NewMenuForm } from '@/components/new-menu-form'
import { getStoresByUser } from '@/lib/queries/store'
import { getCategoriesByStore } from '@/lib/queries/menu'

export default async function NewMenuPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const stores = await getStoresByUser(user.id)

  if (!stores.length) {
    return (
      <div className="max-w-md text-center py-20">
        <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Store className="w-7 h-7 text-green-400" />
        </div>
        <h2 className="text-base font-bold text-gray-900 mb-2">Belum ada toko</h2>
        <p className="text-sm text-gray-500 mb-6">Buat toko terlebih dahulu sebelum menambahkan menu.</p>
        <Link href="/store/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors">
          <Plus className="w-4 h-4" />
          Buat Toko
        </Link>
      </div>
    )
  }

  // If multiple stores, redirect to store list to pick one
  if (stores.length > 1) redirect('/store')

  const activeStore = stores[0]
  const categories = await getCategoriesByStore(activeStore.id)

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Tambah Menu Baru</h1>
        <p className="text-sm text-gray-500 mt-1">{activeStore.name}</p>
      </div>
      <NewMenuForm storeId={activeStore.id} backHref={`/store/${activeStore.id}/menu`} categories={categories} />
    </div>
  )
}
