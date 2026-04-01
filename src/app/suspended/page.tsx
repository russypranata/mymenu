import Link from 'next/link'
import { ShieldOff, MessageCircle, LogOut } from 'lucide-react'
import { logout } from '@/lib/auth/actions'

const ADMIN_WA = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? ''

export default function SuspendedPage() {
  const waLink = ADMIN_WA
    ? `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent('Halo, akun saya dinonaktifkan. Mohon bantuan untuk mengaktifkan kembali.')}`
    : null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
        <ShieldOff className="w-8 h-8 text-red-400" />
      </div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Akun Dinonaktifkan</h1>
      <p className="text-sm text-gray-500 mb-2 max-w-sm">
        Akun Anda telah dinonaktifkan oleh administrator.
      </p>
      <p className="text-sm text-gray-400 mb-8 max-w-sm">
        Hubungi admin untuk informasi lebih lanjut atau mengaktifkan kembali akun Anda.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        {waLink && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Hubungi Admin
          </a>
        )}
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
    </div>
  )
}
