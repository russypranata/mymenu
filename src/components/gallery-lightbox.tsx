'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useFocusTrap } from '@/hooks/use-focus-trap'
import type { GalleryPhoto } from '@/lib/queries/gallery'

interface Props {
  photos: GalleryPhoto[]
  initialIndex: number
  onClose: () => void
}

export function GalleryLightbox({ photos, initialIndex, onClose }: Props) {
  const [activeIdx, setActiveIdx] = useState(initialIndex)
  const trapRef = useFocusTrap<HTMLDivElement>(true)

  // Touch swipe state
  const touchStartX = useRef<number | null>(null)

  const prev = () => setActiveIdx(i => Math.max(0, i - 1))
  const next = () => setActiveIdx(i => Math.min(photos.length - 1, i + 1))

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (delta < -50) next()
    else if (delta > 50) prev()
  }

  const photo = photos[activeIdx]

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90"
      role="dialog"
      aria-modal="true"
      aria-label="Galeri foto"
    >
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Container */}
      <div
        ref={trapRef}
        className="relative w-full h-full flex flex-col items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          aria-label="Tutup galeri"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Counter */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1 bg-black/50 rounded-full">
          <span className="text-white text-sm font-medium">
            {activeIdx + 1} / {photos.length}
          </span>
        </div>

        {/* Prev button */}
        {activeIdx > 0 && (
          <button
            onClick={prev}
            className="absolute left-4 z-10 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            aria-label="Foto sebelumnya"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        )}

        {/* Next button */}
        {activeIdx < photos.length - 1 && (
          <button
            onClick={next}
            className="absolute right-4 z-10 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            aria-label="Foto berikutnya"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        )}

        {/* Image */}
        <div className="relative w-full max-w-4xl mx-auto px-16 flex items-center justify-center"
          style={{ height: 'calc(100vh - 120px)' }}>
          <div className="relative w-full h-full">
            <Image
              src={photo.image_url}
              alt={photo.caption ?? `Foto ${activeIdx + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-contain"
              quality={90}
              priority
            />
          </div>
        </div>

        {/* Caption */}
        {photo.caption && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-lg px-4 text-center">
            <p className="text-white/90 text-sm bg-black/50 px-4 py-2 rounded-xl">
              {photo.caption}
            </p>
          </div>
        )}

        {/* Dot indicators */}
        {photos.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5"
            style={{ bottom: photo.caption ? '56px' : '24px' }}>
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`h-1.5 rounded-full transition-all ${i === activeIdx ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`}
                aria-label={`Foto ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
