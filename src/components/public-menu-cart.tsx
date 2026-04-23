'use client'

import { useState } from 'react'
import { CartDrawer } from './cart-drawer'
import type { Tables } from '@/types/database.types'

type StoreLocation = Tables<'store_locations'>

interface PublicMenuCartProps {
  storeId: string
  storeName: string
  locations: StoreLocation[]
  storeWhatsapp: string | null
  primaryColor: string
  isDark: boolean
  buttonText: string | null | undefined
  showPrice: boolean
}

export function PublicMenuCart({
  storeId,
  storeName,
  locations,
  storeWhatsapp,
  primaryColor,
  isDark,
  buttonText,
  showPrice,
}: PublicMenuCartProps) {
  const [selectedLocation] = useState<StoreLocation>(
    locations.find(loc => loc.is_primary) || locations[0]
  )

  // Use selected location's WhatsApp, fallback to store WhatsApp
  const whatsapp = selectedLocation?.whatsapp || storeWhatsapp

  if (!whatsapp) return null

  return (
    <CartDrawer
      whatsapp={whatsapp}
      storeId={storeId}
      storeName={storeName}
      primaryColor={primaryColor}
      isDark={isDark}
      buttonText={buttonText}
      showPrice={showPrice}
    />
  )
}
