'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { X, UtensilsCrossed, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Database } from '@/types/database.types'

type Menu = Database['public']['Tables']['menus']['Row']

interface Props {
  menu: Menu
  primaryColor: string
  showPrice: boolean
  isDark: boolean
  waNumber: string | null
  storeName: string
  waButtonText: string
  onClose: () => void
}

export function MenuDetailModal({
  menu, primaryColor, showPrice, isDark, onClose
}: Props) {
  const allImages = [
    ...(menu.image_url ? [menu.image_url] : []),
    ...(menu.extra_images ?? []),
  ]
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setActiveIdx(i => Math.max(0, i - 1))
      if (e.key === 'ArrowRight') setActiveIdx(i => Math.min(allImages.length - 1, i + 1))
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose, allImages.length])

  const cardBg = isDark ? 'bg-gray-800' : 'bg-white'
  const titleColor = isDark ? 'text-white' : 'text-gray-900'
  const descColor = isDark ? 'text-gray-400' : 'text-gray-500'
  const menuImageBg = isDark ? 'bg-gray-700' : 'bg-gray-100'

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-detail-title"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div className={`relative w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden ${cardBg} max-h-[90vh] sm:max-h-[85vh] flex flex-col`}>
        {/* Image area */}
        <div className={`relative w-full aspect-video ${menuImageBg} flex-shrink-0`}>
          {allImages.length > 0 ? (
            <>
              <Image
                src={allImages[activeIdx]}
                alt={`${menu.name} foto ${activeIdx + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, 384px"
                className="object-cover"
                quality={90}
                priority
              />

              {/* Prev / Next */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveIdx(i => Math.max(0, i - 1))}
                    disabled={activeIdx === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-colors disabled:opacity-30"
                    aria-label="Foto sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => setActiveIdx(i => Math.min(allImages.length - 1, i + 1))}
                    disabled={activeIdx === allImages.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-colors disabled:opacity-30"
                    aria-label="Foto berikutnya"
                  >
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>

                  {/* Dots */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {allImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveIdx(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeIdx ? 'bg-white w-4' : 'bg-white/50'}`}
                        aria-label={`Foto ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <UtensilsCrossed className={`w-12 h-12 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-colors"
            aria-label="Tutup"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Thumbnail strip */}
        {allImages.length > 1 && (
          <div className="flex gap-2 px-4 pt-3 overflow-x-auto scrollbar-none flex-shrink-0">
            {allImages.map((url, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${i === activeIdx ? 'border-green-400' : 'border-transparent opacity-60 hover:opacity-100'}`}
                aria-label={`Lihat foto ${i + 1}`}
              >
                <Image src={url} alt={`Thumbnail ${i + 1}`} fill sizes="48px" className="object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Content - Scrollable */}
        <div className="p-5 space-y-3 overflow-y-auto flex-1">
          <div>
            <h2 id="menu-detail-title" className={`text-lg font-bold ${titleColor}`}>{menu.name}</h2>
            {showPrice && (
              <p className="text-xl font-extrabold mt-1" style={{ color: primaryColor }}>
                {formatCurrency(menu.price)}
              </p>
            )}
          </div>

          {menu.description && (
            <p className={`text-sm leading-relaxed ${descColor} whitespace-pre-wrap`}>{menu.description}</p>
          )}
        </div>
      </div>
    </div>
  )
}
