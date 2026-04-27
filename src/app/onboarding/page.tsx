'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ClipboardList, User, Phone, ArrowRight } from 'lucide-react'
import { updateOnboarding } from '@/lib/actions/onboarding'
import { Spinner } from '@/components/spinner'

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim() || name.trim().length < 2) { setError('Nama minimal 2 karakter.'); return }
    if (!phone.trim()) { setError('Nomor WhatsApp wajib diisi.'); return }
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length < 9 || cleaned.length > 15) { setError('Nomor WhatsApp tidak valid.'); return }

    setLoading(true)
    setError(null)
    const result = await updateOnboarding({ name: name.trim(), phone: cleaned })
    if (result.error) { setError(result.error); setLoading(false); return }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 relative overflow-hidden">
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

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-extrabold text-gray-900">Menuly</span>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Lengkapi profil Anda</h1>
            <p className="text-sm text-gray-500">Hanya butuh 30 detik sebelum mulai.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Nama Anda
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  required
                  disabled={loading}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Nama lengkap atau nama toko"
                  className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 disabled:opacity-60 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Nomor WhatsApp
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="phone"
                  type="tel"
                  required
                  disabled={loading}
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 disabled:opacity-60 transition-all"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">Untuk komunikasi dengan admin Menuly terkait langganan, support, dan update fitur.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <><Spinner />Menyimpan...</>
              ) : (
                <>Mulai Gunakan Menuly <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
