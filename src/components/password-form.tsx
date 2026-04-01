'use client'

import { useState, useTransition } from 'react'
import { AlertCircle, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react'
import { Spinner } from '@/components/spinner'
import { updatePassword } from '@/lib/actions/profile'
import { useToast, ToastContainer } from '@/components/toast'
import { getPasswordStrength } from '@/lib/password'

export function PasswordForm() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const { toasts, addToast, removeToast } = useToast()

  const strength = getPasswordStrength(newPassword)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (newPassword.length < 8) { setError('Password minimal 8 karakter.'); return }
    if (newPassword !== confirmPassword) { setError('Konfirmasi password tidak sesuai.'); return }

    startTransition(async () => {
      const result = await updatePassword({ newPassword, confirmPassword })
      if (result.error) {
        setError(result.error)
        addToast('Gagal mengganti password.', 'error')
      } else {
        addToast('Password berhasil diperbarui.')
        setNewPassword('')
        setConfirmPassword('')
      }
    })
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div>
          <h2 className="text-base font-bold text-gray-900">Ganti Password</h2>
          <p className="text-sm text-gray-500 mt-0.5">Password minimal 8 karakter.</p>
        </div>

        {error && (
          <div role="alert" className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
            {error}
          </div>
        )}

        <div>
          <label htmlFor="new-password" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Password Baru <span className="text-red-400" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
            <input
              id="new-password"
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              disabled={isPending}
              aria-invalid={!!error}
              className={`w-full pl-10 pr-11 py-3 bg-gray-50 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                error ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="Minimal 8 karakter"
            />
            <button type="button" onClick={() => setShowNew(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showNew ? 'Sembunyikan password' : 'Tampilkan password'}>
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {newPassword && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      i <= strength.score ? strength.color : 'bg-gray-100'
                    }`}
                  />
                ))}
              </div>
              {strength.label && (
                <p className="text-xs text-gray-400">Kekuatan: <span className="font-semibold text-gray-600">{strength.label}</span></p>
              )}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Konfirmasi Password <span className="text-red-400" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
            <input
              id="confirm-password"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              disabled={isPending}
              aria-invalid={!!error}
              className={`w-full pl-10 pr-11 py-3 bg-gray-50 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                error ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="Ulangi password baru"
            />
            <button type="button" onClick={() => setShowConfirm(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showConfirm ? 'Sembunyikan konfirmasi password' : 'Tampilkan konfirmasi password'}>
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-gray-100">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? <><Spinner />Menyimpan...</> : <><ShieldCheck className="w-4 h-4" aria-hidden="true" />Ganti Password</>}
          </button>
        </div>
      </form>
    </>
  )
}
