import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { NewMenuForm } from '@/components/new-menu-form'
import { getCategoriesByStore } from '@/lib/queries/menu'
import { UtensilsCrossed } from 'lucide-react'

export default async function NewStoreMenuPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { id } = await params
  const { data: store } = await supabase
    .from('stores')
    .select('id, name')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!store) notFound()

  const categories = await getCategoriesByStore(store.id)

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <UtensilsCrossed className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Tambah Menu Baru</h1>
          <p className="text-sm text-gray-500 mt-0.5">{store.name}</p>
        </div>
      </div>
      <NewMenuForm storeId={store.id} backHref={`/store/${store.id}/menu`} categories={categories} />
    </div>
  )
}
