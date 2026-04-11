import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database.types'

type Menu = Database['public']['Tables']['menus']['Row']
type Category = Database['public']['Tables']['categories']['Row']

export interface MenuFilters {
  q?: string
  status?: string
}

export async function getMenusByStore(storeId: string, filters?: MenuFilters): Promise<Menu[]> {
  const supabase = await createClient()

  let query = supabase
    .from('menus')
    .select('*')
    .eq('store_id', storeId)
    .order('order', { ascending: true, nullsFirst: false })

  if (filters?.q) query = query.ilike('name', `%${filters.q}%`)
  if (filters?.status === 'active') query = query.eq('is_active', true)
  if (filters?.status === 'inactive') query = query.eq('is_active', false)

  const { data, error } = await query
  if (error) throw new Error(`[getMenusByStore] ${error.message}`)
  return (data as Menu[] | null) ?? []
}

export async function getActiveMenusByStore(storeId: string): Promise<Menu[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('menus')
    .select('*')
    .eq('store_id', storeId)
    .eq('is_active', true)
    .order('order', { ascending: true, nullsFirst: false })
  if (error) throw new Error(`[getActiveMenusByStore] ${error.message}`)
  return (data as Menu[] | null) ?? []
}

export async function getCategoriesByStore(storeId: string): Promise<Category[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('store_id', storeId)
    .order('order', { ascending: true })
  if (error) throw new Error(`[getCategoriesByStore] ${error.message}`)
  return (data as Category[] | null) ?? []
}

export async function getMenuCount(storeIds: string[]): Promise<number> {
  if (storeIds.length === 0) return 0
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('menus')
    .select('*', { count: 'exact', head: true })
    .in('store_id', storeIds)
  if (error) throw new Error(`[getMenuCount] ${error.message}`)
  return count ?? 0
}
