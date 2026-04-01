import { getAdminStats, SUBSCRIPTION_PRICE } from '@/lib/queries/admin'
import { Users, Store, CreditCard, Clock, ShieldOff, TrendingUp, LayoutDashboard } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Overview — Admin MyMenu',
}

export default async function AdminOverviewPage() {
  const stats = await getAdminStats()

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <LayoutDashboard className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">Ringkasan platform MyMenu.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard
          icon={<Users className="w-4 h-4 text-green-500" />}
          iconBg="bg-green-50"
          label="Total Users"
          value={stats.totalUsers}
        />
        <StatCard
          icon={<Store className="w-4 h-4 text-green-500" />}
          iconBg="bg-green-50"
          label="Total Stores"
          value={stats.totalStores}
        />
        <StatCard
          icon={<CreditCard className="w-4 h-4 text-green-500" />}
          iconBg="bg-green-50"
          label="Aktif"
          value={stats.activeSubscriptions}
        />
        <StatCard
          icon={<Clock className="w-4 h-4 text-amber-500" />}
          iconBg="bg-amber-50"
          label="Trial"
          value={stats.trialSubscriptions}
        />
        <StatCard
          icon={<ShieldOff className="w-4 h-4 text-red-500" />}
          iconBg="bg-red-50"
          label="Suspended"
          value={stats.suspendedUsers}
        />
        <StatCard
          icon={<TrendingUp className="w-4 h-4 text-green-500" />}
          iconBg="bg-green-50"
          label="Est. Revenue"
          value={`Rp ${stats.estimatedRevenue.toLocaleString('id-ID')}`}
          isText
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
        <p className="text-xs text-gray-400">
          Estimasi revenue dihitung dari {stats.activeSubscriptions} langganan aktif × Rp {SUBSCRIPTION_PRICE.toLocaleString('id-ID')} / bulan.
        </p>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  iconBg,
  label,
  value,
  isText,
}: {
  icon: React.ReactNode
  iconBg: string
  label: string
  value: number | string
  isText?: boolean
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      {isText ? (
        <p className="text-lg font-extrabold text-gray-900 mt-0.5">{value}</p>
      ) : (
        <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{value}</p>
      )}
    </div>
  )
}
