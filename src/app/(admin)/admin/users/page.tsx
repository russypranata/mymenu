import { getAdminUsers, getAdminUserDetail } from '@/lib/queries/admin'
import { formatDate } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { UserFilters } from './user-filters'
import { UserActions } from './user-actions'
import { UserDetailModal } from './user-detail-modal'
import { AdminPagination } from '@/components/admin-pagination'
import { Users } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Users — Admin Menuly',
}

const PAGE_SIZE = 20

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; role?: string; search?: string; userId?: string; page?: string }>
}) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page ?? 1))
  const supabase = await createClient()
  const { data: { user: currentUser } } = await supabase.auth.getUser()

  const { data: users, total } = await getAdminUsers({
    status: params.status,
    role: params.role,
    search: params.search,
    page,
    pageSize: PAGE_SIZE,
  })

  const selectedUser = params.userId
    ? await getAdminUserDetail(params.userId)
    : null

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Users</h1>
            <p className="text-sm text-gray-500 mt-0.5">{total} user ditemukan.</p>
          </div>
        </div>
      </div>

      <UserFilters
        currentStatus={params.status}
        currentRole={params.role}
        currentSearch={params.search}
      />

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Email</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Nama</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Bergabung</th>
                <th className="text-right px-5 py-3.5 text-gray-400 font-semibold text-xs uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center text-gray-400">
                    Tidak ada user ditemukan.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <a
                        href={`/admin/users?${new URLSearchParams({ ...params, userId: user.id }).toString()}`}
                        className="text-gray-900 hover:text-red-500 transition-colors font-medium"
                      >
                        {user.email}
                      </a>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{user.display_name || '-'}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        user.role === 'admin'
                          ? 'bg-red-50 text-red-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                      {user.created_at ? formatDate(user.created_at) : '-'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <UserActions
                        userId={user.id}
                        currentStatus={user.status ?? 'active'}
                        isSelf={user.id === currentUser?.id}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="sm:hidden divide-y divide-gray-50">
          {users.length === 0 ? (
            <p className="px-5 py-14 text-center text-gray-400 text-sm">Tidak ada user ditemukan.</p>
          ) : (
            users.map((user) => (
              <div key={user.id} className="px-4 py-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <a
                    href={`/admin/users?${new URLSearchParams({ ...params, userId: user.id }).toString()}`}
                    className="text-sm font-semibold text-gray-900 hover:text-green-500 transition-colors truncate"
                  >
                    {user.email}
                  </a>
                  <StatusBadge status={user.status} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                      {user.role}
                    </span>
                    <span className="text-xs text-gray-400">{user.created_at ? formatDate(user.created_at) : '-'}</span>
                  </div>
                  <UserActions userId={user.id} currentStatus={user.status ?? 'active'} isSelf={user.id === currentUser?.id} />
                </div>
              </div>
            ))
          )}
        </div>

        <AdminPagination total={total} page={page} pageSize={PAGE_SIZE} />
      </div>

      {selectedUser && params.userId && (
        <UserDetailModal detail={selectedUser} userId={params.userId} currentParams={params} />
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string | null }) {
  const map: Record<string, string> = {
    active: 'bg-green-50 text-green-600',
    inactive: 'bg-gray-100 text-gray-500',
    suspended: 'bg-red-50 text-red-600',
  }
  const cls = map[status ?? ''] ?? 'bg-gray-100 text-gray-500'
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>
      {status ?? '-'}
    </span>
  )
}
