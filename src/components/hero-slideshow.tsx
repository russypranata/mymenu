'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'

interface HeroSlideshowProps {
  images: string[]
  storeName: string
  /** Interval in ms between slides. Default 4000 */
  interval?: number
}

export function HeroSlideshow({ images, storeName, interval = 4000 }: HeroSlideshowProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goTo = useCallback((idx: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveIdx(idx)
      setIsTransitioning(false)
    }, 300)
  }, [isTransitioning])

  // Auto-advance
  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % images.length)
    }, interval)
    return () => clearInterval(timer)
  }, [images.length, interval])

  if (images.length === 0) return null

  return (
    <>
      {/* Images — crossfade */}
      {images.map((src, idx) => (
        <Image
          key={src}
          src={src}
          alt={`${storeName} banner ${idx + 1}`}
          fill
          sizes="(max-width: 640px) calc(100vw - 24px), (max-width: 1024px) calc(100vw - 32px), calc(min(100vw - 48px, 1280px))"
          className="object-cover transition-opacity duration-700"
          style={{ opacity: idx === activeIdx ? 1 : 0 }}
          quality={90}
          priority={idx === 0}
        />
      ))}

      {/* Dot indicators — only if multiple images */}
      {images.length > 1 && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5"
          aria-label="Navigasi banner"
        >
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === activeIdx ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Banner ${idx + 1}`}
              aria-current={idx === activeIdx}
            />
          ))}
        </div>
      )}
    </>
  )
}
