'use client'

import { useState } from 'react'
import Image from 'next/image'
import { GalleryLightbox } from '@/components/gallery-lightbox'
import { useTheme } from '@/components/theme-provider'
import type { GalleryPhoto } from '@/lib/queries/gallery'

interface Props {
  photos: GalleryPhoto[]
}

export function PublicGallery({ photos }: Props) {
  const { isDark } = useTheme()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (photos.length === 0) return null

  const titleColor = isDark ? 'text-white' : 'text-slate-900'
  const captionColor = isDark ? 'text-slate-400' : 'text-slate-500'
  const imageBg = isDark ? 'bg-slate-700' : 'bg-slate-100'

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-1 h-6 rounded-full flex-shrink-0"
            style={{ backgroundColor: 'var(--color-primary)' }}
          />
          <h2 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${titleColor}`}>
            Galeri
          </h2>
        </div>

        {/*
         * Mobile: horizontal scroll
         * Desktop (sm+): grid 3-4 kolom
         */}
        <div className="sm:hidden">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {photos.map((photo, idx) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setLightboxIndex(idx)}
                className={`relative flex-shrink-0 w-48 h-36 rounded-xl overflow-hidden ${imageBg} focus-visible:outline-none focus-visible:ring-2`}
                style={{ ['--tw-ring-color' as any]: 'var(--color-primary)' }}
                aria-label={photo.caption ?? `Lihat foto ${idx + 1}`}
              >
                <Image
                  src={photo.image_url}
                  alt={photo.caption ?? `Foto ${idx + 1}`}
                  fill
                  sizes="192px"
                  className="object-cover"
                  loading={idx < 3 ? 'eager' : 'lazy'}
                  priority={idx < 3}
                />
                {photo.caption && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-2 pb-2 pt-4">
                    <p className="text-white text-[10px] font-medium line-clamp-1">{photo.caption}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop grid */}
        <div className="hidden sm:grid grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo, idx) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setLightboxIndex(idx)}
              className={`group relative aspect-[4/3] rounded-xl overflow-hidden ${imageBg} focus-visible:outline-none focus-visible:ring-2`}
              style={{ ['--tw-ring-color' as any]: 'var(--color-primary)' }}
              aria-label={photo.caption ?? `Lihat foto ${idx + 1}`}
            >
              <Image
                src={photo.image_url}
                alt={photo.caption ?? `Foto ${idx + 1}`}
                fill
                sizes="(max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                loading={idx < 4 ? 'eager' : 'lazy'}
                priority={idx < 4}
              />
              {photo.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-3 pb-3 pt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-medium line-clamp-2">{photo.caption}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <GalleryLightbox
          photos={photos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}
