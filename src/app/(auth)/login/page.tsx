'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { login } from '@/lib/auth/actions'
import { ClipboardList, Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff, UtensilsCrossed, QrCode, Smartphone } from 'lucide-react'
import { Spinner } from '@/components/spinner'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const { error, redirectTo } = await login(email, password)
    if (error) {
      setError(error)
      setLoading(false)
      return
    }
    const destination = redirectTo || searchParams.get('redirect') || '/dashboard'
    router.push(destination)
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel ── */}
      <div
        className="hidden lg:flex w-1/2 flex-col p-14 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #1a0e08 0%, #2c1810 50%, #3d2010 100%)',
          clipPath: 'polygon(0 0, 95% 0, 100% 15%, 97% 30%, 100% 50%, 97% 70%, 100% 85%, 95% 100%, 0 100%)'
        }}
      >
        {/* Decorative clipboard */}
        <div className="absolute top-1/3 right-2 opacity-[0.1] pointer-events-none select-none rotate-[20deg]">
          <svg width="160" height="195" viewBox="0 0 140 170" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="22" width="128" height="142" rx="12" stroke="#16a34a" strokeWidth="6" />
            <rect x="44" y="10" width="52" height="24" rx="7" fill="#16a34a" />
            <rect x="22" y="58" width="96" height="8" rx="4" fill="#16a34a" />
            <rect x="22" y="78" width="64" height="7" rx="3.5" fill="#16a34a" opacity="0.6" />
            <rect x="22" y="104" width="96" height="8" rx="4" fill="#16a34a" />
            <rect x="22" y="124" width="76" height="7" rx="3.5" fill="#16a34a" opacity="0.6" />
            <rect x="22" y="150" width="96" height="8" rx="4" fill="#16a34a" />
          </svg>
        </div>

        {/* Decorative phone */}
        <div className="absolute bottom-10 left-16 opacity-[0.1] pointer-events-none select-none -rotate-[15deg]">
          <svg width="160" height="195" viewBox="0 0 140 170" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="6" width="100" height="158" rx="18" stroke="#16a34a" strokeWidth="6" />
            <rect x="50" y="14" width="40" height="6" rx="3" fill="#16a34a" />
            <circle cx="70" cy="152" r="6" stroke="#16a34a" strokeWidth="4" />
            <rect x="34" y="36" width="72" height="8" rx="4" fill="#16a34a" />
            <rect x="34" y="56" width="50" height="7" rx="3.5" fill="#16a34a" opacity="0.6" />
            <rect x="34" y="80" width="72" height="8" rx="4" fill="#16a34a" />
            <rect x="34" y="100" width="58" height="7" rx="3.5" fill="#16a34a" opacity="0.6" />
            <rect x="34" y="124" width="72" height="8" rx="4" fill="#16a34a" />
          </svg>
        </div>

        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white tracking-tight leading-tight">MyMenu</span>
            <span className="text-stone-500 text-xs leading-tight">Menu digital UMKM</span>
          </div>
        </Link>

        {/* Center content — vertically centered */}
        <div className="relative z-10 flex-1 flex flex-col justify-center space-y-6">
          <div className="space-y-4">
            <h2 className="text-5xl font-extrabold text-white leading-[1.15] tracking-tight">
              Kelola menu bisnis<br />
              <span className="text-green-400">dari mana saja.</span>
            </h2>
            <p className="text-stone-400 text-base leading-relaxed max-w-[320px]">
              Buat, edit, dan bagikan menu digital dalam hitungan menit. Tanpa coding, tanpa desainer. Solusi untuk warung, kafe & restoran.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { icon: UtensilsCrossed, text: 'Kelola menu & kategori dengan mudah' },
              { icon: QrCode, text: 'QR Code otomatis untuk setiap meja' },
              { icon: Smartphone, text: 'Tampilan rapi di semua perangkat' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/15 border border-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-green-400" strokeWidth={2} />
                </div>
                <span className="text-stone-300 text-base">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-8 py-12 relative overflow-hidden">

        {/* Decorative clipboard — top left */}
        <div className="absolute top-20 left-2 opacity-[0.08] pointer-events-none select-none -rotate-12">
          <svg width="160" height="195" viewBox="0 0 140 170" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="22" width="128" height="142" rx="12" stroke="#16a34a" strokeWidth="6" />
            <rect x="44" y="10" width="52" height="24" rx="7" fill="#16a34a" />
            <rect x="22" y="58" width="96" height="8" rx="4" fill="#16a34a" />
            <rect x="22" y="78" width="64" height="7" rx="3.5" fill="#16a34a" opacity="0.6" />
            <rect x="22" y="104" width="96" height="8" rx="4" fill="#16a34a" />
            <rect x="22" y="124" width="76" height="7" rx="3.5" fill="#16a34a" opacity="0.6" />
            <rect x="22" y="150" width="96" height="8" rx="4" fill="#16a34a" />
          </svg>
        </div>

        {/* Decorative phone — bottom right */}
        <div className="absolute bottom-16 right-2 opacity-[0.08] pointer-events-none select-none rotate-12">
          <svg width="160" height="195" viewBox="0 0 140 170" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="6" width="100" height="158" rx="18" stroke="#16a34a" strokeWidth="6" />
            <rect x="50" y="14" width="40" height="6" rx="3" fill="#16a34a" />
            <circle cx="70" cy="152" r="6" stroke="#16a34a" strokeWidth="4" />
            <rect x="34" y="36" width="72" height="8" rx="4" fill="#16a34a" />
            <rect x="34" y="56" width="50" height="7" rx="3.5" fill="#16a34a" opacity="0.6" />
            <rect x="34" y="80" width="72" height="8" rx="4" fill="#16a34a" />
            <rect x="34" y="100" width="58" height="7" rx="3.5" fill="#16a34a" opacity="0.6" />
            <rect x="34" y="124" width="72" height="8" rx="4" fill="#16a34a" />
          </svg>
        </div>
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-green-500 rounded-2xl flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-gray-800 text-lg">MyMenu</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Selamat datang kembali</h1>
            <p className="text-gray-500 text-base">
              Belum punya akun?{' '}
              <Link href="/register" className="text-green-500 font-semibold hover:text-green-600 transition-colors">
                Daftar gratis
              </Link>
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div role="alert" className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
              {error}
            </div>
          )}
          {searchParams.get('error') === 'auth_callback_failed' && (
            <div role="alert" className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
              Link tidak valid atau sudah kadaluarsa. Silakan coba lagi.
            </div>
          )}
          {searchParams.get('message') === 'password_updated' && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-5 text-sm">
              Password berhasil diperbarui. Silakan masuk.
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 disabled:opacity-60 transition-all"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</label>
                <Link href="/forgot-password" className="text-sm text-green-500 hover:text-green-600 font-medium transition-colors">
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-11 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 disabled:opacity-60 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-green-500 text-white text-base font-semibold rounded-xl hover:bg-green-600 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Spinner />
                  Masuk...
                </>
              ) : (
                <>
                  Masuk ke Dashboard
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 mt-6 mb-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">aman & terenkripsi</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <p className="text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} MyMenu &middot;{' '}
            <Link href="/privasi" className="hover:text-gray-600 transition-colors">Privasi</Link>
            {' '}&middot;{' '}
            <Link href="/syarat" className="hover:text-gray-600 transition-colors">Syarat</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
