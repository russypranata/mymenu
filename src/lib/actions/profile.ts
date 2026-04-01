'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// ─── Input Types ─────────────────────────────────────────────────────────────

export interface UpdateProfileInput {
  displayName: string
}

export interface UpdateEmailInput {
  newEmail: string
}

export interface UpdatePasswordInput {
  newPassword: string
  confirmPassword: string
}

export interface DeleteAccountInput {
  confirmEmail: string
}

type ActionResult = { error: string | null }

// ─── updateProfile ────────────────────────────────────────────────────────────

export async function updateProfile(input: UpdateProfileInput): Promise<ActionResult> {
  const { displayName } = input

  if (!displayName || displayName.length < 2) {
    return { error: 'Nama tampilan minimal 2 karakter.' }
  }
  if (displayName.length > 50) {
    return { error: 'Nama tampilan maksimal 50 karakter.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  const { error } = await supabase
    .from('profiles')
    .update({ display_name: displayName })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/profile')
  revalidatePath('/dashboard')
  return { error: null }
}

// ─── updateAvatar ─────────────────────────────────────────────────────────────

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'] as const
const MAX_SIZE = 2 * 1024 * 1024 // 2 MB

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export async function updateAvatar(formData: FormData): Promise<ActionResult> {
  const file = formData.get('avatar')

  if (!(file instanceof File)) {
    return { error: 'File tidak ditemukan.' }
  }

  if (!(ALLOWED_MIME as readonly string[]).includes(file.type)) {
    return { error: 'File harus berupa gambar JPEG, PNG, atau WebP.' }
  }

  if (file.size > MAX_SIZE) {
    return { error: 'Ukuran file maksimal 2 MB.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  const ext = MIME_TO_EXT[file.type]
  const path = `${user.id}/avatar.${ext}`

  // Hapus file lama (semua ekstensi yang mungkin)
  const oldPaths = ['jpg', 'png', 'webp'].map((e) => `${user.id}/avatar.${e}`)
  await supabase.storage.from('avatars').remove(oldPaths)

  const arrayBuffer = await file.arrayBuffer()
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, arrayBuffer, { contentType: file.type, upsert: true })

  if (uploadError) return { error: uploadError.message }

  const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)

  const { error: dbError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id)

  if (dbError) return { error: dbError.message }

  revalidatePath('/profile')
  revalidatePath('/dashboard')
  return { error: null }
}

// ─── updateEmail ──────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function updateEmail(input: UpdateEmailInput): Promise<ActionResult> {
  const { newEmail } = input

  if (!EMAIL_REGEX.test(newEmail)) {
    return { error: 'Format email tidak valid.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  const { error } = await supabase.auth.updateUser({ email: newEmail })
  if (error) return { error: error.message }

  return { error: null }
}

// ─── updatePassword ───────────────────────────────────────────────────────────

export async function updatePassword(input: UpdatePasswordInput): Promise<ActionResult> {
  const { newPassword, confirmPassword } = input

  if (newPassword.length < 8) {
    return { error: 'Password minimal 8 karakter.' }
  }

  if (newPassword !== confirmPassword) {
    return { error: 'Konfirmasi password tidak sesuai.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) return { error: error.message }

  return { error: null }
}

// ─── deleteAccount ────────────────────────────────────────────────────────────

export async function deleteAccount(input: DeleteAccountInput): Promise<ActionResult> {
  const { confirmEmail } = input

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tidak terautentikasi.' }

  if (confirmEmail !== user.email) {
    return { error: 'Email tidak sesuai. Penghapusan dibatalkan.' }
  }

  // Cleanup storage: hapus avatar
  const avatarPaths = ['jpg', 'png', 'webp'].map((e) => `${user.id}/avatar.${e}`)
  await supabase.storage.from('avatars').remove(avatarPaths)

  // Cleanup storage: hapus menu images milik user
  const { data: menuImages } = await supabase.storage
    .from('menu-images')
    .list(user.id)
  if (menuImages && menuImages.length > 0) {
    const paths = menuImages.map((f) => `${user.id}/${f.name}`)
    await supabase.storage.from('menu-images').remove(paths)
  }

  // Hapus dari tabel profiles (cascade akan hapus stores, menus, dll)
  const { error: profileError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', user.id)

  if (profileError) return { error: profileError.message }

  // Hapus dari auth.users via admin client (requires SERVICE_ROLE_KEY)
  const adminClient = createAdminClient()
  const { error: adminError } = await adminClient.auth.admin.deleteUser(user.id)
  if (adminError) return { error: adminError.message }

  await supabase.auth.signOut()
  redirect('/login')
}
