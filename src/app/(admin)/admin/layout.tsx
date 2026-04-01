import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { ClipboardList, ShieldCheck, UserCircle2 } from 'lucide-react'
import { AdminNavLink } from '@/components/admin-nav-link'
import { Breadcrumb } from '@/components/breadcrumb'
import { LogoutButton } from '@/components/logout-button'
import { getDisplayName } from '@/lib/profile-helpers'

const navItems = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/subscriptions', label: 'Subscriptions' },
  { href: '/admin/stores', label: 'Stores' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Guard: user should always be present here (enforced by (admin)/layout.tsx),
  // but we avoid non-null assertion to prevent runtime crash on edge cases.
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('email, display_name, avatar_url')
    .eq('id', user.id)
    .maybeSingle()

  const displayName = getDisplayName(profile ?? { display_name: null, email: user.email ?? '' })
  const avatarUrl = (profile as any)?.avatar_url ?? null

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex-col hidden md:flex shadow-sm">

        {/* Brand */}
        <Link
          href="/admin"
          className="flex items-center gap-3 px-5 h-16 border-b border-gray-100 flex-shrink-0 hover:bg-gray-50 transition-colors"
        >
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-gray-900 tracking-tight text-sm leading-tight">Admin Panel</span>
            <span className="text-gray-400 text-[11px] leading-tight">MyMenu</span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Navigasi</p>
          {navItems.map(({ href, label }) => (
            <AdminNavLink key={href} href={href} label={label} />
          ))}
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
          <Link href="/admin" className="flex items-center gap-2 md:hidden">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-gray-800 text-base">Admin</span>
          </Link>

          {/* Desktop breadcrumb */}
          <div className="hidden md:block">
            <Breadcrumb />
          </div>

          {/* Right: admin badge */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-green-50 border border-green-100 flex items-center justify-center">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={displayName} fill sizes="36px" className="object-cover" />
              ) : (
                <UserCircle2 className="w-6 h-6 text-green-400" strokeWidth={1.5} />
              )}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-700 leading-tight">{displayName}</p>
              <p className="text-xs text-gray-400 leading-tight">Administrator</p>
            </div>
          </div>
        </header>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-t border-gray-100 flex items-center justify-around px-2 h-16 shadow-lg">
          {navItems.map(({ href, label }) => (
            <AdminNavLink key={href} href={href} label={label} mobile />
          ))}
        </nav>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-100 bg-white px-8 py-4 flex-shrink-0 hidden md:flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center flex-shrink-0">
              <ClipboardList className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm text-gray-500">&copy; {new Date().getFullYear()} MyMenu Admin.</span>
          </div>
          <span className="text-sm text-gray-400">v1.0.0</span>
        </footer>
      </div>
    </div>
  )
}
