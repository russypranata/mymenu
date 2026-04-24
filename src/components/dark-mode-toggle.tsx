'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from './theme-provider'

interface DarkModeToggleProps {
  storeId: string
  enabled: boolean
  primaryColor: string
}

export function DarkModeToggle({ storeId, enabled, primaryColor }: DarkModeToggleProps) {
  const { isDark, setIsDark } = useTheme()
  const storageKey = `dark-mode-${storeId}`

  const toggle = () => {
    const newValue = !isDark
    setIsDark(newValue)
    localStorage.setItem(storageKey, String(newValue))
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('darkModeChange', { detail: { isDark: newValue } }))
  }

  if (!enabled) return null

  return (
    <button
      onClick={toggle}
      className="fixed bottom-24 right-4 sm:right-6 z-40 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      style={{ backgroundColor: isDark ? '#1f2937' : primaryColor }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Mode Terang' : 'Mode Gelap'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-white" />
      ) : (
        <Moon className="w-5 h-5 text-white" />
      )}
    </button>
  )
}
