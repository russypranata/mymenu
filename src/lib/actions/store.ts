'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireSubscription } from '@/lib/subscription'
import type { Database } from '@/types/database.types'

type StoreInsert = Database['public']['Tables']['stores']['Insert']

export interface CreateStoreInput {
  name: string
  slug: string
  description?: string | null
  whatsapp?: string | null
  address?: string | null
}

export async function checkSlugAvailable(slug: string): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('stores')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()
  return !data
}

export async function createStore(input: CreateStoreInput): Promise<{ error: string | null; storeId?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  // Enforce subscription — pass existing client to avoid double instantiation
  const { valid, error: subError } = await requireSubscription(supabase)
  if (!valid) return { error: subError }

  // Double-check slug availability server-side
  const { data: slugConflict } = await supabase.from('stores').select('id').eq('slug', input.slug).maybeSingle()
  if (slugConflict) return { error: 'URL toko sudah digunakan. Coba nama lain.' }

  const payload: StoreInsert = {
    user_id: user.id,
    name: input.name,
    slug: input.slug,
    description: input.description ?? null,
    whatsapp: input.whatsapp ?? null,
    address: input.address ?? null,
  }

  const { data: newStore, error } = await supabase.from('stores').insert(payload).select('id').single()
  if (error) return { error: error.message }

  // Create primary location if address or whatsapp provided
  if (newStore && (input.address || input.whatsapp)) {
    await supabase.from('store_locations').insert({
      store_id: newStore.id,
      name: 'Lokasi Utama',
      address: input.address || '',
      whatsapp: input.whatsapp || null,
      is_primary: true,
    })
  }

  revalidatePath('/store')
  revalidatePath('/dashboard')
  return { error: null, storeId: newStore.id }
}

export interface UpdateStoreInput {
  id: string
  name: string
  slug: string
  description?: string | null
  whatsapp?: string | null
}

export async function updateStore(input: UpdateStoreInput): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  // Verify ownership
  const { data: store } = await supabase.from('stores').select('id').eq('id', input.id).eq('user_id', user.id).single()
  if (!store) return { error: 'Toko tidak ditemukan atau akses ditolak.' }

  // Check slug uniqueness (exclude current store)
  const { data: slugConflict } = await supabase.from('stores').select('id').eq('slug', input.slug).neq('id', input.id).maybeSingle()
  if (slugConflict) return { error: 'URL toko sudah digunakan. Coba nama lain.' }

  const { error } = await supabase.from('stores').update({
    name: input.name,
    slug: input.slug,
    description: input.description ?? null,
    whatsapp: input.whatsapp ?? null,
  }).eq('id', input.id)

  if (error) return { error: error.message }
  revalidatePath('/store')
  revalidatePath('/dashboard')
  revalidatePath(`/[slug]`, 'page')
  return { error: null }
}

export async function deleteStore(storeId: string): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  const { data: store } = await supabase.from('stores').select('id').eq('id', storeId).eq('user_id', user.id).single()
  if (!store) return { error: 'Toko tidak ditemukan atau akses ditolak.' }

  const { error } = await supabase.from('stores').delete().eq('id', storeId)
  if (error) return { error: error.message }

  revalidatePath('/store')
  revalidatePath('/dashboard')
  return { error: null }
}

export async function uploadStoreAsset(
  formData: FormData,
  field: 'logo' | 'banner'
): Promise<{ url: string | null; error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { url: null, error: 'Tidak terautentikasi.' }

  const file = formData.get(field) as File | null
  if (!file || file.size === 0) return { url: null, error: 'File tidak ditemukan.' }

  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowed.includes(file.type)) return { url: null, error: 'File harus JPEG, PNG, atau WebP.' }
  if (file.size > 3 * 1024 * 1024) return { url: null, error: 'Ukuran file maksimal 3 MB.' }

  const ext = file.name.split('.').pop()
  const path = `${user.id}/${field}-${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('store-assets')
    .upload(path, file, { upsert: true })

  if (uploadError) return { url: null, error: uploadError.message }

  const { data } = supabase.storage.from('store-assets').getPublicUrl(path)
  return { url: data.publicUrl, error: null }
}

export interface UpdateStoreSettingsInput {
  storeId: string
  logoUrl?: string | null
  bannerUrl?: string | null
  primaryColor?: string | null
  theme?: string | null
  openingHours?: string | null
  whatsappButtonText?: string | null
  showPrice?: boolean | null
  enableOrdering?: boolean | null
  font?: string | null
  menuLayout?: string | null
  instagram?: string | null
  facebook?: string | null
  tiktok?: string | null
}

export async function updateStoreSettings(
  input: UpdateStoreSettingsInput
): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  const { data: store } = await supabase
    .from('stores').select('id, whatsapp').eq('id', input.storeId).eq('user_id', user.id).single()
  if (!store) return { error: 'Toko tidak ditemukan atau akses ditolak.' }

  // Auto-disable ordering if WhatsApp is empty
  let finalEnableOrdering = input.enableOrdering
  if (input.enableOrdering !== undefined && input.enableOrdering === true) {
    if (!store.whatsapp || store.whatsapp.trim() === '') {
      finalEnableOrdering = false
    }
  }

  const { error } = await supabase.from('store_settings').upsert({
    store_id: input.storeId,
    ...(input.logoUrl !== undefined && { logo_url: input.logoUrl }),
    ...(input.bannerUrl !== undefined && { banner_url: input.bannerUrl }),
    ...(input.primaryColor !== undefined && { primary_color: input.primaryColor }),
    ...(input.theme !== undefined && { theme: input.theme }),
    ...(input.openingHours !== undefined && { opening_hours: input.openingHours }),
    ...(input.whatsappButtonText !== undefined && { whatsapp_button_text: input.whatsappButtonText }),
    ...(input.showPrice !== undefined && { show_price: input.showPrice }),
    ...(finalEnableOrdering !== undefined && { enable_ordering: finalEnableOrdering }),
    ...(input.font !== undefined && { font: input.font }),
    ...(input.menuLayout !== undefined && { menu_layout: input.menuLayout }),
    ...(input.instagram !== undefined && { instagram: input.instagram }),
    ...(input.facebook !== undefined && { facebook: input.facebook }),
    ...(input.tiktok !== undefined && { tiktok: input.tiktok }),
  }, { onConflict: 'store_id' })

  if (error) return { error: error.message }
  revalidatePath('/store')
  return { error: null }
}
