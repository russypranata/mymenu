'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from './theme-provider'

interface DarkModeToggleProps {
  storeId: string
  enabled: boolean
}

export function DarkModeToggle({ storeId, enabled }: DarkModeToggleProps) {
  const { isDark, setIsDark } = useTheme()
  const storageKey = `dark-mode-${storeId}`

  const toggle = () => {
    const newValue = !isDark
    setIsDark(newValue)
    localStorage.setItem(storageKey, String(newValue))
    window.dispatchEvent(new CustomEvent('darkModeChange', { detail: { isDark: newValue } }))
  }

  if (!enabled) return null

  return (
    // Kiri bawah — tidak pernah overlap dengan cart (kanan) atau scroll-to-top (kanan)
    <button
      onClick={toggle}
      className="fixed bottom-6 left-4 sm:left-6 z-40 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      style={{ backgroundColor: isDark ? '#1f2937' : 'var(--color-primary)' }}
      aria-label={isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
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
