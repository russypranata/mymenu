'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createCategory(storeId: string, name: string): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  const { data: store } = await supabase.from('stores').select('id').eq('id', storeId).eq('user_id', user.id).single()
  if (!store) return { error: 'Toko tidak ditemukan.' }

  const { error } = await supabase.from('categories').insert({ store_id: storeId, name: name.trim() })
  if (error) return { error: error.message }

  revalidatePath(`/store/${storeId}/menu`)
  return { error: null }
}

export async function updateCategory(id: string, name: string): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  const { data: cat } = await supabase
    .from('categories').select('id, stores!inner(user_id)').eq('id', id).single() as {
      data: { id: string; stores: { user_id: string } } | null
    }
  if (!cat || cat.stores.user_id !== user.id) return { error: 'Akses ditolak.' }

  const { error } = await supabase.from('categories').update({ name: name.trim() }).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/store')
  return { error: null }
}

export async function deleteCategory(id: string): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  const { data: cat } = await supabase
    .from('categories').select('id, stores!inner(user_id)').eq('id', id).single() as {
      data: { id: string; stores: { user_id: string } } | null
    }
  if (!cat || cat.stores.user_id !== user.id) return { error: 'Akses ditolak.' }

  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/store')
  return { error: null }
}
