'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { Spinner } from '@/components/spinner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { deleteStore } from '@/lib/actions/store'

interface Props {
  storeId: string
  storeName: string
}

export function StoreDeleteSection({ storeId, storeName }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [, startTransition] = useTransition()

  const handleConfirm = () => {
    setLoading(true)
    startTransition(async () => {
      await deleteStore(storeId)
      setLoading(false)
      router.push('/store')
    })
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-red-100 p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Hapus Toko</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Tindakan ini permanen. Semua menu dan pengaturan toko akan dihapus.
            </p>
          </div>
        </div>
        <div className="flex justify-end pt-2 border-t border-red-50">
          <button type="button" onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors">
            <Trash2 className="w-4 h-4" />
            Hapus Toko
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={open}
        title="Hapus toko?"
        description={`"${storeName}" beserta semua menunya akan dihapus permanen dan tidak bisa dikembalikan.`}
        confirmLabel="Hapus"
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
        loading={loading}
      />
    </>
  )
}
