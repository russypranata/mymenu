'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { UtensilsCrossed } from 'lucide-react'
import { useTheme } from './theme-provider'

interface Props {
  storeName: string
  logoUrl?: string | null
  primaryColor: string
}

export function PublicNavbar({ storeName, logoUrl, primaryColor }: Props) {
  const { isDark } = useTheme()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const textColor = scrolled 
    ? (isDark ? 'text-white' : 'text-slate-900')
    : 'text-white'
  
  const linkColor = scrolled 
    ? (isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900')
    : 'text-white/80 hover:text-white'

  const navBg = scrolled
    ? (isDark ? 'bg-slate-900/90' : 'bg-white/90')
    : 'bg-transparent'
  
  const borderColor = scrolled
    ? (isDark ? 'border-slate-800' : 'border-slate-100')
    : 'border-transparent'

  return (
    <nav
      className={`fixed top-0 w-full z-[100] transition-all duration-300 ${navBg} backdrop-blur-xl border-b ${borderColor}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-20 items-center">

          {/* Logo + Name */}
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <div className="relative w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">
                <Image src={logoUrl} alt={storeName} fill sizes="36px" className="object-cover" priority />
              </div>
            ) : (
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0"
                style={{ backgroundColor: primaryColor }}
              >
                {storeName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className={`font-extrabold text-base leading-tight tracking-tight transition-colors duration-300 ${textColor}`}>
              {storeName}
            </span>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            <a
              href="#menu"
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${linkColor}`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Menu</span>
            </a>
          </div>

        </div>
      </div>
    </nav>
  )
}
