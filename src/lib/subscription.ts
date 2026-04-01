import { createClient } from '@/lib/supabase/server'

/**
 * Check if the currently authenticated user has a valid subscription.
 * Returns { valid: true } or { valid: false, error: string }
 * Pass an existing supabase client to avoid creating a new one.
 */
export async function requireSubscription(
  existingClient?: Awaited<ReturnType<typeof createClient>>
): Promise<{ valid: boolean; error: string | null }> {
  const supabase = existingClient ?? await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { valid: false, error: 'Tidak terautentikasi.' }

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status, expires_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!subscription) return { valid: false, error: 'Langganan tidak ditemukan. Hubungi admin untuk mengaktifkan akun Anda.' }

  const isActiveStatus = subscription.status === 'active' || subscription.status === 'trial'
  if (!isActiveStatus) return { valid: false, error: 'Langganan Anda telah berakhir. Hubungi admin untuk memperpanjang.' }

  if (subscription.expires_at && new Date(subscription.expires_at) <= new Date()) {
    return { valid: false, error: 'Masa langganan Anda telah habis. Hubungi admin untuk memperpanjang.' }
  }

  return { valid: true, error: null }
}
