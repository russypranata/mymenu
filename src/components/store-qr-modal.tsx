'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Download, QrCode, X } from 'lucide-react'

interface Props {
  slug: string
  storeName: string
  appUrl: string
}

export function StoreQRModal({ slug, storeName, appUrl }: Props) {
  const [open, setOpen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const url = `${appUrl}/${slug}`

  useEffect(() => {
    if (!open) return
    const canvas = canvasRef.current
    if (!canvas) return
    QRCode.toCanvas(canvas, url, {
      width: 200,
      margin: 2,
      color: { dark: '#111827', light: '#ffffff' },
    })
  }, [open, url])

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
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-gray-400 hover:text-green-500 rounded-lg hover:bg-green-50 transition-colors"
        title="QR Code"
      >
        <QrCode className="w-4 h-4" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border border-gray-100 w-full max-w-xs shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">QR Code</p>
                  <p className="text-xs text-gray-400 mt-0.5">{storeName}</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-5 flex flex-col items-center gap-4">
              <div className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <canvas ref={canvasRef} />
              </div>
              <p className="text-xs font-mono text-gray-400 text-center break-all">{url}</p>
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PNG
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
