'use client'

import { useState } from 'react'
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
    // Navigate to profile page with hash to trigger modal
    router.push('/profile#renew')
  }

  return <SubscriptionBanner {...props} onRenewClick={handleRenewClick} />
}
