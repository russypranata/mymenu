'use client'

import { ReactNode } from 'react'
import { useTheme } from './theme-provider'
import type { BackgroundPattern } from '@/lib/utils'

interface PublicMenuWrapperProps {
  children: ReactNode
  fontClass: string
  textSizeClass: string
  backgroundPattern: BackgroundPattern
}

export function PublicMenuWrapper({
  children,
  fontClass,
  textSizeClass,
  backgroundPattern,
}: PublicMenuWrapperProps) {
  const { isDark } = useTheme()

  const pageBg = isDark ? 'bg-slate-950' : 'bg-[#FDFDFD]'

  /*
   * Background patterns use rgba() with different opacities for light vs dark mode
   * so the subtle texture remains visible against both backgrounds.
   *
   * Light mode: low opacity (0.15) — subtle on near-white background
   * Dark mode:  higher opacity (0.25) — more visible on dark slate background
   *
   * We inject the pattern via inline style (not Tailwind class) so we can
   * switch the rgba value based on isDark without needing color-mix().
   */
  const patternStyle = getPatternStyle(backgroundPattern, isDark)

  return (
    <div
      className={`min-h-screen ${pageBg} ${fontClass} ${textSizeClass}`}
      style={patternStyle}
    >
      {children}
    </div>
  )
}

function getPatternStyle(pattern: BackgroundPattern, isDark: boolean): React.CSSProperties {
  // Dot color: slate-400 in light, slate-500 in dark — adjusted opacity per mode
  const dotColor   = isDark ? 'rgba(148,163,184,0.25)' : 'rgba(148,163,184,0.15)'
  const gridColor  = isDark ? 'rgba(148,163,184,0.12)' : 'rgba(148,163,184,0.08)'
  const waveColor  = isDark ? 'rgba(148,163,184,0.06)' : 'rgba(148,163,184,0.03)'

  switch (pattern) {
    case 'dots':
      return {
        backgroundImage: `radial-gradient(circle, ${dotColor} 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
      }
    case 'grid':
      return {
        backgroundImage: [
          `linear-gradient(${gridColor} 1px, transparent 1px)`,
          `linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
        ].join(', '),
        backgroundSize: '24px 24px',
      }
    case 'waves':
      return {
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${waveColor} 10px, ${waveColor} 20px)`,
      }
    default:
      return {}
  }
}
