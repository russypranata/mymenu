'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { resetPassword } from '@/lib/auth/actions'
import { ClipboardList, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { getPasswordStrength } from '@/lib/password'
import { Spinner } from '@/components/spinner'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const strength = getPasswordStrength(password)
  const passwordsMatch = password && confirmPassword && password === confirmPassword

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== confirmPassword) { setError('Password tidak cocok.'); return }
    if (password.length < 8) { setError('Password minimal 8 karakter.'); return }

    setLoading(true)
    setError(null)

    const { error } = await resetPassword(password)
    if (error) {
      setError(error)
      setLoading(false)
      return
    }

    router.push('/login?message=password_updated')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center">
            <ClipboardList className="w-4 h-4 text-white" strokeWidth={2.5} aria-hidden="true" />
          </div>
          <span className="font-bold text-gray-800">MyMenu</span>
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Buat password baru</h1>
          <p className="text-gray-500 text-sm">Masukkan password baru untuk akun Anda.</p>
        </div>

        {error && (
          <div role="alert" className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">Password Baru</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                disabled={loading}
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 disabled:opacity-60 transition-all"
                placeholder="Minimal 8 karakter"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1} aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}>
                {showPassword ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
              </button>
            </div>
            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1" role="meter" aria-label={`Kekuatan password: ${strength.label}`} aria-valuenow={strength.score} aria-valuemin={0} aria-valuemax={4}>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength.score ? strength.color : 'bg-gray-200'}`} />
                  ))}
                </div>
                <p className="text-xs text-gray-400">Kekuatan: <span className="font-medium text-gray-600">{strength.label}</span></p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1.5">Konfirmasi Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                required
                disabled={loading}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-describedby={confirmPassword && !passwordsMatch ? 'confirm-error' : undefined}
                className={`w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 disabled:opacity-60 transition-all ${
                  confirmPassword && !passwordsMatch ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Ulangi password baru"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1} aria-label={showConfirm ? 'Sembunyikan konfirmasi' : 'Tampilkan konfirmasi'}>
                {showConfirm ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p id="confirm-error" className="text-xs text-red-500 mt-1">Password tidak cocok</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || (!!confirmPassword && !passwordsMatch)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <Spinner />
                Menyimpan...
              </>
            ) : (
              'Simpan Password Baru'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
