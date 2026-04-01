'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Edit, Trash2, ToggleLeft, ToggleRight, UtensilsCrossed } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useToast, ToastContainer } from '@/components/toast'
import { toggleMenuStatus as toggleMenuStatusAction, deleteMenu as deleteMenuAction } from '@/lib/actions/menu'
import type { Database } from '@/types/database.types'

type Menu = Database['public']['Tables']['menus']['Row']

interface DeleteTarget {
  id: string
  name: string
}

export function MenuList({ initialMenus, storeId }: { initialMenus: Menu[]; storeId: string }) {
  const [menus, setMenus] = useState<Menu[]>(initialMenus)
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set())
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [, startTransition] = useTransition()
  const { toasts, addToast, removeToast } = useToast()

  const setPending = (id: string, pending: boolean) => {
    setPendingIds(prev => {
      const next = new Set(prev)
      pending ? next.add(id) : next.delete(id)
      return next
    })
  }

  const toggleMenuStatus = (menu: Menu) => {
    setPending(menu.id, true)
    startTransition(async () => {
      const { error } = await toggleMenuStatusAction(menu.id, !menu.is_active)
      setPending(menu.id, false)
      if (error) { addToast('Gagal mengubah status menu', 'error'); return }
      setMenus(prev => prev.map(m => m.id === menu.id ? { ...m, is_active: !m.is_active } : m))
      addToast(menu.is_active ? 'Menu dinonaktifkan' : 'Menu diaktifkan')
    })
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    const { error } = await deleteMenuAction(deleteTarget.id)
    setDeleteLoading(false)
    if (error) { addToast('Gagal menghapus menu', 'error'); return }
    setMenus(prev => prev.filter(m => m.id !== deleteTarget.id))
    addToast('Menu berhasil dihapus')
    setDeleteTarget(null)
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Delete confirmation modal */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus menu?"
        description={`"${deleteTarget?.name}" akan dihapus permanen dan tidak bisa dikembalikan.`}
        confirmLabel="Hapus"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
      />

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-3 border-b border-gray-50 bg-gray-50/50">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Daftar Item</p>
        </div>
        <ul className="divide-y divide-gray-50">
          {menus.map((menu) => {
            const isItemPending = pendingIds.has(menu.id)
            return (
              <li
                key={menu.id}
                className={`px-4 sm:px-6 py-4 flex items-center gap-3 sm:gap-4 transition-opacity ${!menu.is_active ? 'opacity-50' : ''}`}
              >
                {/* Image */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                  {menu.image_url ? (
                    <Image
                      src={menu.image_url}
                      alt={menu.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
                      <UtensilsCrossed className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{menu.name}</p>
                  {menu.description && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{menu.description}</p>
                  )}
                  <p className="text-sm font-semibold text-green-500 mt-1">{formatCurrency(menu.price)}</p>
                </div>

                {/* Status badge */}
                <span className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 hidden sm:inline ${
                  menu.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {menu.is_active ? 'Aktif' : 'Nonaktif'}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => toggleMenuStatus(menu)}
                    disabled={isItemPending}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    aria-label={menu.is_active ? `Nonaktifkan ${menu.name}` : `Aktifkan ${menu.name}`}
                  >
                    {isItemPending ? (
                      <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    ) : menu.is_active ? (
                      <ToggleRight className="h-6 w-6 text-green-500" aria-hidden="true" />
                    ) : (
                      <ToggleLeft className="h-6 w-6" aria-hidden="true" />
                    )}
                  </button>
                  <Link
                    href={`/store/${storeId}/menu/${menu.id}/edit`}
                    className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    aria-label={`Edit ${menu.name}`}
                  >
                    <Edit className="h-5 w-5" aria-hidden="true" />
                  </Link>
                  <button
                    onClick={() => setDeleteTarget({ id: menu.id, name: menu.name })}
                    disabled={isItemPending}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                    aria-label={`Hapus ${menu.name}`}
                  >
                    <Trash2 className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
