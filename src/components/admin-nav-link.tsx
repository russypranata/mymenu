'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, CreditCard, Store, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const iconMap: Record<string, LucideIcon> = {
  '/admin': LayoutDashboard,
  '/admin/users': Users,
  '/admin/subscriptions': CreditCard,
  '/admin/stores': Store,
}

interface AdminNavLinkProps {
  href: string
  label: string
  mobile?: boolean
}

export function AdminNavLink({ href, label, mobile }: AdminNavLinkProps) {
  const pathname = usePathname()
  const isActive =
    href === '/admin'
      ? pathname === '/admin'
      : pathname === href || pathname.startsWith(href + '/')

  const Icon = iconMap[href] ?? LayoutDashboard

  if (mobile) {
    return (
      <Link
        href={href}
        className={cn(
          'flex flex-col items-center gap-1 px-3 py-2 text-[10px] font-semibold rounded-xl transition-colors min-w-0',
          isActive ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'
        )}
      >
        <Icon className={cn('w-5 h-5', isActive ? 'text-green-500' : 'text-gray-400')} />
        <span className="truncate">{label}</span>
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
