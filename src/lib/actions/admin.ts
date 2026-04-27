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
    origin: 'trial',
  })

  if (error) return { error: error.message }

  // Insert history record
  await supabase.from('subscription_history').insert({
    user_id: userId,
    plan_type: 'trial',
    origin: 'trial',
    started_at: today.toISOString(),
    ended_at: expiresAt.toISOString(),
    note: 'Trial 3 hari dibuat oleh admin',
  })

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
    .update({
      ...data,
      // When activating, mark as paid origin
      ...(data.status === 'active' && { origin: 'paid' }),
    })
    .eq('id', subscriptionId)

  if (error) return { error: error.message }

  // Insert history record when activating subscription
  if (data.status === 'active' && sub) {
    const finalPlanType = data.plan_type ?? (sub.plan_type as string) ?? 'monthly'
    const startedAt = new Date().toISOString()
    const endedAt = data.expires_at ?? null
    await supabase.from('subscription_history').insert({
      user_id: sub.user_id,
      plan_type: finalPlanType,
      origin: 'paid',
      started_at: startedAt,
      ended_at: endedAt,
      note: `Diaktifkan oleh admin (${finalPlanType === 'annual' ? 'Tahunan' : 'Bulanan'})`,
    })
  }

  // Send WA notification if activating subscription
  if (sub && (data.status === 'active' || data.status === 'trial')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, email, phone')
      .eq('id', sub.user_id)
      .maybeSingle()
    const { data: store } = await supabase
      .from('stores')
      .select('whatsapp')
      .eq('user_id', sub.user_id)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()

    // Primary: owner phone (profiles.phone), fallback: store whatsapp
    const rawPhone = profile?.phone || store?.whatsapp
    if (rawPhone) {
      const waNumber = rawPhone.replace(/^0/, '62').replace(/\D/g, '')
      const name = profile?.display_name || profile?.email?.split('@')[0] || 'Pengguna'
      const expiresAt = data.expires_at
        ? new Date(data.expires_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        : '-'
      const planType = data.plan_type ?? (sub.plan_type as 'monthly' | 'annual') ?? 'monthly'
      await sendWhatsApp(waNumber, msgSubscriptionActivated(name, expiresAt, planType))
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
    .select('display_name, email, phone')
    .eq('id', sub.user_id)
    .maybeSingle()

  const { data: store } = await supabase
    .from('stores')
    .select('whatsapp')
    .eq('user_id', sub.user_id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  // Primary: owner phone (profiles.phone), fallback: store whatsapp
  const rawPhone = profile?.phone || store?.whatsapp
  if (!rawPhone) return { error: 'User tidak memiliki nomor WhatsApp.' }
  const waNumber = rawPhone.replace(/^0/, '62').replace(/\D/g, '')

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

  await sendWhatsApp(waNumber, message)
  return { error: null }
}

export async function extendSubscription(
  subscriptionId: string,
  days: number,
  planType?: 'monthly' | 'annual'
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
    .update({
      expires_at: baseDate.toISOString(),
      status: 'active',
      origin: 'paid',
      ...(planType && { plan_type: planType }),
    })
    .eq('id', subscriptionId)

  if (error) return { error: error.message }

  // Insert history record for this extension
  const finalPlanType = planType ?? (subscription.plan_type as string) ?? 'monthly'
  await supabase.from('subscription_history').insert({
    user_id: subscription.user_id,
    plan_type: finalPlanType,
    origin: 'paid',
    started_at: new Date().toISOString(),
    ended_at: baseDate.toISOString(),
    note: `Diperpanjang ${days} hari oleh admin (${finalPlanType === 'annual' ? 'Tahunan' : 'Bulanan'})`,
  })

  // Send WA notification
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, email, phone')
    .eq('id', subscription.user_id)
    .maybeSingle()
  const { data: store } = await supabase
    .from('stores')
    .select('whatsapp')
    .eq('user_id', subscription.user_id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  // Primary: owner phone (profiles.phone), fallback: store whatsapp
  const rawPhone = profile?.phone || store?.whatsapp
  if (rawPhone) {
    const waNumber = rawPhone.replace(/^0/, '62').replace(/\D/g, '')
    const name = profile?.display_name || profile?.email?.split('@')[0] || 'Pengguna'
    const expiresAtStr = baseDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    const extendPlanType = planType ?? (subscription.plan_type as 'monthly' | 'annual') ?? 'monthly'
    await sendWhatsApp(waNumber, msgSubscriptionActivated(name, expiresAtStr, extendPlanType))
  }

  revalidatePath('/admin/subscriptions')
  return { error: null }
}
