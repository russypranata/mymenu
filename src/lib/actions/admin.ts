'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { sendWhatsApp, msgSubscriptionActivated, msgTrialExpired, msgTrialExpiringSoon } from '@/lib/whatsapp'

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase: null, user: null, error: 'Tidak terautentikasi.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return { supabase: null, user: null, error: 'Akses ditolak.' }

  return { supabase, user, error: null }
}

export async function updateUserStatus(
  userId: string,
  status: 'active' | 'inactive' | 'suspended'
): Promise<{ error: string | null }> {
  const { supabase, user, error: authError } = await verifyAdmin()
  if (authError || !supabase || !user) return { error: authError }

  if (userId === user.id) return { error: 'Tidak dapat mengubah status akun sendiri.' }

  const { error } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', userId)

  if (error) return { error: error.message }

  revalidatePath('/admin/users')
  return { error: null }
}

export async function createTrialSubscription(
  userId: string
): Promise<{ error: string | null }> {
  const { supabase, error: authError } = await verifyAdmin()
  if (authError || !supabase) return { error: authError }

  const today = new Date()
  const expiresAt = new Date(today)
  expiresAt.setDate(expiresAt.getDate() + 3)

  const { error } = await supabase.from('subscriptions').insert({
    user_id: userId,
    status: 'trial',
    started_at: today.toISOString(),
    expires_at: expiresAt.toISOString(),
    plan_type: 'monthly',
  })

  if (error) return { error: error.message }

  revalidatePath('/admin/subscriptions')
  return { error: null }
}

export async function updateSubscription(
  subscriptionId: string,
  data: { status?: string; expires_at?: string; plan_type?: 'monthly' | 'annual' }
): Promise<{ error: string | null }> {
  const { supabase, error: authError } = await verifyAdmin()
  if (authError || !supabase) return { error: authError }

  if (data.plan_type && !['monthly', 'annual'].includes(data.plan_type)) {
    return { error: 'Jenis paket tidak valid.' }
  }

  // Fetch subscription + user info for WA notification
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id, plan_type')
    .eq('id', subscriptionId)
    .maybeSingle()

  const { error } = await supabase
    .from('subscriptions')
    .update(data)
    .eq('id', subscriptionId)

  if (error) return { error: error.message }

  // Send WA notification if activating subscription
  if (sub && (data.status === 'active' || data.status === 'trial')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, email')
      .eq('id', sub.user_id)
      .maybeSingle()
    const { data: store } = await supabase
      .from('stores')
      .select('whatsapp')
      .eq('user_id', sub.user_id)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (store?.whatsapp) {
      const name = profile?.display_name || profile?.email?.split('@')[0] || 'Pengguna'
      const expiresAt = data.expires_at
        ? new Date(data.expires_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        : '-'
      const planType = data.plan_type ?? (sub.plan_type as 'monthly' | 'annual') ?? 'monthly'
      await sendWhatsApp(store.whatsapp, msgSubscriptionActivated(name, expiresAt, planType))
    }
  }

  revalidatePath('/admin/subscriptions')
  return { error: null }
}

export async function sendSubscriptionReminder(
  subscriptionId: string
): Promise<{ error: string | null }> {
  const { supabase, error: authError } = await verifyAdmin()
  if (authError || !supabase) return { error: authError }

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id, expires_at, status')
    .eq('id', subscriptionId)
    .maybeSingle()

  if (!sub) return { error: 'Subscription tidak ditemukan.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, email')
    .eq('id', sub.user_id)
    .maybeSingle()

  const { data: store } = await supabase
    .from('stores')
    .select('whatsapp')
    .eq('user_id', sub.user_id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (!store?.whatsapp) return { error: 'User tidak memiliki nomor WhatsApp toko.' }

  const name = profile?.display_name || profile?.email?.split('@')[0] || 'Pengguna'
  const expiresAt = sub.expires_at
    ? new Date(sub.expires_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '-'

  const daysLeft = sub.expires_at
    ? Math.ceil((new Date(sub.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  let message: string
  if (sub.status === 'expired' || (daysLeft !== null && daysLeft <= 0)) {
    message = msgTrialExpired(name)
  } else {
    message = msgTrialExpiringSoon(name, daysLeft ?? 0, expiresAt)
  }

  await sendWhatsApp(store.whatsapp, message)
  return { error: null }
}

export async function extendSubscription(
  subscriptionId: string,
  days: number
): Promise<{ error: string | null }> {
  const { supabase, error: authError } = await verifyAdmin()
  if (authError || !supabase) return { error: authError }

  const { data: subscription, error: fetchError } = await supabase
    .from('subscriptions')
    .select('expires_at, user_id, plan_type')
    .eq('id', subscriptionId)
    .single()

  if (fetchError || !subscription) {
    return { error: fetchError?.message ?? 'Subscription tidak ditemukan.' }
  }

  const today = new Date()
  const currentExpiry = subscription.expires_at ? new Date(subscription.expires_at) : today
  const baseDate = currentExpiry > today ? currentExpiry : today
  baseDate.setDate(baseDate.getDate() + days)

  const { error } = await supabase
    .from('subscriptions')
    .update({ expires_at: baseDate.toISOString(), status: 'active' })
    .eq('id', subscriptionId)

  if (error) return { error: error.message }

  // Send WA notification
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, email')
    .eq('id', subscription.user_id)
    .maybeSingle()
  const { data: store } = await supabase
    .from('stores')
    .select('whatsapp')
    .eq('user_id', subscription.user_id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (store?.whatsapp) {
    const name = profile?.display_name || profile?.email?.split('@')[0] || 'Pengguna'
    const expiresAtStr = baseDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    const planType = (subscription.plan_type as 'monthly' | 'annual') ?? 'monthly'
    await sendWhatsApp(store.whatsapp, msgSubscriptionActivated(name, expiresAtStr, planType))
  }

  revalidatePath('/admin/subscriptions')
  return { error: null }
}
