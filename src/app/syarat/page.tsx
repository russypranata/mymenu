import Link from 'next/link'
import { ClipboardList } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan — Menuly',
}

export default function SyaratPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <ClipboardList className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-gray-800">Menuly</span>
        </Link>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Syarat & Ketentuan</h1>
        <p className="text-sm text-gray-400 mb-8">Terakhir diperbarui: {new Date().getFullYear()}</p>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">Penggunaan Layanan</h2>
            <p>Menuly adalah platform menu digital untuk UMKM. Dengan mendaftar, Anda setuju menggunakan layanan ini hanya untuk keperluan bisnis yang sah dan tidak melanggar hukum yang berlaku di Indonesia.</p>
          </section>
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">Konten</h2>
            <p>Anda bertanggung jawab penuh atas konten (nama menu, foto, deskripsi) yang diunggah. Konten yang melanggar hukum, mengandung SARA, atau menyesatkan dapat dihapus tanpa pemberitahuan.</p>
          </section>
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">Langganan</h2>
            <p>Layanan tersedia dengan biaya Rp20.000/bulan setelah masa trial 7 hari. Pembayaran dilakukan secara manual melalui konfirmasi ke admin. Akun yang tidak diperpanjang akan dinonaktifkan setelah masa aktif berakhir.</p>
          </section>
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-2">Penghentian Layanan</h2>
            <p>Kami berhak menangguhkan akun yang melanggar syarat ini. Anda dapat menghapus akun kapan saja melalui halaman Profil.</p>
          </section>
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          <Link href="/" className="hover:text-green-500 transition-colors">← Kembali ke beranda</Link>
        </p>
      </div>
    </div>
  )
}
