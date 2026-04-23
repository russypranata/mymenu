import { createClient } from '@/lib/supabase/server'
import { Tables } from '@/types/database.types'

export type StoreLocation = Tables<'store_locations'>

export async function getStoreLocations(storeId: string): Promise<StoreLocation[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('store_locations')
    .select('*')
    .eq('store_id', storeId)
    .order('is_primary', { ascending: false })
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('Error fetching store locations:', error)
    return []
  }
  
  return data || []
}

export async function getPrimaryLocation(storeId: string): Promise<StoreLocation | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('store_locations')
    .select('*')
    .eq('store_id', storeId)
    .eq('is_primary', true)
    .single()
  
  if (error) {
    console.error('Error fetching primary location:', error)
    return null
  }
  
  return data
}

export async function getLocationById(locationId: string): Promise<StoreLocation | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('store_locations')
    .select('*')
    .eq('id', locationId)
    .single()
  
  if (error) {
    console.error('Error fetching location:', error)
    return null
  }
  
  return data
}
