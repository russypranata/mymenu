import Link from 'next/link'
import { ClipboardList } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi — Menuly',
}

export default function PrivasiPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <ClipboardList className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-gray-800">Menuly</span>
        </Link>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Kebijakan Privasi</h1>
        <p className="text-sm text-gray-400 mb-8">Terakhir diperbarui: {new Date().getFullYear()}</p>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">Data yang Kami Kumpulkan</h2>
            <p>Kami mengumpulkan email, nama toko, dan data menu yang Anda masukkan untuk menjalankan layanan Menuly. Data analitik (jumlah kunjungan halaman) dikumpulkan secara anonim.</p>
          </section>
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">Penggunaan Data</h2>
            <p>Data Anda digunakan semata-mata untuk menjalankan layanan, menampilkan menu digital Anda, dan mengirim notifikasi terkait akun. Kami tidak menjual data kepada pihak ketiga.</p>
          </section>
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">Keamanan</h2>
            <p>Data disimpan di Supabase dengan enkripsi dan Row Level Security (RLS). Setiap pengguna hanya dapat mengakses data miliknya sendiri.</p>
          </section>
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">Kontak</h2>
            <p>Pertanyaan terkait privasi dapat dikirim melalui halaman <Link href="/bantuan" className="text-green-500 hover:underline">Bantuan</Link>.</p>
          </section>
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          <Link href="/" className="hover:text-green-500 transition-colors">← Kembali ke beranda</Link>
        </p>
      </div>
    </div>
  )
}
