'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { X, UtensilsCrossed, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useTheme } from '@/components/theme-provider'
import { ImageWithSkeleton } from '@/components/image-with-skeleton'
import type { Database } from '@/types/database.types'

type Menu = Database['public']['Tables']['menus']['Row']

interface Props {
  menu: Menu
  primaryColor: string
  showPrice: boolean
  onClose: () => void
}

export function MenuDetailModal({
  menu, primaryColor, showPrice, onClose
}: Props) {
  const { isDark } = useTheme()
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
  const dividerColor = isDark ? 'border-gray-700' : 'border-gray-100'

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-detail-title"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div className={`relative w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden ${cardBg} max-h-[92vh] sm:max-h-[85vh] flex flex-col`}>

        {/* Image area */}
        <div className={`relative w-full aspect-[4/3] ${menuImageBg} flex-shrink-0`}>
          {allImages.length > 0 ? (
            <>
              <ImageWithSkeleton
                src={allImages[activeIdx]}
                alt={`${menu.name} foto ${activeIdx + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, 384px"
                className="object-cover"
                quality={90}
                priority
              />

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveIdx(i => Math.max(0, i - 1))}
                    disabled={activeIdx === 0}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-colors disabled:opacity-20"
                    aria-label="Foto sebelumnya"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={() => setActiveIdx(i => Math.min(allImages.length - 1, i + 1))}
                    disabled={activeIdx === allImages.length - 1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-colors disabled:opacity-20"
                    aria-label="Foto berikutnya"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {allImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveIdx(i)}
                        className={`h-1.5 rounded-full transition-all ${i === activeIdx ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}`}
                        aria-label={`Foto ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <UtensilsCrossed className={`w-14 h-14 ${isDark ? 'text-gray-600' : 'text-gray-200'}`} />
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-colors"
            aria-label="Tutup"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Thumbnail strip */}
        {allImages.length > 1 && (
          <div className={`flex gap-2 px-4 pt-3 pb-1 overflow-x-auto scrollbar-none flex-shrink-0 border-b ${dividerColor}`}>
            {allImages.map((url, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`relative w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${i === activeIdx ? 'opacity-100 scale-105' : 'border-transparent opacity-50 hover:opacity-80'}`}
                style={i === activeIdx ? { borderColor: primaryColor } : {}}
                aria-label={`Lihat foto ${i + 1}`}
              >
                <ImageWithSkeleton src={url} alt={`Thumbnail ${i + 1}`} fill sizes="48px" className="object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <div>
            <h2 id="menu-detail-title" className={`text-xl font-extrabold leading-snug ${titleColor}`}>
              {menu.name}
            </h2>
            {showPrice && (
              <p className="text-2xl font-extrabold mt-1.5" style={{ color: primaryColor }}>
                {formatCurrency(menu.price)}
              </p>
            )}
          </div>

          {menu.description && (
            <p className={`text-sm leading-relaxed ${descColor} whitespace-pre-wrap`}>
              {menu.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
