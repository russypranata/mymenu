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
    // Check if URL has #renew hash
    if (window.location.hash === '#renew') {
      setShouldOpenModal(true)
      // Clean up the hash
      window.history.replaceState(null, '', window.location.pathname)
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
