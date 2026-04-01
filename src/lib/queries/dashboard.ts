import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type Subscription = Database['public']['Tables']['subscriptions']['Row']

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  if (error) console.error('[getProfile]', error.message)
  return data as Profile | null
}

export async function getSubscription(userId: string): Promise<Subscription | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) console.error('[getSubscription]', error.message)
  return data as Subscription | null
}

export async function getPageViewCount(storeIds: string[]): Promise<number> {
  if (storeIds.length === 0) return 0
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('analytics')
    .select('*', { count: 'exact', head: true })
    .in('store_id', storeIds)
    .eq('event_type', 'page_view')
  if (error) console.error('[getPageViewCount]', error.message)
  return count ?? 0
}

/**
 * Returns true if subscription is active or trial AND not yet expired.
 * This is the single source of truth for access enforcement.
 */
export function isSubscriptionValid(subscription: Subscription | null): boolean {
  if (!subscription) return false
  if (subscription.status !== 'active' && subscription.status !== 'trial') return false
  if (!subscription.expires_at) return true // no expiry = always valid
  return new Date(subscription.expires_at) > new Date()
}
