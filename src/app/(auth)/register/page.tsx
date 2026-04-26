'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { register } from '@/lib/auth/actions'
import { ClipboardList, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, Eye, EyeOff, UtensilsCrossed, QrCode, Smartphone } from 'lucide-react'
import { getPasswordStrength } from '@/lib/password'
import { Spinner } from '@/components/spinner'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
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
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const { error, emailSent: sent } = await register(email, password)
    if (error) {
      setError(error)
      setLoading(false)
      return
    }
    if (!sent) { router.push('/dashboard'); return }
    setRegisteredEmail(email)
    setEmailSent(true)
    setLoading(false)
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Cek email Anda</h1>
          <p className="text-gray-500 text-sm mb-1">Kami mengirim link konfirmasi ke</p>
          <p className="font-semibold text-gray-800 mb-6">{registeredEmail}</p>
          <p className="text-gray-400 text-xs">
            Tidak menerima email? Cek folder spam, atau{' '}
            <button onClick={() => setEmailSent(false)} className="text-green-500 hover:text-green-600 underline">
              coba daftar ulang
            </button>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel ── */}
      <div
        className="hidden lg:flex w-1/2 flex-col p-14 relative overflow-hidden bg-stone-900"
        style={{
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
            <span className="text-xl font-bold text-white tracking-tight leading-tight">Menuly</span>
            <span className="text-stone-500 text-xs leading-tight">Menu digital UMKM</span>
          </div>
        </Link>

        {/* Center content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center space-y-6">
          <div className="space-y-4">
            <h2 className="text-5xl font-extrabold text-white leading-[1.15] tracking-tight">
              Mulai perjalanan<br />
              <span className="text-green-400">menu digital Anda.</span>
            </h2>
            <p className="text-stone-400 text-base leading-relaxed max-w-[320px]">
              Daftar gratis dan buat menu digital dalam 5 menit. Tanpa coding, tanpa desainer.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { icon: UtensilsCrossed, text: 'Gratis 7 hari, tanpa kartu kredit' },
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

        <div className="w-full max-w-[400px] relative z-10">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-green-500 rounded-2xl flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-gray-800 text-lg">Menuly</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Buat akun gratis</h1>
            <p className="text-gray-500 text-base">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-green-500 font-semibold hover:text-green-600 transition-colors">
                Masuk di sini
              </Link>
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="email" name="email" type="email" autoComplete="email" required disabled={loading}
                  className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 disabled:opacity-60 transition-all"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="password" name="password" type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password" required disabled={loading} minLength={8}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 disabled:opacity-60 transition-all"
                  placeholder="Minimal 8 karakter"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
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
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="confirmPassword" type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password" required disabled={loading}
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-10 pr-11 py-3.5 bg-gray-50 border rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 disabled:opacity-60 transition-all ${confirmPassword && !passwordsMatch ? 'border-red-300' : 'border-gray-200'}`}
                  placeholder="Ulangi password"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" tabIndex={-1}>
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="text-xs text-red-500 mt-1">Password tidak cocok</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || (!!confirmPassword && !passwordsMatch)}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-green-500 text-white text-base font-semibold rounded-xl hover:bg-green-600 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Spinner />
                  Membuat akun...
                </>
              ) : (
                <>
                  Mulai Gratis 7 Hari
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400 pt-1">
              Dengan mendaftar, Anda menyetujui{' '}
              <Link href="/syarat" className="underline hover:text-gray-600">Syarat & Ketentuan</Link> kami.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
