'use client'

import { useState, useTransition } from 'react'
import { AlertCircle, AlertTriangle, Trash2 } from 'lucide-react'
import { Spinner } from '@/components/spinner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { deleteAccount } from '@/lib/actions/profile'

interface Props {
  userEmail: string
}

export function DeleteAccountSection({ userEmail }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [confirmEmail, setConfirmEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleOpenDialog = () => {
    setConfirmEmail('')
    setError(null)
    setDialogOpen(true)
  }

  const handleCancel = () => {
    setDialogOpen(false)
    setConfirmEmail('')
    setError(null)
  }

  const handleConfirm = () => {
    setError(null)

    if (!confirmEmail.trim()) {
      setError('Masukkan email Anda untuk konfirmasi.')
      return
    }
    if (confirmEmail.trim() !== userEmail) {
      setError('Email tidak sesuai. Silakan coba lagi.')
      return
    }

    startTransition(async () => {
      const result = await deleteAccount({ confirmEmail: confirmEmail.trim() })
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-red-100 p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Hapus Akun</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Tindakan ini bersifat permanen dan tidak dapat dibatalkan. Semua data Anda akan dihapus.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-red-50">
          <button
            type="button"
            onClick={handleOpenDialog}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
            Hapus Akun
          </button>
        </div>
      </div>

      {/* Custom dialog with email confirmation input */}
      {dialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-desc"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleCancel}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" aria-hidden="true" />
              </div>
              <div>
                <h2 id="delete-dialog-title" className="text-base font-bold text-gray-900">Konfirmasi Hapus Akun</h2>
                <p id="delete-dialog-desc" className="text-sm text-gray-500 mt-1">
                  Ketik email Anda <span className="font-semibold text-gray-700">{userEmail}</span> untuk mengonfirmasi penghapusan akun.
                </p>
              </div>
            </div>

            {error && (
              <div role="alert" className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
                {error}
              </div>
            )}

            <div>
              <label htmlFor="confirm-email-input" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Konfirmasi
              </label>
              <input
                id="confirm-email-input"
                type="email"
                value={confirmEmail}
                onChange={(e) => { setConfirmEmail(e.target.value); setError(null) }}
                autoComplete="off"
                aria-invalid={!!error}
                className={`w-full px-3.5 py-3 bg-gray-50 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all ${
                  error ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder={userEmail}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isPending}
                className="px-4 py-2.5 border border-gray-200 text-sm font-medium rounded-xl text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Spinner />
                    Menghapus...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                    Hapus Akun Saya
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
