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
    /*
     * Posisi: kanan bawah, tepat di atas WA/cart button
     * WA button: bottom-6 right-6 (24px dari bawah, tinggi ~44px)
     * Dark mode: bottom-20 right-6 (80px dari bawah = 24 + 44 + 12 gap)
     */
    <button
      onClick={toggle}
      className="fixed bottom-20 right-6 z-40 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
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
