'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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

interface ThemeProviderProps {
  children: ReactNode
  storeId: string
  defaultDark: boolean
  darkModeEnabled: boolean
}

export function ThemeProvider({ children, storeId, defaultDark, darkModeEnabled }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(defaultDark)
  const storageKey = `dark-mode-${storeId}`

  useEffect(() => {
    if (!darkModeEnabled) {
      // If dark mode toggle is disabled, use default theme
      setIsDark(defaultDark)
      return
    }

    // Load saved preference
    const saved = localStorage.getItem(storageKey)
    if (saved !== null) {
      setIsDark(saved === 'true')
    }

    // Listen for dark mode changes
    const handleDarkModeChange = (e: CustomEvent<{ isDark: boolean }>) => {
      setIsDark(e.detail.isDark)
    }

    window.addEventListener('darkModeChange' as any, handleDarkModeChange)
    return () => {
      window.removeEventListener('darkModeChange' as any, handleDarkModeChange)
    }
  }, [storeId, storageKey, defaultDark, darkModeEnabled])

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  )
}
