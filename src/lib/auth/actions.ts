'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function login(
  email: string,
  password: string
): Promise<{ error: string | null; redirectTo?: string }> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: 'Email atau password salah. Silakan coba lagi.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .maybeSingle()

  revalidatePath('/', 'layout')
  return { error: null, redirectTo: profile?.role === 'admin' ? '/admin' : '/dashboard' }
}

export async function register(
  email: string,
  password: string
): Promise<{ error: string | null; emailSent?: boolean }> {
  if (password.length < 8) return { error: 'Password minimal 8 karakter.' }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    const msg = error.message.includes('already registered')
      ? 'Email ini sudah terdaftar. Silakan masuk.'
      : 'Terjadi kesalahan. Silakan coba lagi.'
    return { error: msg }
  }

  // If session exists, user is auto-confirmed
  if (data.session) {
    revalidatePath('/', 'layout')
    // Send WA trial activation notification (fire and forget)
    // Phone not available at signup — will be sent when user adds store with WA number
    return { error: null, emailSent: false }
  }

  return { error: null, emailSent: true }
}

export async function forgotPassword(email: string): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
  })
  if (error) return { error: error.message }
  return { error: null }
}

export async function resetPassword(password: string): Promise<{ error: string | null }> {
  if (password.length < 8) return { error: 'Password minimal 8 karakter.' }
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: 'Gagal memperbarui password. Link mungkin sudah kadaluarsa.' }
  return { error: null }
}
