'use client'

import { ReactNode } from 'react'
import Image from 'next/image'
import { useTheme } from './theme-provider'

interface PublicMenuContentProps {
  storeName: string
  storeDescription: string | null
  bannerUrl: string | null
  primaryColor: string
  menuSectionTitle?: string | null
  menuSectionSubtitle?: string | null
  children: ReactNode
}

export function PublicMenuContent({ 
  storeName, 
  storeDescription, 
  bannerUrl, 
  primaryColor,
  menuSectionTitle,
  menuSectionSubtitle,
  children 
}: PublicMenuContentProps) {
  const { isDark } = useTheme()
  
  const titleColor = isDark ? 'text-white' : 'text-slate-900'
  const descColor = isDark ? 'text-slate-400' : 'text-slate-500'
  const waveFill = isDark ? '#020617' : '#FDFDFD'

  return (
    <>
      {/* ── Hero Banner ── */}
      <section className="relative pt-16 sm:pt-20 h-[300px] sm:h-[360px] flex items-center overflow-hidden rounded-b-3xl">
        {bannerUrl ? (
          <Image
            src={bannerUrl}
            alt={`Banner ${storeName}`}
            fill
            sizes="100vw"
            className="object-cover"
            quality={90}
            priority
          />
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: primaryColor }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/50 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-6">
          <div className="max-w-xl text-white">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-3 leading-tight tracking-tight">
              {storeName}
            </h1>
            {storeDescription && (
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-md">
                {storeDescription}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Menu Section ── */}
      <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-20">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-7 rounded-full flex-shrink-0" style={{ backgroundColor: primaryColor }} />
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
    </>
  )
}
