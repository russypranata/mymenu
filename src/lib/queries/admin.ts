import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type Store = Database['public']['Tables']['stores']['Row']
type Subscription = Database['public']['Tables']['subscriptions']['Row']

export const SUBSCRIPTION_PRICE = 20000

export interface AdminStats {
  totalUsers: number
  totalStores: number
  activeSubscriptions: number
  trialSubscriptions: number
  suspendedUsers: number
  estimatedRevenue: number
}

export interface SubscriptionWithUser extends Subscription {
  profiles: Pick<Profile, 'email' | 'display_name'> | null
}

export interface StoreWithOwner extends Store {
  profiles: Pick<Profile, 'email' | 'display_name'> | null
}

export interface AdminUserDetail {
  profile: Profile | null
  stores: Store[]
  subscription: Subscription | null
}

export interface AdminStoreDetail {
  store: Store | null
  owner: Profile | null
  menuCount: number
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient()

  const [
    { count: totalUsers },
    { count: totalStores },
    { count: activeSubscriptions },
    { count: trialSubscriptions },
    { count: suspendedUsers },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'user'),
    supabase
      .from('stores')
      .select('*', { count: 'exact', head: true }),
    supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active'),
    supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'trial'),
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'suspended'),
  ])

  const active = activeSubscriptions ?? 0
  const trial = trialSubscriptions ?? 0

  return {
    totalUsers: totalUsers ?? 0,
    totalStores: totalStores ?? 0,
    activeSubscriptions: active,
    trialSubscriptions: trial,
    suspendedUsers: suspendedUsers ?? 0,
    // Revenue only from paid (active) subscriptions, not trial
    estimatedRevenue: active * SUBSCRIPTION_PRICE,
  }
}

export async function getAdminUsers(filters?: {
  status?: string
  role?: string
  search?: string
  page?: number
  pageSize?: number
}): Promise<{ data: Profile[]; total: number }> {
  const supabase = await createClient()
  const page = filters?.page ?? 1
  const pageSize = filters?.pageSize ?? 20
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase.from('profiles').select('*', { count: 'exact' }).order('created_at', { ascending: false })

  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.role) query = query.eq('role', filters.role)
  if (filters?.search) query = query.or(`email.ilike.%${filters.search}%,display_name.ilike.%${filters.search}%`)

  const { data, error, count } = await query.range(from, to)
  if (error) console.error('[getAdminUsers]', error.message)
  return { data: (data as Profile[] | null) ?? [], total: count ?? 0 }
}

export async function getAdminUserDetail(userId: string): Promise<AdminUserDetail> {
  const supabase = await createClient()

  const [profileResult, storesResult, subscriptionResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    supabase.from('stores').select('*').eq('user_id', userId),
    supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  if (profileResult.error) console.error('[getAdminUserDetail] profile', profileResult.error.message)
  if (storesResult.error) console.error('[getAdminUserDetail] stores', storesResult.error.message)
  if (subscriptionResult.error) console.error('[getAdminUserDetail] subscription', subscriptionResult.error.message)

  return {
    profile: profileResult.data as Profile | null,
    stores: (storesResult.data as Store[] | null) ?? [],
    subscription: subscriptionResult.data as Subscription | null,
  }
}

export async function getAdminSubscriptions(filters?: {
  status?: string
  page?: number
  pageSize?: number
}): Promise<{ data: SubscriptionWithUser[]; total: number }> {
  const supabase = await createClient()
  const page = filters?.page ?? 1
  const pageSize = filters?.pageSize ?? 20
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('subscriptions')
    .select('*, profiles(email, display_name)', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (filters?.status) query = query.eq('status', filters.status)

  const { data, error, count } = await query.range(from, to)
  if (error) console.error('[getAdminSubscriptions]', error.message)
  return { data: (data as SubscriptionWithUser[] | null) ?? [], total: count ?? 0 }
}

export async function getAdminStores(search?: string, page = 1, pageSize = 20): Promise<{ data: StoreWithOwner[]; total: number }> {
  const supabase = await createClient()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('stores')
    .select('*, profiles(email, display_name)', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (search) query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`)

  const { data, error, count } = await query.range(from, to)
  if (error) console.error('[getAdminStores]', error.message)
  return { data: (data as StoreWithOwner[] | null) ?? [], total: count ?? 0 }
}

export async function getAdminStoreDetail(storeId: string): Promise<AdminStoreDetail> {
  const supabase = await createClient()

  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('*')
    .eq('id', storeId)
    .maybeSingle()

  if (storeError) console.error('[getAdminStoreDetail] store', storeError.message)

  const storeData = store as Store | null

  const [ownerResult, menuCountResult] = await Promise.all([
    storeData?.user_id
      ? supabase.from('profiles').select('*').eq('id', storeData.user_id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    supabase
      .from('menus')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', storeId),
  ])

  if (ownerResult.error) console.error('[getAdminStoreDetail] owner', ownerResult.error.message)
  if (menuCountResult.error) console.error('[getAdminStoreDetail] menus', menuCountResult.error.message)

  return {
    store: storeData,
    owner: ownerResult.data as Profile | null,
    menuCount: menuCountResult.count ?? 0,
  }
}
