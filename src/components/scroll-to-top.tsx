'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    // Kiri bawah, di atas dark mode toggle (bottom-6 + 44px + 8px gap = bottom-20)
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-20 left-4 sm:left-6 z-40 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
      style={{ backgroundColor: 'var(--color-primary)' }}
      aria-label="Kembali ke atas"
    >
      <ArrowUp className="w-4 h-4 text-white" />
    </button>
  )
}
