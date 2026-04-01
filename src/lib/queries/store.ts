import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database.types'

type Store = Database['public']['Tables']['stores']['Row']
type StoreWithSettings = Store & {
  store_settings: Database['public']['Tables']['store_settings']['Row'] | null
}

export async function getStoresByUser(userId: string): Promise<Store[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('user_id', userId)
  if (error) console.error('[getStoresByUser]', error.message)
  return (data as Store[] | null) ?? []
}

export async function getStoreBySlug(slug: string): Promise<StoreWithSettings | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('stores')
    .select('*, store_settings(*)')
    .eq('slug', slug)
    .maybeSingle()
  if (error) console.error('[getStoreBySlug]', error.message)
  return data as StoreWithSettings | null
}
