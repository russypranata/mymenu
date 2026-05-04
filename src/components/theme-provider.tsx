'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getContrastColor } from '@/lib/utils'

interface ThemeContextType {
  isDark: boolean
  setIsDark: (value: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

/**
 * Convert a hex color string to "r, g, b" channel values.
 * Used to build rgba() variables without color-mix() (broader browser support).
 * Falls back to green (22, 163, 74) if the hex is invalid.
 */
function hexToRgbChannels(hex: string): string {
  const clean = hex.replace('#', '')
  // Support both 3-char and 6-char hex
  const full =
    clean.length === 3
      ? clean.split('').map(c => c + c).join('')
      : clean
  const r = parseInt(full.substring(0, 2), 16)
  const g = parseInt(full.substring(2, 4), 16)
  const b = parseInt(full.substring(4, 6), 16)
  if (isNaN(r) || isNaN(g) || isNaN(b)) return '22, 163, 74'
  return `${r}, ${g}, ${b}`
}

interface ThemeProviderProps {
  children: ReactNode
  storeId: string
  defaultDark: boolean
  darkModeEnabled: boolean
  primaryColor: string
  accentColor: string
}

export function ThemeProvider({
  children,
  storeId,
  defaultDark,
  darkModeEnabled,
  primaryColor,
  accentColor,
}: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(defaultDark)
  const storageKey = `dark-mode-${storeId}`

  useEffect(() => {
    if (!darkModeEnabled) {
      setIsDark(defaultDark)
      return
    }

    const saved = localStorage.getItem(storageKey)
    if (saved !== null) {
      setIsDark(saved === 'true')
    }

    const handleDarkModeChange = (e: CustomEvent<{ isDark: boolean }>) => {
      setIsDark(e.detail.isDark)
    }

    window.addEventListener('darkModeChange' as any, handleDarkModeChange)
    return () => {
      window.removeEventListener('darkModeChange' as any, handleDarkModeChange)
    }
  }, [storeId, storageKey, defaultDark, darkModeEnabled])

  const primaryRgb = hexToRgbChannels(primaryColor)
  const accentRgb  = hexToRgbChannels(accentColor)

  // Auto-compute text color that contrasts against the primary button background.
  // If owner picks a very light primary color, button text becomes dark instead of white.
  const primaryTextColor = getContrastColor(primaryColor) === 'dark' ? '#111827' : '#ffffff'

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      {/*
       * CSS custom properties injected at root:
       *   --color-primary          → full hex
       *   --color-primary-rgb      → "r, g, b" for rgba() usage (no color-mix needed)
       *   --color-primary-text     → auto-contrast text color for buttons on primary bg
       *   --color-accent           → full hex
       *   --color-accent-rgb       → "r, g, b" for rgba() usage
       */}
      <div
        style={
          {
            '--color-primary':      primaryColor,
            '--color-primary-rgb':  primaryRgb,
            '--color-primary-text': primaryTextColor,
            '--color-accent':       accentColor,
            '--color-accent-rgb':   accentRgb,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
