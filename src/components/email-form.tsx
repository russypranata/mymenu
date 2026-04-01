'use client'

import { useState, useTransition } from 'react'
import { AlertCircle, Mail, Send } from 'lucide-react'
import { Spinner } from '@/components/spinner'
import { updateEmail } from '@/lib/actions/profile'
import { useToast, ToastContainer } from '@/components/toast'

interface Props {
  currentEmail: string
}

export function EmailForm({ currentEmail }: Props) {
  const [newEmail, setNewEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const { toasts, addToast, removeToast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmed = newEmail.trim()
    if (!trimmed) { setError('Email baru tidak boleh kosong.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) { setError('Format email tidak valid.'); return }
    if (trimmed === currentEmail) { setError('Email baru sama dengan email saat ini.'); return }

    startTransition(async () => {
      const result = await updateEmail({ newEmail: trimmed })
      if (result.error) {
        setError(result.error)
        addToast('Gagal mengirim konfirmasi email.', 'error')
      } else {
        addToast('Link konfirmasi dikirim ke email baru Anda.')
        setNewEmail('')
      }
    })
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div>
          <h2 className="text-base font-bold text-gray-900">Alamat Email</h2>
          <p className="text-sm text-gray-500 mt-0.5">Perubahan email memerlukan konfirmasi ke alamat baru.</p>
        </div>

        {error && (
          <div role="alert" className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
            {error}
          </div>
        )}

        <div>
          <p className="text-sm font-semibold text-gray-700 mb-1.5">Email Saat Ini</p>
          <div className="flex items-center gap-2.5 px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl">
            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
            <span className="text-sm text-gray-500">{currentEmail}</span>
          </div>
        </div>

        <div>
          <label htmlFor="new-email" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Email Baru <span className="text-red-400" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
            <input
              id="new-email"
              type="email"
              value={newEmail}
              onChange={(e) => { setNewEmail(e.target.value) }}
              autoComplete="email"
              disabled={isPending}
              aria-invalid={!!error}
              className={`w-full pl-10 pr-3.5 py-3 bg-gray-50 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                error ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="email@baru.com"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-gray-100">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? <><Spinner />Memproses...</> : <><Send className="w-4 h-4" aria-hidden="true" />Ganti Email</>}
          </button>
        </div>
      </form>
    </>
  )
}
