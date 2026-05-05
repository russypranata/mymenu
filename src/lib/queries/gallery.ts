import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database.types'

export type GalleryPhoto = Database['public']['Tables']['store_gallery']['Row']

/**
 * Ambil semua foto galeri untuk sebuah toko, diurutkan berdasarkan sort_order.
 * Mengembalikan array kosong jika tidak ada foto.
 */
export async function getGalleryByStore(storeId: string): Promise<GalleryPhoto[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('store_gallery')
    .select('*')
    .eq('store_id', storeId)
    .order('sort_order', { ascending: true })

  if (error) throw new Error(`[getGalleryByStore] ${error.message}`)
  return data ?? []
}
