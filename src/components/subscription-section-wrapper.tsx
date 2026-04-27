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
    // Check immediately on mount
    const checkHash = () => {
      if (typeof window !== 'undefined' && window.location.hash === '#renew') {
        setShouldOpenModal(true)
        // Clean up the hash after a short delay to ensure modal opens
        setTimeout(() => {
          window.history.replaceState(null, '', window.location.pathname)
        }, 100)
      }
    }

    // Check on mount
    checkHash()

    // Also listen for hash changes
    window.addEventListener('hashchange', checkHash)
    
    return () => {
      window.removeEventListener('hashchange', checkHash)
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
