'use client'

import { ReactNode } from 'react'
import Image from 'next/image'
import { useTheme } from './theme-provider'

interface PublicMenuContentProps {
  storeName: string
  storeDescription: string | null
  bannerUrl: string | null
  primaryColor: string
  children: ReactNode
}

export function PublicMenuContent({ 
  storeName, 
  storeDescription, 
  bannerUrl, 
  primaryColor,
  children 
}: PublicMenuContentProps) {
  const { isDark } = useTheme()
  
  const titleColor = isDark ? 'text-white' : 'text-slate-900'
  const descColor = isDark ? 'text-slate-400' : 'text-slate-500'
  const waveFill = isDark ? '#020617' : '#FDFDFD'

  return (
    <>
      {/* ── Hero Banner ── */}
      <section className="relative pt-16 sm:pt-20 h-[300px] sm:h-[360px] flex items-center overflow-hidden">
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

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none" style={{ height: '56px' }}>
            <path d="M0,32 C240,56 480,8 720,32 C960,56 1200,8 1440,32 L1440,56 L0,56 Z" fill={waveFill} />
          </svg>
        </div>
      </section>

      {/* ── Menu Section ── */}
      <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-20">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-7 rounded-full flex-shrink-0" style={{ backgroundColor: primaryColor }} />
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${titleColor}`}>Jelajahi Menu Kami</h2>
          </div>
          <p className={`text-sm ml-4 ${descColor}`}>Temukan hidangan favorit yang memanjakan lidah Anda</p>
        </div>
        {children}
      </section>
    </>
  )
}
