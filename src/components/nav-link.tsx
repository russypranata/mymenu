'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, UtensilsCrossed, Store, User, BookOpen, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const iconMap: Record<string, LucideIcon> = {
  '/dashboard': LayoutDashboard,
  '/store': Store,
  '/menu': UtensilsCrossed,
  '/guide': BookOpen,
  '/profile': User,
}

interface NavLinkProps {
  href: string
  label: string
  mobile?: boolean
}

export function NavLink({ href, label, mobile }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || (
    href !== '/dashboard' &&
    pathname.startsWith(href) &&
    !(href === '/store' && pathname.includes('/menu'))
  )
  const Icon = iconMap[href] ?? LayoutDashboard

  if (mobile) {
    return (
      <Link
        href={href}
        className={cn(
          // min-h-[44px] ensures WCAG 2.5 touch target minimum
          'flex flex-col items-center justify-center gap-0.5 px-3 py-2 min-h-[44px] text-[10px] font-semibold rounded-xl transition-colors min-w-0 flex-1',
          isActive ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'
        )}
      >
        <Icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-green-500' : 'text-gray-400')} />
        <span className="truncate leading-tight">{label}</span>
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors group',
        isActive
          ? 'bg-green-50 text-green-600'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      )}
    >
      <Icon
        className={cn(
          'w-4 h-4 flex-shrink-0 transition-colors',
          isActive ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-600'
        )}
      />
      {label}
    </Link>
  )
}
