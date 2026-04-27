'use client'

import { useRouter } from 'next/navigation'
import { SubscriptionBanner } from './subscription-banner'

interface SubscriptionBannerWrapperProps {
  status: 'trial' | 'active' | 'expired'
  planType: 'monthly' | 'annual' | null | undefined
  origin: 'trial' | 'paid' | null | undefined
  expiresAt: string | null
  daysUntilExpiry: number | null
  gracePeriodDaysLeft?: number | null
}

export function SubscriptionBannerWrapper(props: SubscriptionBannerWrapperProps) {
  const router = useRouter()

  const handleRenewClick = () => {
    // Set flag in sessionStorage to open modal after navigation
    sessionStorage.setItem('openSubscriptionModal', 'true')
    // Navigate to profile page
    router.push('/profile')
  }

  return <SubscriptionBanner {...props} onRenewClick={handleRenewClick} />
}
