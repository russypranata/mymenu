import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import type { Database } from '@/types/database.types'

type Store = Database['public']['Tables']['stores']['Row']
type StoreWithSettings = Store & {
  store_settings: Database['public']['Tables']['store_settings']['Row'] | null
}

/**
 * Cached per-request — safe to call from both layout and page
 * without triggering duplicate DB queries in the same render pass.
 */
export const getStoresByUser = cache(async (userId: string): Promise<Store[]> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('user_id', userId)
  if (error) throw new Error(`[getStoresByUser] ${error.message}`)
  return (data as Store[] | null) ?? []
})

export async function getStoreBySlug(slug: string): Promise<StoreWithSettings | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('stores')
    .select('*, store_settings(*)')
    .eq('slug', slug)
    .maybeSingle()
  if (error) {
    logger.error('[getStoreBySlug]', error, { slug })
    throw new Error(`[getStoreBySlug] ${error.message}`)
  }
  return data as StoreWithSettings | null
}
