'use client'

import { useState, useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { Spinner } from '@/components/spinner'
import { deleteStore } from '@/lib/actions/store'

interface Props {
  storeId: string
  storeName: string
}

export function StoreDeleteButton({ storeId, storeName }: Props) {
  const [confirm, setConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (confirm) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500 mr-1">Hapus?</span>
        <button
          onClick={() => startTransition(async () => { await deleteStore(storeId) })}
          disabled={isPending}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-60"
        >
          {isPending ? <Spinner /> : <Trash2 className="w-3.5 h-3.5" />}
          Ya
        </button>
        <button
          onClick={() => setConfirm(false)}
          disabled={isPending}
          className="px-2.5 py-1.5 border border-gray-200 text-xs font-medium rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      title={`Hapus ${storeName}`}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
