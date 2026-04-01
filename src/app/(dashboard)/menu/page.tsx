import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getStoresByUser } from '@/lib/queries/store'

export default async function MenuPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const stores = await getStoresByUser(user.id)

  if (stores.length === 1) {
    redirect(`/store/${stores[0].id}/menu`)
  }

  redirect('/store')
}
