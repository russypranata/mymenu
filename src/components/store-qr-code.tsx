'use client'

import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { Download, QrCode } from 'lucide-react'

interface Props {
  slug: string
  storeName: string
  appUrl: string
}

export function StoreQRCode({ slug, storeName, appUrl }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const url = `${appUrl}/${slug}`

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    QRCode.toCanvas(canvas, url, {
      width: 180,
      margin: 2,
      color: { dark: '#111827', light: '#ffffff' },
    })
  }, [url])

  function handleDownload() {
    const src = canvasRef.current
    if (!src) return

    const canvas = document.createElement('canvas')
    const size = 512
    canvas.width = size
    canvas.height = size + 64

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(src, 0, 0, size, size)

    ctx.fillStyle = '#111827'
    ctx.font = 'bold 22px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(storeName, size / 2, size + 40)

    const link = document.createElement('a')
    link.download = `qr-${slug}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
      <div className="flex items-center gap-2">
        <QrCode className="w-4 h-4 text-gray-400" />
        <h2 className="text-base font-bold text-gray-900">QR Code Toko</h2>
      </div>
      <p className="text-sm text-gray-500 -mt-2">
        Scan QR ini untuk membuka menu digital toko Anda.
      </p>

      <div className="flex flex-col items-center gap-4">
        <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <canvas ref={canvasRef} />
        </div>

        <p className="text-xs font-mono text-gray-400 text-center break-all">{url}</p>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <Download className="w-4 h-4" />
          Download QR Code
        </button>
      </div>
    </div>
  )
}
