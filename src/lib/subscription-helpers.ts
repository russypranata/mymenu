/**
 * Subscription Helper Functions
 * 
 * Centralized utilities for subscription display logic.
 * Ensures consistent labeling and styling across the application.
 */

export type SubscriptionOrigin = 'trial' | 'paid'
export type SubscriptionPlanType = 'trial' | 'monthly' | 'annual'

/**
 * Get human-readable label for subscription plan
 * 
 * @param planType - The plan type from database
 * @param origin - The subscription origin (trial or paid)
 * @returns Localized plan label
 * 
 * @example
 * getPlanLabel('monthly', 'trial') // "Trial Gratis"
 * getPlanLabel('monthly', 'paid') // "Paket Bulanan"
 * getPlanLabel('annual', 'paid') // "Paket Tahunan"
 */
export function getPlanLabel(planType: string, origin: string): string {
  // For trial origin, always show "Trial Gratis" regardless of plan_type
  if (origin === 'trial') return 'Trial Gratis'
  
  // For paid origin, show the actual plan type
  if (planType === 'annual') return 'Paket Tahunan'
  return 'Paket Bulanan'
}

/**
 * Get Tailwind CSS classes for plan badge styling
 * 
 * @param planType - The plan type from database
 * @param origin - The subscription origin (trial or paid)
 * @returns Tailwind CSS class string
 * 
 * @example
 * getPlanBadgeClass('monthly', 'trial') // "bg-amber-50 text-amber-600 border border-amber-100"
 * getPlanBadgeClass('monthly', 'paid') // "bg-green-100 text-green-700 border border-green-200"
 * getPlanBadgeClass('annual', 'paid') // "bg-green-800 text-white"
 */
export function getPlanBadgeClass(planType: string, origin: string): string {
  // For trial origin, use amber badge
  if (origin === 'trial') return 'bg-amber-50 text-amber-600 border border-amber-100'
  
  // For paid origin, differentiate between annual and monthly
  if (planType === 'annual') return 'bg-green-800 text-white'
  return 'bg-green-100 text-green-700 border border-green-200'
}

/**
 * Get payment amount for a plan type
 * 
 * @param planType - The plan type
 * @returns Formatted price string
 */
export function getPlanAmount(planType: 'monthly' | 'annual'): string {
  return planType === 'annual' ? 'Rp200.000' : 'Rp20.000'
}

/**
 * Get plan duration label
 * 
 * @param planType - The plan type
 * @returns Duration label (e.g., "/bulan", "/tahun")
 */
export function getPlanDuration(planType: 'monthly' | 'annual'): string {
  return planType === 'annual' ? '/tahun' : '/bulan'
}

/**
 * Calculate days until expiry
 * 
 * @param expiresAt - ISO date string or Date object
 * @returns Number of days until expiry (negative if expired)
 */
export function getDaysUntilExpiry(expiresAt: string | Date | null): number | null {
  if (!expiresAt) return null
  const expiry = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt
  return Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

/**
 * Check if subscription is currently active
 * 
 * @param expiresAt - ISO date string or Date object
 * @returns true if subscription hasn't expired yet
 */
export function isSubscriptionActive(expiresAt: string | Date | null): boolean {
  if (!expiresAt) return false
  const expiry = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt
  return expiry > new Date()
}
