'use client'

import { useEffect } from 'react'

export function PageViewTracker({ storeId }: { storeId: string }) {
  useEffect(() => {
    // Deduplicate per session — only track once per store per browser session
    const key = `pv_${storeId}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')

    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storeId, eventType: 'page_view' }),
    }).catch(() => {})
  }, [storeId])

  return null
}
