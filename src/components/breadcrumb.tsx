'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Store, UtensilsCrossed, User, Settings, Plus, Pencil, LucideIcon, CreditCard, BookOpen } from 'lucide-react'

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  store: 'Toko',
  menu: 'Menu',
  new: 'Tambah Baru',
  edit: 'Edit',
  settings: 'Pengaturan',
  profile: 'Profil',
  guide: 'Panduan',
  admin: 'Admin',
  users: 'Users',
  subscriptions: 'Subscriptions',
  stores: 'Stores',
}

const SEGMENT_ICONS: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  store: Store,
  menu: UtensilsCrossed,
  new: Plus,
  edit: Pencil,
  settings: Settings,
  profile: User,
  guide: BookOpen,
  admin: LayoutDashboard,
  users: User,
  subscriptions: CreditCard,
  stores: Store,
}

function isUuid(segment: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)
}

export function Breadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  const crumbs = segments
    .map((seg, i) => ({
      label: isUuid(seg) ? null : (SEGMENT_LABELS[seg] ?? seg),
      icon: isUuid(seg) ? null : (SEGMENT_ICONS[seg] ?? null),
      href: '/' + segments.slice(0, i + 1).join('/'),
    }))
    .filter(c => c.label !== null)

  if (crumbs.length === 0) {
    return (
      <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-2 text-sm text-gray-500">
        <span className="font-semibold text-gray-900">MyMenu</span>
      </nav>
    )
  }

  return (
    <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-1.5 text-sm text-gray-500">
      <span className="font-semibold text-gray-900">MyMenu</span>
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1
        const Icon = crumb.icon
        return (
          <span key={crumb.href} className="flex items-center gap-1.5">
            <span className="text-gray-300" aria-hidden="true">/</span>
            {isLast ? (
              <span className="flex items-center gap-1 text-gray-700 font-medium">
                {Icon && <Icon className="w-3.5 h-3.5 text-green-400" aria-hidden="true" />}
                {crumb.label}
              </span>
            ) : (
              <Link href={crumb.href} className="flex items-center gap-1 hover:text-green-500 transition-colors">
                {Icon && <Icon className="w-3.5 h-3.5" aria-hidden="true" />}
                {crumb.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
