'use client'

import { useState } from 'react'
import Link from 'next/link'
import { forgotPassword } from '@/lib/auth/actions'
import { ClipboardList, Mail, ArrowLeft, ArrowRight, AlertCircle, CheckCircle2, UtensilsCrossed, QrCode, Smartphone } from 'lucide-react'
import { Spinner } from '@/components/spinner'

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await forgotPassword(email)
    if (result?.error) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
      setLoading(false)
      return
    }
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Cek email Anda</h1>
          <p className="text-gray-500 text-sm mb-1">Kami mengirim link reset password ke</p>
          <p className="font-semibold text-gray-800 mb-4">{email}</p>
          <p className="text-gray-400 text-xs mb-6">Link berlaku selama 1 jam. Cek folder spam jika tidak muncul di inbox.</p>
          <Link href="/login" className="text-green-500 hover:text-green-600 text-sm font-medium">
            Kembali ke halaman masuk
          </Link>
        </div>
      </div>
    )
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

        {/* Center content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center space-y-6">
          <div className="space-y-4">
            <h2 className="text-5xl font-extrabold text-white leading-[1.15] tracking-tight">
              Tenang, kami<br />
              <span className="text-green-400">bantu reset.</span>
            </h2>
            <p className="text-stone-400 text-base leading-relaxed max-w-[320px]">
              Masukkan email Anda dan kami akan kirimkan link untuk membuat password baru dalam hitungan detik.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { icon: UtensilsCrossed, text: 'Proses reset cepat & aman' },
              { icon: QrCode, text: 'Link berlaku selama 1 jam' },
              { icon: Smartphone, text: 'Cek inbox atau folder spam' },
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
            <span className="font-bold text-gray-800 text-lg">MyMenu</span>
          </Link>

          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke masuk
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Lupa password?</h1>
            <p className="text-gray-500 text-base leading-relaxed">
              Masukkan email yang terdaftar. Kami akan kirim link untuk membuat password baru.
            </p>
          </div>

          {error && (
            <div role="alert" className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="email" type="email" autoComplete="email" required disabled={loading}
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 disabled:opacity-60 transition-all"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-green-500 text-white text-base font-semibold rounded-xl hover:bg-green-600 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Spinner />
                  Mengirim...
                </>
              ) : (
                <>
                  Kirim Link Reset Password
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
