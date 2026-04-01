'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireSubscription } from '@/lib/subscription'
import type { Database } from '@/types/database.types'

type MenuInsert = Database['public']['Tables']['menus']['Insert']
type MenuUpdate = Database['public']['Tables']['menus']['Update']

export interface CreateMenuInput {
  storeId: string
  name: string
  price: number
  description?: string | null
  imageUrl?: string | null
  extraImages?: string[]
  categoryId?: string | null
}

export async function uploadMenuImage(formData: FormData): Promise<{ url: string | null; error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { url: null, error: 'Tidak terautentikasi.' }

  const file = formData.get('image') as File | null
  if (!file || file.size === 0) return { url: null, error: 'File tidak ditemukan.' }

  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowed.includes(file.type)) return { url: null, error: 'File harus JPEG, PNG, atau WebP.' }
  if (file.size > 2 * 1024 * 1024) return { url: null, error: 'Ukuran file maksimal 2 MB.' }

  const ext = file.name.split('.').pop()
  const path = `${user.id}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('menu-images')
    .upload(path, file, { upsert: true })

  if (uploadError) return { url: null, error: uploadError.message }

  const { data } = supabase.storage.from('menu-images').getPublicUrl(path)
  return { url: data.publicUrl, error: null }
}

export async function createMenu(input: CreateMenuInput): Promise<{ error: string | null }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  // Enforce subscription
  const { valid, error: subError } = await requireSubscription()
  if (!valid) return { error: subError }

  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('id', input.storeId)
    .eq('user_id', user.id)
    .single()

  if (!store) return { error: 'Toko tidak ditemukan atau akses ditolak.' }

  const payload: MenuInsert = {
    store_id: input.storeId,
    name: input.name,
    description: input.description ?? null,
    price: input.price,
    category_id: input.categoryId ?? null,
    image_url: input.imageUrl ?? null,
    extra_images: input.extraImages ?? [],
    is_active: true,
  }

  const { error } = await supabase.from('menus').insert(payload)
  if (error) return { error: error.message }

  revalidatePath('/menu')
  revalidatePath(`/store/${input.storeId}/menu`)
  return { error: null }
}

export async function toggleMenuStatus(
  menuId: string,
  isActive: boolean
): Promise<{ error: string | null }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  // Verify ownership via store
  const { data: menu } = await supabase
    .from('menus')
    .select('id, stores!inner(user_id)')
    .eq('id', menuId)
    .single() as { data: { id: string; stores: { user_id: string } } | null }

  if (!menu || (menu.stores as { user_id: string }).user_id !== user.id) {
    return { error: 'Menu tidak ditemukan atau akses ditolak.' }
  }

  const update: MenuUpdate = { is_active: isActive }
  const { error } = await supabase.from('menus').update(update).eq('id', menuId)
  if (error) return { error: error.message }

  revalidatePath('/menu')
  revalidatePath('/store', 'layout')
  return { error: null }
}

export async function deleteMenu(menuId: string): Promise<{ error: string | null }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  // Verify ownership via store
  const { data: menu } = await supabase
    .from('menus')
    .select('id, stores!inner(user_id)')
    .eq('id', menuId)
    .single() as { data: { id: string; stores: { user_id: string } } | null }

  if (!menu || (menu.stores as { user_id: string }).user_id !== user.id) {
    return { error: 'Menu tidak ditemukan atau akses ditolak.' }
  }

  const { error } = await supabase.from('menus').delete().eq('id', menuId)
  if (error) return { error: error.message }

  revalidatePath('/menu')
  revalidatePath('/store', 'layout')
  return { error: null }
}

export interface UpdateMenuInput {
  id: string
  name: string
  price: number
  description?: string | null
  imageUrl?: string | null
  extraImages?: string[]
  categoryId?: string | null
}

export async function updateMenu(input: UpdateMenuInput): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  // Verify ownership via store
  const { data: menu } = await supabase
    .from('menus')
    .select('id, stores!inner(user_id)')
    .eq('id', input.id)
    .single() as { data: { id: string; stores: { user_id: string } } | null }

  if (!menu || (menu.stores as { user_id: string }).user_id !== user.id) {
    return { error: 'Menu tidak ditemukan atau akses ditolak.' }
  }

  const { error } = await supabase.from('menus').update({
    name: input.name,
    description: input.description ?? null,
    price: input.price,
    image_url: input.imageUrl ?? null,
    extra_images: input.extraImages ?? [],
    category_id: input.categoryId ?? null,
  }).eq('id', input.id)

  if (error) return { error: error.message }
  revalidatePath('/store', 'layout')
  revalidatePath('/menu')
  return { error: null }
}
