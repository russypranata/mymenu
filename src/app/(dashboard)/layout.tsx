import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Database } from '@/types/database.types'
import { ClipboardList, UserCircle2 } from 'lucide-react'
import { LogoutButton } from '@/components/logout-button'
import { NavLink } from '@/components/nav-link'
import { MenuNavLink } from '@/components/menu-nav-link'
import { Breadcrumb } from '@/components/breadcrumb'
import { getDisplayName } from '@/lib/profile-helpers'
import { getSubscription, isSubscriptionValid } from '@/lib/queries/dashboard'
import { getStoresByUser } from '@/lib/queries/store'
import { SubscriptionBannerWrapper } from '@/components/subscription-banner-wrapper'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileResult, stores, subscription] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    getStoresByUser(user.id),
    getSubscription(user.id),
  ])

  // Suspended user guard — redirect before rendering anything
  const profile = (profileResult.data as Database['public']['Tables']['profiles']['Row'] | null)
  if (profile?.status === 'suspended') redirect('/suspended')

  // Subscription enforcement — block expired users after grace period
  const { isSubscriptionExpiredWithGrace } = await import('@/lib/queries/dashboard')
  if (isSubscriptionExpiredWithGrace(subscription)) {
    redirect('/subscription-expired')
  }

  // Onboarding guard — redirect if phone not filled yet
  if (!profile?.phone) redirect('/onboarding')
  const navStores = stores.map(s => ({ id: s.id, name: s.name }))
  const displayName = getDisplayName(profile ?? { display_name: null, email: user.email || '' })
  const avatarUrl = profile?.avatar_url ?? null

  const expiresAt = subscription?.expires_at ? new Date(subscription.expires_at) : null
  const daysUntilExpiry = expiresAt
    ? Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  // Calculate grace period days left (3 days after expiration)
  // Use start of day for consistent calculation
  const gracePeriodDaysLeft = expiresAt && subscription?.status === 'expired'
    ? (() => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const expiry = new Date(expiresAt)
        expiry.setHours(0, 0, 0, 0)
        const daysSinceExpiry = Math.floor((today.getTime() - expiry.getTime()) / (1000 * 60 * 60 * 24))
        return Math.max(0, 3 - daysSinceExpiry)
      })()
    : null

  const navItemsTop = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/store', label: 'Toko' },
  ]

  const navItemsBottom = [
    { href: '/guide', label: 'Panduan' },
    { href: '/profile', label: 'Akun' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex-col hidden md:flex shadow-sm">

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 px-5 h-16 border-b border-gray-100 flex-shrink-0 hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <ClipboardList className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-gray-900 tracking-tight text-sm leading-tight">Menuly</span>
            <span className="text-gray-400 text-[11px] leading-tight">Menu digital UMKM</span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Menu Utama</p>
          {navItemsTop.map(({ href, label }) => (
            <NavLink key={href} href={href} label={label} />
          ))}
          <MenuNavLink stores={navStores} />
          <div className="pt-3 mt-3 border-t border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Lainnya</p>
            {navItemsBottom.map(({ href, label }) => (
              <NavLink key={href} href={href} label={label} />
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100 flex-shrink-0">
          <LogoutButton />
        </div>
      </aside>

      {/* Main area */}
      <div className="md:ml-64 w-full min-w-0 flex flex-col min-h-screen">

        {/* Top header */}
        <header className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur border-b border-gray-100 flex items-center justify-between px-4 md:px-8 flex-shrink-0">
          {/* Mobile logo */}
          <Link href="/dashboard" className="flex items-center gap-2 md:hidden">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-gray-800 text-base">Menuly</span>
          </Link>

          {/* Desktop breadcrumb */}
          <div className="hidden md:block">
            <Breadcrumb />
          </div>

          {/* Right: avatar */}
          <Link href="/profile" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-green-50 border border-green-100 flex items-center justify-center">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={displayName} fill sizes="36px" className="object-cover" />
              ) : (
                <UserCircle2 className="w-6 h-6 text-green-400" strokeWidth={1.5} />
              )}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-700 leading-tight">{displayName}</p>
              <p className="text-xs text-gray-400 leading-tight">Owner</p>
            </div>
          </Link>
        </header>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-t border-gray-100 flex items-center justify-around px-2 h-16 shadow-lg">
          {navItemsTop.map(({ href, label }) => (
            <NavLink key={href} href={href} label={label} mobile />
          ))}
          <MenuNavLink stores={navStores} mobile />
          {navItemsBottom.map(({ href, label }) => (
            <NavLink key={href} href={href} label={label} mobile />
          ))}
        </nav>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
          {subscription && (subscription.status === 'trial' || subscription.status === 'active' || subscription.status === 'expired') && (
            <div className="mb-6">
              <SubscriptionBannerWrapper
                status={subscription.status as 'trial' | 'active' | 'expired'}
                planType={(subscription.plan_type as 'monthly' | 'annual') ?? 'monthly'}
                origin={(subscription.origin as 'trial' | 'paid') ?? 'trial'}
                expiresAt={subscription.expires_at ?? null}
                daysUntilExpiry={daysUntilExpiry}
                gracePeriodDaysLeft={gracePeriodDaysLeft}
              />
            </div>
          )}
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-100 bg-white px-8 py-4 flex-shrink-0 hidden md:flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center flex-shrink-0">
              <ClipboardList className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Menuly. Semua hak dilindungi.</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/privasi" className="text-sm text-gray-400 hover:text-green-500 transition-colors">Privasi</Link>
            <Link href="/syarat" className="text-sm text-gray-400 hover:text-green-500 transition-colors">Syarat</Link>
            <Link href="/bantuan" className="text-sm text-gray-400 hover:text-green-500 transition-colors">Bantuan</Link>
          </div>
        </footer>
      </div>
    </div>
  )
}
