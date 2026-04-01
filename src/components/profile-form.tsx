'use client'

import { useState, useTransition } from 'react'
import { AlertCircle, User, Save } from 'lucide-react'
import { Spinner } from '@/components/spinner'
import { updateProfile } from '@/lib/actions/profile'
import { useToast, ToastContainer } from '@/components/toast'

interface Props {
  displayName: string
}

export function ProfileForm({ displayName }: Props) {
  const [value, setValue] = useState(displayName)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const { toasts, addToast, removeToast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmed = value.trim()
    if (trimmed.length < 2) { setError('Nama tampilan minimal 2 karakter.'); return }
    if (trimmed.length > 50) { setError('Nama tampilan maksimal 50 karakter.'); return }

    startTransition(async () => {
      const result = await updateProfile({ displayName: trimmed })
      if (result.error) {
        setError(result.error)
        addToast('Gagal memperbarui nama tampilan.', 'error')
      } else {
        addToast('Nama tampilan berhasil diperbarui.')
      }
    })
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div>
          <h2 className="text-base font-bold text-gray-900">Nama Tampilan</h2>
          <p className="text-sm text-gray-500 mt-0.5">Nama yang ditampilkan di profil dan dashboard Anda.</p>
        </div>

        {error && (
          <div role="alert" className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
            {error}
          </div>
        )}

        <div>
          <label htmlFor="display-name" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Nama Tampilan <span className="text-red-400" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
            <input
              id="display-name"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoComplete="name"
              disabled={isPending}
              aria-describedby={error ? 'display-name-error' : undefined}
              aria-invalid={!!error}
              maxLength={50}
              className={`w-full pl-10 pr-3.5 py-3 bg-gray-50 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                error ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="cth. Budi Santoso"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">{value.length}/50 karakter</p>
        </div>

        <div className="flex justify-end pt-2 border-t border-gray-100">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? <><Spinner />Menyimpan...</> : <><Save className="w-4 h-4" aria-hidden="true" />Simpan Perubahan</>}
          </button>
        </div>
      </form>
    </>
  )
}
