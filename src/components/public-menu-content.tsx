'use client'

import { ReactNode } from 'react'
import React from 'react'
import { useTheme } from './theme-provider'
import { HeroSlideshow } from './hero-slideshow'

interface PublicMenuContentProps {
  storeName: string
  storeDescription: string | null
  bannerUrl: string | null
  bannerImages?: string[] | null
  menuSectionTitle?: string | null
  menuSectionSubtitle?: string | null
  gallerySection?: React.ReactNode
  children: ReactNode
}

export function PublicMenuContent({
  storeName,
  storeDescription,
  bannerUrl,
  bannerImages,
  menuSectionTitle,
  menuSectionSubtitle,
  gallerySection,
  children,
}: PublicMenuContentProps) {
  const { isDark } = useTheme()

  const titleColor = isDark ? 'text-white' : 'text-slate-900'
  const descColor  = isDark ? 'text-slate-400' : 'text-slate-500'

  // Prefer banner_images array, fallback to single banner_url
  const slides = (bannerImages && bannerImages.length > 0)
    ? bannerImages
    : bannerUrl ? [bannerUrl] : []

  return (
    <>
      {/* ── Hero / Jumbotron ── */}
      <div className="px-3 sm:px-4 lg:px-6 pt-3 sm:pt-4">
        <section className="relative max-w-7xl mx-auto h-[260px] sm:h-[360px] flex items-end overflow-hidden rounded-2xl sm:rounded-3xl">
          {slides.length > 0 ? (
            <HeroSlideshow images={slides} storeName={storeName} />
          ) : (
            <div className="absolute inset-0" style={{ backgroundColor: 'var(--color-primary)' }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent z-10" />
          <div className="relative z-20 w-full px-5 sm:px-8 pb-8 sm:pb-10">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white mb-1.5 leading-tight tracking-tight line-clamp-2 break-words">
              {storeName}
            </h1>
            {storeDescription && (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md line-clamp-2">
                {storeDescription}
              </p>
            )}
          </div>
        </section>
      </div>

      {/* ── Menu Section ── */}
      <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-1 h-7 rounded-full flex-shrink-0"
              style={{ backgroundColor: 'var(--color-primary)' }}
            />
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${titleColor}`}>
              {menuSectionTitle || 'Menu Kami'}
            </h2>
          </div>
          <p className={`text-sm ml-4 ${descColor}`}>
            {menuSectionSubtitle || 'Pilih menu favorit Anda'}
          </p>
        </div>
        {children}
      </section>

      {/* ── Gallery Section (di bawah menu) ── */}
      {gallerySection}
    </>
  )
}
