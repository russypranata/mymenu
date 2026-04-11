import Link from 'next/link'
import { ClipboardList, MessageCircle, BookOpen } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bantuan — MyMenu',
}

const faqs = [
  {
    q: 'Bagaimana cara membuat toko?',
    a: 'Setelah login, klik "Buat Toko" di dashboard. Isi nama toko, slug (URL unik), dan nomor WhatsApp. Toko langsung aktif.',
  },
  {
    q: 'Bagaimana cara menambah menu?',
    a: 'Masuk ke halaman Toko → pilih toko → klik "Tambah Menu". Isi nama, harga, deskripsi, dan upload foto.',
  },
  {
    q: 'Bagaimana cara membagikan menu ke pelanggan?',
    a: 'Setiap toko punya URL unik seperti mymenu.id/namatoko. Bagikan link ini atau gunakan QR Code yang tersedia di Pengaturan Toko.',
  },
  {
    q: 'Bagaimana cara memperpanjang langganan?',
    a: 'Hubungi admin melalui WhatsApp di bawah. Setelah pembayaran dikonfirmasi, admin akan mengaktifkan langganan Anda.',
  },
  {
    q: 'Apakah data saya aman?',
    a: 'Ya. Data disimpan dengan enkripsi dan setiap pengguna hanya bisa mengakses data miliknya sendiri.',
  },
]

export default function BantuanPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <ClipboardList className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-gray-800">MyMenu</span>
        </Link>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Pusat Bantuan</h1>
        <p className="text-gray-500 text-sm mb-8">Pertanyaan umum dan cara menghubungi kami.</p>

        {/* FAQ */}
        <div className="space-y-3 mb-10">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-green-500" />
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Pertanyaan Umum</h2>
          </div>
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-sm font-semibold text-gray-900 mb-1.5">{faq.q}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-4 h-4 text-green-500" />
            <h2 className="text-sm font-bold text-green-800">Masih butuh bantuan?</h2>
          </div>
          <p className="text-sm text-green-700 mb-4">
            Hubungi admin langsung via WhatsApp untuk pertanyaan langganan atau masalah teknis.
          </p>
          <a
            href="https://wa.me/62895338170582"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Chat via WhatsApp
          </a>
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          <Link href="/" className="hover:text-green-500 transition-colors">← Kembali ke beranda</Link>
        </p>
      </div>
    </div>
  )
}
