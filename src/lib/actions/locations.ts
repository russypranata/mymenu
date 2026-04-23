'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const locationSchema = z.object({
  name: z.string().min(1, 'Nama lokasi wajib diisi').max(255),
  address: z.string().min(1, 'Alamat wajib diisi'),
  opening_hours: z.string().optional(),
  is_primary: z.boolean().optional(),
})

export async function createLocation(storeId: string, formData: FormData) {
  const supabase = await createClient()
  
  const data = {
    name: formData.get('name') as string,
    address: formData.get('address') as string,
    opening_hours: formData.get('opening_hours') as string || null,
    is_primary: formData.get('is_primary') === 'true',
  }
  
  const validation = locationSchema.safeParse(data)
  if (!validation.success) {
    return { error: validation.error.issues[0].message }
  }
  
  // Verify store ownership
  const { data: store } = await supabase
    .from('stores')
    .select('user_id')
    .eq('id', storeId)
    .single()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || store?.user_id !== user.id) {
    return { error: 'Unauthorized' }
  }
  
  const { error } = await supabase
    .from('store_locations')
    .insert({
      store_id: storeId,
      ...validation.data,
    })
  
  if (error) {
    console.error('Error creating location:', error)
    return { error: 'Gagal menambahkan lokasi' }
  }
  
  revalidatePath(`/dashboard/store/${storeId}/settings`)
  revalidatePath(`/[slug]`, 'page')
  
  return { success: true }
}

export async function updateLocation(locationId: string, formData: FormData) {
  const supabase = await createClient()
  
  const data = {
    name: formData.get('name') as string,
    address: formData.get('address') as string,
    opening_hours: formData.get('opening_hours') as string || null,
    is_primary: formData.get('is_primary') === 'true',
  }
  
  const validation = locationSchema.safeParse(data)
  if (!validation.success) {
    return { error: validation.error.issues[0].message }
  }
  
  // Verify ownership
  const { data: location } = await supabase
    .from('store_locations')
    .select('store_id, stores!inner(user_id)')
    .eq('id', locationId)
    .single()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || !location || (location.stores as any).user_id !== user.id) {
    return { error: 'Unauthorized' }
  }
  
  const { error } = await supabase
    .from('store_locations')
    .update({
      ...validation.data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', locationId)
  
  if (error) {
    console.error('Error updating location:', error)
    return { error: 'Gagal mengupdate lokasi' }
  }
  
  revalidatePath(`/dashboard/store/${location.store_id}/settings`)
  revalidatePath(`/[slug]`, 'page')
  
  return { success: true }
}

export async function deleteLocation(locationId: string) {
  const supabase = await createClient()
  
  // Verify ownership
  const { data: location } = await supabase
    .from('store_locations')
    .select('store_id, is_primary, stores!inner(user_id)')
    .eq('id', locationId)
    .single()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || !location || (location.stores as any).user_id !== user.id) {
    return { error: 'Unauthorized' }
  }
  
  // Prevent deleting primary location if it's the only one
  if (location.is_primary) {
    const { count } = await supabase
      .from('store_locations')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', location.store_id)
    
    if (count === 1) {
      return { error: 'Tidak dapat menghapus lokasi utama jika hanya ada satu lokasi' }
    }
  }
  
  const { error } = await supabase
    .from('store_locations')
    .delete()
    .eq('id', locationId)
  
  if (error) {
    console.error('Error deleting location:', error)
    return { error: 'Gagal menghapus lokasi' }
  }
  
  revalidatePath(`/dashboard/store/${location.store_id}/settings`)
  revalidatePath(`/[slug]`, 'page')
  
  return { success: true }
}
