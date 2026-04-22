import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { Store, UtensilsCrossed, ArrowRight, ExternalLink, TrendingUp, AlertTriangle, Zap, MessageCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { getStoresByUser } from '@/lib/queries/store'
import { getMenuCount } from '@/lib/queries/menu'
import { getProfile, getSubscription, getPageViewCount, getWhatsAppClickCount, getDailyAnalytics } from '@/lib/queries/dashboard'
import { AnalyticsChart } from '@/components/analytics-chart'
import { OnboardingChecklist } from '@/components/onboarding-checklist'

export const metadata: Metadata = {
  title: 'Dashboard — MyMenu',
  description: 'Kelola toko dan menu digital Anda.',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect('/login')

  const [stores, profile, subscription] = await Promise.all([
    getStoresByUser(user.id),
    getProfile(user.id),
    getSubscription(user.id),
  ])

  const storeIds = stores.map(s => s.id)
  const [menuCount, viewCount, waClickCount, dailyAnalytics] = await Promise.all([
    getMenuCount(storeIds),
    getPageViewCount(storeIds),
    getWhatsAppClickCount(storeIds),
    getDailyAnalytics(storeIds, 7),
  ])

  const firstStore = stores[0]
  const firstName = (profile?.display_name || profile?.email || user.email || '').split('@')[0]

  const expiresAt = subscription?.expires_at ? new Date(subscription.expires_at) : null
  const daysUntilExpiry = expiresAt ? Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null
  const expiresSoon = daysUntilExpiry !== null && daysUntilExpiry <= 3 && daysUntilExpiry >= 0

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 font-medium mb-1">Selamat datang kembali</p>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Halo, {firstName} 👋
          </h1>
        </div>
        {!stores.length && (
          <Link
            href="/store/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors shadow-sm"
          >
            <Store className="w-4 h-4" />
            Buat Toko
          </Link>
        )}      </div>

      {/* Onboarding checklist — only show if not fully set up */}
      {(stores.length === 0 || menuCount === 0) && (
        <OnboardingChecklist
          hasStore={stores.length > 0}
          hasMenu={menuCount > 0}
          hasShared={stores.length > 0}
        />
      )}

      {/* Banners - only show expiry warning, subscription activation handled by layout */}
      {subscription?.status === 'trial' && !expiresSoon && daysUntilExpiry !== null && daysUntilExpiry > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-green-900">Trial aktif — {daysUntilExpiry} hari tersisa</p>
              <p className="text-xs text-green-600 mt-0.5">Berakhir {formatDate(subscription.expires_at!)}. Nikmati semua fitur selama masa trial.</p>
            </div>
          </div>
        </div>
      )}

      {expiresSoon && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-red-900">Langganan berakhir dalam {daysUntilExpiry} hari</p>
              <p className="text-xs text-red-600 mt-0.5">Berakhir {formatDate(subscription!.expires_at!)}. Hubungi admin untuk perpanjang.</p>
            </div>
          </div>
          <Link
            href="/profile"
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Lihat Detail
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Store className={`w-4 h-4 ${stores.length > 0 ? 'text-green-500' : 'text-gray-400'}`} />}
          iconBg={stores.length > 0 ? 'bg-green-50' : 'bg-gray-50'}
          label="Status Toko"
          value={
            <span className={`text-sm font-bold ${stores.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
              {stores.length > 0 ? 'Aktif' : 'Belum ada'}
            </span>
          }
        />
        <StatCard
          icon={<UtensilsCrossed className="w-4 h-4 text-green-500" />}
          iconBg="bg-green-50"
          label="Total Menu"
          value={menuCount}
        />
        <StatCard
          icon={<TrendingUp className="w-4 h-4 text-blue-500" />}
          iconBg="bg-blue-50"
          label="Total Views"
          value={viewCount}
        />
        <StatCard
          icon={<MessageCircle className="w-4 h-4 text-emerald-500" />}
          iconBg="bg-emerald-50"
          label="Klik WhatsApp"
          value={waClickCount}
        />
      </div>

      {/* Stores */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Toko Anda</h2>
            <p className="text-xs text-gray-400 mt-0.5">Halaman menu digital yang bisa dibagikan via link & QR code</p>
          </div>
        </div>

        {stores.length > 0 ? (
          <ul className="divide-y divide-gray-50">
            {stores.map((store) => (
              <li key={store.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Store className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{store.name}</p>
                    <p className="text-xs font-mono text-gray-400 mt-0.5">/{store.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Link
                    href={`/store/${store.id}/menu`}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    Menu
                  </Link>
                  <Link
                    href={`/${store.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                    title="Lihat menu publik"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-14 text-center">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Store className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Belum ada toko</h3>
            <p className="text-sm text-gray-500 mb-5 max-w-xs mx-auto">Buat halaman menu digital usaha Anda — bisa langsung dibagikan via link atau QR code ke pelanggan.</p>
            <Link
              href="/store/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors"
            >
              <Store className="w-4 h-4" />
              Buat Toko Sekarang
            </Link>
          </div>
        )}
      </div>

      {/* Analytics Chart */}
      {storeIds.length > 0 && (
        <AnalyticsChart data={dailyAnalytics} />
      )}

      {/* Quick actions */}
      {firstStore && (        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href={stores.length === 1 ? `/store/${firstStore.id}/menu/new` : '/store'}
            className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors flex-shrink-0">
              <UtensilsCrossed className="w-5 h-5 text-green-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900">Tambah Menu</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {stores.length === 1 ? `Tambahkan item ke ${firstStore.name}` : 'Pilih toko lalu tambah item'}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-green-400 transition-colors flex-shrink-0" />
          </Link>

          <Link
            href={stores.length === 1 ? `/${firstStore.slug}` : '/store'}
            target={stores.length === 1 ? '_blank' : undefined}
            rel={stores.length === 1 ? 'noopener noreferrer' : undefined}
            className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors flex-shrink-0">
              <ExternalLink className="w-5 h-5 text-green-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900">Lihat Menu Publik</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {stores.length === 1 ? 'Tampilan yang dilihat pelanggan' : 'Pilih toko untuk melihat menu'}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-green-400 transition-colors flex-shrink-0" />
          </Link>
        </div>
      )}
    </div>
  )
}

function StatCard({
  icon,
  iconBg,
  label,
  value,
}: {
  icon: React.ReactNode
  iconBg: string
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      {typeof value === 'number'
        ? <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{value}</p>
        : <div className="mt-0.5">{value}</div>}
    </div>
  )
}
