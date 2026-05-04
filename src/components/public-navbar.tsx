'use client'

import Image from 'next/image'
import { UtensilsCrossed } from 'lucide-react'
import { useTheme } from './theme-provider'
import { ShareButton } from './share-button'

interface Props {
  storeName: string
  logoUrl?: string | null
}

export function PublicNavbar({ storeName, logoUrl }: Props) {
  const { isDark } = useTheme()

  const navBg    = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
  const textColor = isDark ? 'text-white' : 'text-slate-900'
  const linkColor = isDark
    ? 'text-slate-300 hover:text-white hover:bg-slate-800'
    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'

  return (
    <nav className={`sticky top-0 z-[100] w-full border-b ${navBg} backdrop-blur-xl`}>
      {/* Same horizontal padding + max-width as the hero and menu section below */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* Logo + Store Name */}
          <div className="flex items-center gap-2.5 min-w-0">
            {logoUrl ? (
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden flex-shrink-0">
                <Image src={logoUrl} alt={storeName} fill sizes="36px" className="object-cover" priority />
              </div>
            ) : (
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-extrabold text-sm flex-shrink-0"
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-text)' }}
              >
                {storeName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className={`font-bold text-sm sm:text-base leading-tight tracking-tight truncate ${textColor}`}>
              {storeName}
            </span>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <a
              href="#menu"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-200 ${linkColor}`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Menu</span>
            </a>
            <ShareButton storeName={storeName} />
          </div>

        </div>
      </div>
    </nav>
  )
}
