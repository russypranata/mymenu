'use client'

import { useEffect, useState } from 'react'
import { SubscriptionSection } from './subscription-section'
import type { Database } from '@/types/database.types'

type Subscription = Database['public']['Tables']['subscriptions']['Row']

interface SubscriptionSectionWrapperProps {
  subscription: Subscription | null
  userEmail: string
}

export function SubscriptionSectionWrapper({ subscription, userEmail }: SubscriptionSectionWrapperProps) {
  const [shouldOpenModal, setShouldOpenModal] = useState(false)

  useEffect(() => {
    // Check sessionStorage flag on mount
    const shouldOpen = sessionStorage.getItem('openSubscriptionModal')
    if (shouldOpen === 'true') {
      // Clear the flag
      sessionStorage.removeItem('openSubscriptionModal')
      // Open modal
      setShouldOpenModal(true)
      // Reset state after opening
      setTimeout(() => setShouldOpenModal(false), 500)
    }
  }, [])

  return (
    <SubscriptionSection 
      subscription={subscription} 
      userEmail={userEmail}
      initialModalOpen={shouldOpenModal}
    />
  )
}
