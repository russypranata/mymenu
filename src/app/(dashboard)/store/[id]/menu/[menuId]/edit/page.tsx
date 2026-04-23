import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { EditMenuForm } from '@/components/edit-menu-form'
import { getCategoriesByStore } from '@/lib/queries/menu'
import { Pencil } from 'lucide-react'

export default async function EditMenuPage({
  params,
}: {
  params: Promise<{ id: string; menuId: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { id, menuId } = await params

  const { data: store } = await supabase
    .from('stores').select('id, name').eq('id', id).eq('user_id', user.id).maybeSingle()
  if (!store) notFound()

  const { data: menu } = await supabase
    .from('menus').select('*').eq('id', menuId).eq('store_id', store.id).maybeSingle()
  if (!menu) notFound()

  const categories = await getCategoriesByStore(store.id)

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Edit Menu</h1>
            <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Pencil className="w-4 h-4 text-green-500" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{store.name} · {menu.name}</p>
        </div>
      </div>
      <EditMenuForm menu={menu} storeId={store.id} backHref={`/store/${store.id}/menu`} categories={categories} />
    </div>
  )
}
