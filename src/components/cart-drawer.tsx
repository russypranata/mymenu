'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Minus, Trash2, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import { useCart } from '@/components/cart-provider'
import { formatCurrency } from '@/lib/utils'

interface Props {
  whatsapp: string
  storeId: string
  storeName: string
  primaryColor: string
  isDark: boolean
  buttonText?: string | null
  showPrice: boolean
}

export function CartDrawer({ whatsapp, storeId, storeName, primaryColor, isDark, buttonText, showPrice }: Props) {
  const { items, increment, decrement, clear, total, count } = useCart()
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(true)

  // Detect mobile vs desktop once on mount + on resize
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const cardBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
  const titleColor = isDark ? 'text-white' : 'text-gray-900'
  const descColor = isDark ? 'text-gray-400' : 'text-gray-500'
  const drawerBg = isDark ? 'bg-gray-900' : 'bg-white'
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-100'

  // Clean transform — no conflict between translateX and translateY
  const drawerTransform = isMobile
    ? open ? 'translateY(0)' : 'translateY(100%)'
    : open ? 'translateX(0)' : 'translateX(100%)'

  async function handleOrder() {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId, eventType: 'whatsapp_click' }),
      })
    } catch { /* non-critical */ }

    const lines = items.map(i => `- ${i.menu.name} x${i.qty}${showPrice ? ` (${formatCurrency(i.menu.price * i.qty)})` : ''}`)
    const totalLine = showPrice ? `\nTotal: ${formatCurrency(total)}` : ''
    const msg = `Halo ${storeName}, saya mau pesan:\n${lines.join('\n')}${totalLine}`
    // Remove all non-digit characters for wa.me link
    const cleanNumber = whatsapp.replace(/\D/g, '')
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer')
    clear()
    setOpen(false)
  }

  return (
    <>
      {/* Floating cart button */}
      <button
        onClick={() => setOpen(true)}
        aria-label={`Keranjang (${count} item)`}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95"
      >
        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        {count > 0 ? (
          <>
            <span className="hidden sm:inline">{buttonText || 'Pesan via WhatsApp'}</span>
            <span className="inline-flex items-center justify-center w-5 h-5 bg-white/30 rounded-full text-xs font-bold">{count}</span>
          </>
        ) : (
          <span className="hidden sm:inline">{buttonText || 'Pesan via WhatsApp'}</span>
        )}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer — mobile: bottom sheet, desktop: right panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Keranjang pesanan"
        className={`fixed z-50 flex flex-col shadow-2xl ${drawerBg}
          bottom-0 right-0
          w-full sm:w-[400px]
          h-[85vh] sm:h-full sm:max-h-screen
          rounded-t-3xl sm:rounded-none`}
        style={{
          transform: drawerTransform,
          transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b ${borderColor} flex-shrink-0`}>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <h2 className={`text-base font-bold ${titleColor}`}>Keranjang Pesanan</h2>
            {count > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: primaryColor }}>
                {count}
              </span>
            )}
          </div>
          <button
            onClick={() => setOpen(false)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            aria-label="Tutup keranjang"
          >
            <X className="w-4 h-4" style={{ color: isDark ? '#9ca3af' : '#6b7280' }} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 py-16">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#25D366]/10">
                <svg className="w-8 h-8 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <p className={`text-sm font-semibold ${titleColor}`}>Keranjang kosong</p>
              <p className={`text-xs text-center ${descColor}`}>Tambahkan menu dengan menekan tombol + pada item</p>
            </div>
          ) : (
            items.map(({ menu, qty }) => (
              <div key={menu.id} className={`flex items-center gap-3 p-3 rounded-2xl border ${cardBg}`}>
                <div className={`relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  {menu.image_url ? (
                    <Image src={menu.image_url} alt={menu.name} fill sizes="56px" className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg">🍽️</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${titleColor}`}>{menu.name}</p>
                  {showPrice && (
                    <p className="text-xs font-bold mt-0.5" style={{ color: primaryColor }}>
                      {formatCurrency(menu.price * qty)}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => decrement(menu.id)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                    aria-label="Kurangi"
                  >
                    {qty === 1 ? <Trash2 className="w-3.5 h-3.5 text-red-400" /> : <Minus className="w-3.5 h-3.5" style={{ color: isDark ? '#9ca3af' : '#6b7280' }} />}
                  </button>
                  <span className={`w-6 text-center text-sm font-bold ${titleColor}`}>{qty}</span>
                  <button
                    onClick={() => increment(menu.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white transition-colors"
                    style={{ backgroundColor: primaryColor }}
                    aria-label="Tambah"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className={`px-5 py-4 border-t ${borderColor} flex-shrink-0 space-y-3`}>
            {showPrice && (
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${descColor}`}>Total</span>
                <span className={`text-lg font-extrabold ${titleColor}`}>{formatCurrency(total)}</span>
              </div>
            )}
            <button
              onClick={handleOrder}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold rounded-2xl transition-all active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5" />
              Pesan via WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  )
}
