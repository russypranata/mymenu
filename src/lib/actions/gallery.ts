'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const MAX_PHOTOS = 12
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp']
const BUCKET = 'store-gallery'

// ── Helper: verifikasi ownership toko ──────────────────────────────────────
async function verifyStoreOwner(storeId: string): Promise<{ userId: string; error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { userId: '', error: 'Tidak terautentikasi.' }

  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('id', storeId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!store) return { userId: '', error: 'Toko tidak ditemukan atau akses ditolak.' }
  return { userId: user.id, error: null }
}

// ── Upload foto baru ke galeri ──────────────────────────────────────────────
export async function uploadGalleryPhoto(
  formData: FormData,
  storeId: string
): Promise<{ error: string | null }> {
  const supabase = await createClient()

  const { error: authError } = await verifyStoreOwner(storeId)
  if (authError) return { error: authError }

  const file = formData.get('photo') as File | null
  if (!file) return { error: 'File tidak ditemukan.' }

  // Validasi tipe file
  if (!ALLOWED_MIME.includes(file.type)) {
    return { error: 'File harus berupa gambar JPEG, PNG, atau WebP.' }
  }

  // Validasi ukuran file
  if (file.size > MAX_FILE_SIZE) {
    return { error: 'Ukuran file maksimal 5 MB.' }
  }

  // Cek batas maksimum foto
  const { count } = await supabase
    .from('store_gallery')
    .select('id', { count: 'exact', head: true })
    .eq('store_id', storeId)

  if ((count ?? 0) >= MAX_PHOTOS) {
    return { error: `Maksimal ${MAX_PHOTOS} foto per toko.` }
  }

  // Tentukan ekstensi dan path
  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
  const uuid = crypto.randomUUID()
  const path = `${storeId}/${uuid}.${ext}`

  // Upload ke storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false })

  if (uploadError) return { error: 'Gagal mengupload foto. Silakan coba lagi.' }

  // Ambil public URL
  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path)

  // Simpan ke database dengan sort_order = jumlah foto saat ini
  const { error: dbError } = await supabase
    .from('store_gallery')
    .insert({
      store_id: storeId,
      image_url: publicUrl,
      sort_order: count ?? 0,
    })

  if (dbError) {
    // Rollback: hapus file yang sudah diupload
    await supabase.storage.from(BUCKET).remove([path])
    return { error: dbError.message }
  }

  revalidatePath(`/store/${storeId}/settings`)
  return { error: null }
}

// ── Update caption foto ─────────────────────────────────────────────────────
export async function updateGalleryCaption(
  photoId: string,
  caption: string
): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  // Validasi panjang caption
  if (caption.length > 80) {
    return { error: 'Caption maksimal 80 karakter.' }
  }

  // Verifikasi ownership via join
  const { data: photo } = await supabase
    .from('store_gallery')
    .select('id, store_id, stores!inner(user_id)')
    .eq('id', photoId)
    .maybeSingle() as {
      data: { id: string; store_id: string; stores: { user_id: string } } | null
    }

  if (!photo || photo.stores.user_id !== user.id) {
    return { error: 'Akses ditolak.' }
  }

  const { error } = await supabase
    .from('store_gallery')
    .update({ caption: caption.trim() || null })
    .eq('id', photoId)

  if (error) return { error: error.message }

  revalidatePath(`/store/${photo.store_id}/settings`)
  return { error: null }
}

// ── Hapus foto dari galeri ──────────────────────────────────────────────────
export async function deleteGalleryPhoto(
  photoId: string,
  imageUrl: string,
  storeId: string
): Promise<{ error: string | null }> {
  const supabase = await createClient()

  const { error: authError } = await verifyStoreOwner(storeId)
  if (authError) return { error: authError }

  // Ekstrak path dari URL untuk hapus dari storage
  // URL format: .../storage/v1/object/public/store-gallery/{store_id}/{uuid}.ext
  const urlParts = imageUrl.split(`/${BUCKET}/`)
  if (urlParts.length === 2) {
    const storagePath = urlParts[1]
    await supabase.storage.from(BUCKET).remove([storagePath])
    // Lanjutkan meski storage gagal — tetap hapus dari DB
  }

  const { error } = await supabase
    .from('store_gallery')
    .delete()
    .eq('id', photoId)
    .eq('store_id', storeId)

  if (error) return { error: error.message }

  revalidatePath(`/store/${storeId}/settings`)
  return { error: null }
}

// ── Reorder foto (batch update sort_order) ──────────────────────────────────
export async function reorderGalleryPhotos(
  storeId: string,
  photos: { id: string; sort_order: number }[]
): Promise<{ error: string | null }> {
  const supabase = await createClient()

  const { error: authError } = await verifyStoreOwner(storeId)
  if (authError) return { error: authError }

  // Batch update menggunakan Promise.all
  const updates = photos.map(({ id, sort_order }) =>
    supabase
      .from('store_gallery')
      .update({ sort_order })
      .eq('id', id)
      .eq('store_id', storeId)
  )

  const results = await Promise.all(updates)
  const failed = results.find(r => r.error)
  if (failed?.error) return { error: failed.error.message }

  revalidatePath(`/store/${storeId}/settings`)
  return { error: null }
}

// ── Toggle gallery_enabled di store_settings ────────────────────────────────
export async function toggleGallery(
  storeId: string,
  enabled: boolean
): Promise<{ error: string | null }> {
  const supabase = await createClient()

  const { error: authError } = await verifyStoreOwner(storeId)
  if (authError) return { error: authError }

  const { error } = await supabase
    .from('store_settings')
    .upsert(
      { store_id: storeId, gallery_enabled: enabled },
      { onConflict: 'store_id' }
    )

  if (error) return { error: error.message }

  revalidatePath(`/store/${storeId}/settings`)
  // Revalidate halaman publik juga agar galeri langsung muncul/hilang
  revalidatePath('/[slug]', 'page')
  return { error: null }
}
