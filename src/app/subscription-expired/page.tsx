import Link from 'next/link'
import { CreditCard, MessageCircle, LogOut, Clock } from 'lucide-react'
import { logout } from '@/lib/auth/actions'

const ADMIN_WA = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '62895338170582'

export default function SubscriptionExpiredPage() {
  const waLink = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(
    'Halo, langganan saya sudah habis. Saya ingin perpanjang langganan Menuly.'
  )}`

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6">
        <CreditCard className="w-8 h-8 text-amber-400" />
      </div>
      
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Langganan Berakhir</h1>
      
      <p className="text-sm text-gray-500 mb-2 max-w-sm">
        Langganan Anda telah berakhir dan masa tenggang 3 hari sudah habis.
      </p>
      
      <p className="text-sm text-gray-400 mb-8 max-w-sm">
        Perpanjang sekarang untuk melanjutkan menggunakan Menuly dan mengelola menu digital toko Anda.
      </p>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-8 max-w-sm">
        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="text-xs font-semibold text-blue-700 mb-1">Masa Tenggang Habis</p>
            <p className="text-xs text-blue-600 leading-relaxed">
              Anda mendapat 3 hari masa tenggang setelah langganan berakhir. 
              Masa tenggang sudah habis, silakan perpanjang untuk akses kembali.
            </p>
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
          Perpanjang Langganan
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
        
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          Beranda
        </Link>
      </div>

      {/* Help Text */}
      <p className="text-xs text-gray-400 mt-8 max-w-sm">
        Butuh bantuan? Hubungi admin via WhatsApp untuk informasi lebih lanjut tentang paket langganan.
      </p>
    </div>
  )
}
