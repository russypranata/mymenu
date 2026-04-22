'use client'

import { useState, useTransition } from 'react'
import { AlertCircle, Phone, Save } from 'lucide-react'
import { Spinner } from '@/components/spinner'
import { updatePhone } from '@/lib/actions/profile'
import { useToast, ToastContainer } from '@/components/toast'

interface Props {
  phone: string | null
}

export function PhoneForm({ phone }: Props) {
  const [value, setValue] = useState(phone ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const { toasts, addToast, removeToast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const cleaned = value.replace(/\D/g, '')
    if (!cleaned) { setError('Nomor WhatsApp wajib diisi.'); return }
    if (cleaned.length < 9 || cleaned.length > 15) { setError('Nomor WhatsApp tidak valid.'); return }

    startTransition(async () => {
      const result = await updatePhone({ phone: cleaned })
      if (result.error) {
        setError(result.error)
        addToast('Gagal memperbarui nomor WhatsApp.', 'error')
      } else {
        addToast('Nomor WhatsApp berhasil diperbarui.')
      }
    })
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div>
          <h2 className="text-base font-bold text-gray-900">Nomor WhatsApp</h2>
          <p className="text-sm text-gray-500 mt-0.5">Digunakan untuk notifikasi dan fitur order via WhatsApp.</p>
        </div>

        {error && (
          <div role="alert" className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Nomor WhatsApp <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="phone"
              type="tel"
              value={value}
              onChange={e => setValue(e.target.value)}
              disabled={isPending}
              className={`w-full pl-10 pr-3.5 py-3 bg-gray-50 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all disabled:opacity-60 ${error ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              placeholder="08xxxxxxxxxx"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-gray-100">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? <><Spinner />Menyimpan...</> : <><Save className="w-4 h-4" />Simpan Perubahan</>}
          </button>
        </div>
      </form>
    </>
  )
}
