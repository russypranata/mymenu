import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import type { Database } from '@/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type Subscription = Database['public']['Tables']['subscriptions']['Row']
type SubscriptionHistory = Database['public']['Tables']['subscription_history']['Row']

export type { SubscriptionHistory }

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  if (error) {
    logger.error('[getProfile]', error, { userId })
    throw new Error(`[getProfile] ${error.message}`)
  }
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
  if (error) {
    logger.error('[getSubscription]', error, { userId })
    throw new Error(`[getSubscription] ${error.message}`)
  }
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
  if (error) {
    logger.error('[getPageViewCount]', error, { storeIds })
    throw new Error(`[getPageViewCount] ${error.message}`)
  }
  return count ?? 0
}

export async function getWhatsAppClickCount(storeIds: string[]): Promise<number> {
  if (storeIds.length === 0) return 0
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('analytics')
    .select('*', { count: 'exact', head: true })
    .in('store_id', storeIds)
    .eq('event_type', 'whatsapp_click')
  if (error) {
    logger.error('[getWhatsAppClickCount]', error, { storeIds })
    throw new Error(`[getWhatsAppClickCount] ${error.message}`)
  }
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

/**
 * Returns true if subscription is expired AND grace period has ended.
 * Grace period: 3 days after expiration.
 * Used for hard blocking access to dashboard.
 * 
 * @param subscription - User's subscription record
 * @returns true if user should be blocked from dashboard
 */
export function isSubscriptionExpiredWithGrace(subscription: Subscription | null): boolean {
  // No subscription = block
  if (!subscription) return true
  
  // Active or trial = don't block
  if (subscription.status === 'active' || subscription.status === 'trial') return false
  
  // Not expired status = don't block
  if (subscription.status !== 'expired') return false
  
  // No expiry date = don't block (shouldn't happen but safety check)
  if (!subscription.expires_at) return false
  
  // Calculate grace period end (3 days after expiration)
  const expiresAt = new Date(subscription.expires_at)
  const gracePeriodEnd = new Date(expiresAt)
  gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 3) // 3 days grace period
  
  // Block if current date is after grace period
  return new Date() > gracePeriodEnd
}

export interface DailyAnalytics {
  date: string
  page_views: number
  whatsapp_clicks: number
}

/**
 * Returns daily analytics for the last N days for given store IDs.
 */
export async function getDailyAnalytics(
  storeIds: string[],
  days = 7
): Promise<DailyAnalytics[]> {
  if (storeIds.length === 0) return []
  const supabase = await createClient()

  const since = new Date()
  since.setDate(since.getDate() - (days - 1))
  since.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('analytics')
    .select('event_type, created_at')
    .in('store_id', storeIds)
    .in('event_type', ['page_view', 'whatsapp_click'])
    .gte('created_at', since.toISOString())

  if (error) {
    logger.error('[getDailyAnalytics]', error, { storeIds })
    return []
  }

  // Build a map of date -> counts
  const map: Record<string, { page_views: number; whatsapp_clicks: number }> = {}

  // Pre-fill all days with 0
  for (let i = 0; i < days; i++) {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    const key = d.toISOString().slice(0, 10)
    map[key] = { page_views: 0, whatsapp_clicks: 0 }
  }

  for (const row of data ?? []) {
    const key = row.created_at.slice(0, 10)
    if (!map[key]) continue
    if (row.event_type === 'page_view') map[key].page_views++
    else if (row.event_type === 'whatsapp_click') map[key].whatsapp_clicks++
  }

  return Object.entries(map).map(([date, counts]) => ({ date, ...counts }))
}

export async function getSubscriptionHistory(userId: string): Promise<SubscriptionHistory[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('subscription_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)
  if (error) {
    logger.error('[getSubscriptionHistory]', error, { userId })
    return []
  }
  return (data as SubscriptionHistory[]) ?? []
}
