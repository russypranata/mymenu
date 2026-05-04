'use client'

import { CartDrawer } from './cart-drawer'
import type { Tables } from '@/types/database.types'

type StoreLocation = Tables<'store_locations'>

interface PublicMenuCartProps {
  storeId: string
  storeName: string
  locations: StoreLocation[]
  storeWhatsapp: string | null
  buttonText: string | null | undefined
  showPrice: boolean
}

export function PublicMenuCart({
  storeId,
  storeName,
  locations,
  storeWhatsapp,
  buttonText,
  showPrice,
}: PublicMenuCartProps) {
  if (!storeWhatsapp) return null

  return (
    <CartDrawer
      whatsapp={storeWhatsapp}
      storeId={storeId}
      storeName={storeName}
      buttonText={buttonText}
      showPrice={showPrice}
    />
  )
}
