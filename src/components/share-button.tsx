'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'

interface Props {
  storeName: string
  /** When true, navbar has scrolled and has a light background — use primary color style.
   *  When false, navbar is transparent over dark hero — use white style. */
  onDark?: boolean
}

export function ShareButton({ storeName, onDark = false }: Props) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = window.location.href
    const text = `Lihat menu digital ${storeName} di sini:`

    if (navigator.share) {
      try {
        await navigator.share({ title: storeName, text, url })
        return
      } catch {
        // User cancelled or not supported — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard not available — do nothing
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-80 active:scale-95"
      style={
        onDark
          ? { backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff' }
          : { backgroundColor: 'rgba(var(--color-primary-rgb), 0.15)', color: 'var(--color-primary)' }
      }
      aria-label="Bagikan menu"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" />
          Link disalin!
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5" />
          Bagikan
        </>
      )}
    </button>
  )
}
