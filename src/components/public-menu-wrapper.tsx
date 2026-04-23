'use client'

import { ReactNode } from 'react'
import { useTheme } from './theme-provider'

interface PublicMenuWrapperProps {
  children: ReactNode
  fontClass: string
  textSizeClass: string
  backgroundPattern: string
}

export function PublicMenuWrapper({ children, fontClass, textSizeClass, backgroundPattern }: PublicMenuWrapperProps) {
  const { isDark } = useTheme()
  
  const pageBg = isDark ? 'bg-slate-950' : 'bg-[#FDFDFD]'
  
  return (
    <div className={`min-h-screen ${pageBg} ${backgroundPattern} ${fontClass} ${textSizeClass}`}>
      {children}
    </div>
  )
}
