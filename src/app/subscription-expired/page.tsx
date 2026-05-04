import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CreditCard, MessageCircle, LogOut } from 'lucide-react'
import { logout } from '@/lib/auth/actions'
import { getSubscription } from '@/lib/queries/dashboard'

const ADMIN_WA = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '62895338170582'

export default async function SubscriptionExpiredPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let subscription = null
  if (user) {
    subscription = await getSubscription(user.id)
  }

  // Determine if this is a new user (no subscription) or expired user
  const isNewUser = !subscription

  const waMessage = isNewUser
    ? 'Halo, saya baru daftar Menuly dan ingin mengaktifkan langganan.'
    : 'Halo, langganan saya sudah habis. Saya ingin perpanjang langganan Menuly.'

  const waLink = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(waMessage)}`

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
        <CreditCard className="w-8 h-8 text-green-500" />
      </div>

      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
        {isNewUser ? 'Aktifkan Langganan' : 'Langganan Berakhir'}
      </h1>

      <p className="text-sm text-gray-500 mb-2 max-w-sm">
        {isNewUser
          ? 'Akun Anda sudah terdaftar. Lakukan pembayaran untuk mulai menggunakan Menuly.'
          : 'Langganan Anda telah berakhir. Perpanjang sekarang untuk melanjutkan.'}
      </p>

      <p className="text-sm text-gray-400 mb-8 max-w-sm">
        Hubungi admin via WhatsApp, kirim bukti pembayaran, dan akun Anda akan diaktifkan dalam beberapa menit.
      </p>

      {/* Pricing info */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-8 w-full max-w-sm shadow-sm">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Pilihan Paket</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-3 text-left">
            <p className="text-sm font-bold text-gray-900">Bulanan</p>
            <p className="text-lg font-extrabold text-green-600 mt-1">Rp20.000</p>
            <p className="text-xs text-gray-400">per bulan</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-left relative">
            <span className="absolute -top-2 -right-1 text-[9px] bg-green-500 text-white px-1.5 py-0.5 rounded-full font-bold">Hemat</span>
            <p className="text-sm font-bold text-gray-900">Tahunan</p>
            <p className="text-lg font-extrabold text-green-600 mt-1">Rp200.000</p>
            <p className="text-xs text-gray-400">per tahun</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          {isNewUser ? 'Aktifkan via WhatsApp' : 'Perpanjang via WhatsApp'}
        </a>

        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </form>
      </div>

      <p className="text-xs text-gray-400 mt-8 max-w-sm">
        Setelah bayar, kirim screenshot bukti transfer ke admin. Akun diaktifkan dalam beberapa menit.
      </p>
    </div>
  )
}
