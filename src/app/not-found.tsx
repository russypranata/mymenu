import Link from 'next/link'
import { ClipboardList, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
        <ClipboardList className="w-7 h-7 text-green-400" />
      </div>
      <p className="text-5xl font-extrabold text-gray-900 mb-2">404</p>
      <h1 className="text-xl font-bold text-gray-900 mb-2">Halaman tidak ditemukan</h1>
      <p className="text-sm text-gray-500 mb-8 max-w-xs">
        Halaman yang Anda cari tidak ada atau sudah dipindahkan.
      </p>
      <Link
        href="/"
        className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Beranda
      </Link>
    </div>
  )
}
