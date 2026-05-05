'use client'

import { ReactNode } from 'react'
import React from 'react'
import Image from 'next/image'
import { useTheme } from './theme-provider'

interface PublicMenuContentProps {
  storeName: string
  storeDescription: string | null
  bannerUrl: string | null
  menuSectionTitle?: string | null
  menuSectionSubtitle?: string | null
  gallerySection?: React.ReactNode
  children: ReactNode
}

export function PublicMenuContent({
  storeName,
  storeDescription,
  bannerUrl,
  menuSectionTitle,
  menuSectionSubtitle,
  gallerySection,
  children,
}: PublicMenuContentProps) {
  const { isDark } = useTheme()

  const titleColor = isDark ? 'text-white' : 'text-slate-900'
  const descColor  = isDark ? 'text-slate-400' : 'text-slate-500'

  return (
    <>
      {/*
       * ── Hero / Jumbotron ──
       * Not full-width — has horizontal + top margin and border radius,
       * matching the floating card aesthetic of the landing page navbar.
       *
       * pt-20 sm:pt-24 accounts for the floating navbar height (56–64px) + gap
       */}
      <div className="px-3 sm:px-4 lg:px-6 pt-3 sm:pt-4">
        <section
          className="relative max-w-7xl mx-auto h-[260px] sm:h-[360px] flex items-end overflow-hidden rounded-2xl sm:rounded-3xl"
        >
          {/* Background — banner image or primary color */}
          {bannerUrl ? (
            <Image
              src={bannerUrl}
              alt={`Banner ${storeName}`}
              fill
              sizes="(max-width: 640px) calc(100vw - 24px), (max-width: 1024px) calc(100vw - 32px), calc(min(100vw - 48px, 1280px))"
              className="object-cover"
              quality={90}
              priority
            />
          ) : (
            <div className="absolute inset-0" style={{ backgroundColor: 'var(--color-primary)' }} />
          )}

          {/* Gradient overlay — bottom-heavy so text is readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

          {/* Store info — anchored to bottom with comfortable padding */}
          <div className="relative z-10 w-full px-5 sm:px-8 pb-8 sm:pb-10">
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

      {/* ── Gallery Section (antara hero dan menu) ── */}
      {gallerySection}

      {/* ── Menu Section ── */}
      <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-1 h-6 rounded-full flex-shrink-0"
              style={{ backgroundColor: 'var(--color-primary)' }}
            />
            <h2 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${titleColor}`}>
              {menuSectionTitle || 'Menu Kami'}
            </h2>
          </div>
          <p className={`text-sm ml-4 ${descColor}`}>
            {menuSectionSubtitle || 'Pilih menu favorit Anda'}
          </p>
        </div>
        {children}
      </section>
    </>
  )
}
