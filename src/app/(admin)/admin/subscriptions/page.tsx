import { getAdminSubscriptions } from '@/lib/queries/admin'
import { SubFilters } from './sub-filters'
import { SubActions } from './sub-actions'
import { AdminPagination } from '@/components/admin-pagination'
import { CreditCard } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Subscriptions — Admin Menuly',
}

const PAGE_SIZE = 20

function formatDMY(dateStr: string | null) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-50 text-green-600',
  trial: 'bg-amber-50 text-amber-600',
  expired: 'bg-gray-100 text-gray-500',
  cancelled: 'bg-red-50 text-red-600',
}

const PLAN_BADGE: Record<string, { label: string; className: string }> = {
  annual: { label: 'Tahunan', className: 'bg-green-50 text-green-600' },
  monthly: { label: 'Bulanan', className: 'bg-gray-100 text-gray-500' },
}

export default async function AdminSubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page ?? 1))
  const { data: subscriptions, total } = await getAdminSubscriptions({ status: params.status, page, pageSize: PAGE_SIZE })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <CreditCard className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Subscriptions</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} subscription ditemukan.</p>
        </div>
      </div>

      <SubFilters currentStatus={params.status} />

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Email</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Nama</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Plan</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Mulai</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Berakhir</th>
                <th className="text-right px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center text-gray-400">
                    Tidak ada subscription ditemukan.
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 text-gray-900 font-medium">{sub.profiles?.email ?? '-'}</td>
                    <td className="px-5 py-3.5 text-gray-600">{sub.profiles?.display_name || '-'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[sub.status ?? ''] ?? 'bg-gray-100 text-gray-500'}`}>
                        {sub.status ?? '-'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {(() => {
                        const plan = PLAN_BADGE[sub.plan_type ?? 'monthly'] ?? PLAN_BADGE.monthly
                        return (
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${plan.className}`}>
                            {plan.label}
                          </span>
                        )
                      })()}
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{formatDMY(sub.started_at)}</td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{formatDMY(sub.expires_at)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <SubActions subscriptionId={sub.id} currentStatus={sub.status ?? ''} currentPlanType={sub.plan_type as 'monthly' | 'annual' ?? 'monthly'} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="sm:hidden divide-y divide-gray-50">
          {subscriptions.length === 0 ? (
            <p className="px-5 py-14 text-center text-gray-400 text-sm">Tidak ada subscription ditemukan.</p>
          ) : (
            subscriptions.map((sub) => (
              <div key={sub.id} className="px-4 py-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">{sub.profiles?.email ?? '-'}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_COLORS[sub.status ?? ''] ?? 'bg-gray-100 text-gray-500'}`}>
                    {sub.status ?? '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs text-gray-500">{sub.profiles?.display_name || '-'}</p>
                    <p className="text-xs text-gray-400">{formatDMY(sub.started_at)} — {formatDMY(sub.expires_at)}</p>
                    {(() => {
                      const plan = PLAN_BADGE[sub.plan_type ?? 'monthly'] ?? PLAN_BADGE.monthly
                      return (
                        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${plan.className}`}>
                          {plan.label}
                        </span>
                      )
                    })()}
                  </div>
                  <SubActions subscriptionId={sub.id} currentStatus={sub.status ?? ''} currentPlanType={sub.plan_type as 'monthly' | 'annual' ?? 'monthly'} />
                </div>
              </div>
            ))
          )}
        </div>

        <AdminPagination total={total} page={page} pageSize={PAGE_SIZE} />
      </div>
    </div>
  )
}
