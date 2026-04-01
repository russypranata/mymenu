'use client'

import { useState, useTransition } from 'react'
import { Plus, Pencil, Trash2, Check, X, Tag } from 'lucide-react'
import { createCategory, updateCategory, deleteCategory } from '@/lib/actions/category'
import { useToast, ToastContainer } from '@/components/toast'
import { Spinner } from '@/components/spinner'
import type { Database } from '@/types/database.types'

type Category = Database['public']['Tables']['categories']['Row']

interface Props {
  storeId: string
  initialCategories: Category[]
}

export function CategoryManager({ storeId, initialCategories }: Props) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [isPending, startTransition] = useTransition()
  const { toasts, addToast, removeToast } = useToast()

  const handleCreate = () => {
    const trimmed = newName.trim()
    if (!trimmed) return
    startTransition(async () => {
      const { error } = await createCategory(storeId, trimmed)
      if (error) { addToast('Gagal membuat kategori.', 'error'); return }
      // optimistic: refetch via revalidate happens server-side, just update local
      setCategories(prev => [...prev, { id: Date.now().toString(), store_id: storeId, name: trimmed, order: 0, created_at: new Date().toISOString() }])
      setNewName('')
      addToast('Kategori berhasil ditambahkan.')
    })
  }

  const handleUpdate = (id: string) => {
    const trimmed = editingName.trim()
    if (!trimmed) return
    startTransition(async () => {
      const { error } = await updateCategory(id, trimmed)
      if (error) { addToast('Gagal mengubah kategori.', 'error'); return }
      setCategories(prev => prev.map(c => c.id === id ? { ...c, name: trimmed } : c))
      setEditingId(null)
      addToast('Kategori berhasil diubah.')
    })
  }

  const handleDelete = (id: string, name: string) => {
    startTransition(async () => {
      const { error } = await deleteCategory(id)
      if (error) { addToast('Gagal menghapus kategori.', 'error'); return }
      setCategories(prev => prev.filter(c => c.id !== id))
      addToast(`Kategori "${name}" dihapus.`)
    })
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Tag className="w-4 h-4 text-green-500" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Kategori Menu</h2>
            <p className="text-xs text-gray-500">Kelompokkan menu berdasarkan jenis.</p>
          </div>
        </div>

        {/* Add new */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            placeholder="Nama kategori baru..."
            maxLength={50}
            className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all"
          />
          <button
            onClick={handleCreate}
            disabled={isPending || !newName.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? <Spinner /> : <Tag className="w-4 h-4" />}
            Tambah
          </button>
        </div>

        {/* List */}
        {categories.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Belum ada kategori.</p>
        ) : (
          <ul className="space-y-2">
            {categories.map(cat => (
              <li key={cat.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                {editingId === cat.id ? (
                  <>
                    <input
                      type="text"
                      value={editingName}
                      onChange={e => setEditingName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleUpdate(cat.id); if (e.key === 'Escape') setEditingId(null) }}
                      autoFocus
                      maxLength={50}
                      className="flex-1 px-3 py-1.5 bg-white border border-green-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                    />
                    <button onClick={() => handleUpdate(cat.id)} disabled={isPending}
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" aria-label="Simpan">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingId(null)}
                      className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Batal">
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm font-medium text-gray-800">{cat.name}</span>
                    <button onClick={() => { setEditingId(cat.id); setEditingName(cat.name) }}
                      className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" aria-label={`Edit ${cat.name}`}>
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(cat.id, cat.name)} disabled={isPending}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50" aria-label={`Hapus ${cat.name}`}>
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
