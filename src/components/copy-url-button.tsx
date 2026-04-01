'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function CopyUrlButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="p-2 text-gray-400 hover:text-green-500 rounded-lg hover:bg-green-50 transition-colors"
      title={copied ? 'Disalin!' : 'Salin URL'}
    >
      {copied
        ? <Check className="w-4 h-4 text-green-500" />
        : <Copy className="w-4 h-4" />
      }
    </button>
  )
}
