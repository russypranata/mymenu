import Link from 'next/link'
import type { Metadata } from 'next'
import { Check, Zap, Rocket, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Harga — MyMenu',
  description: 'Harga terjangkau untuk menu digital UMKM. Mulai gratis 7 hari, lanjut Rp20.000/bulan.',
}

const FEATURES = [
  'Menu digital unlimited item',
  'QR Code otomatis',
  'Keranjang & order via WhatsApp',
  'Custom tema & warna',
  'Upload foto per menu',
  'Kategori menu',
  'Jam operasional',
  'Statistik views & klik WA',
  'Banner & logo toko',
  'Sosial media links',
  'Subdomain mymenu.id/namatoko',
]

export default function HargaPage() {
  const adminWa = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? ''
  const waLink = adminWa
    ? `https://wa.me/${adminWa}?text=${encodeURIComponent('Halo, saya ingin berlangganan MyMenu.')}`
    : 'https://wa.me/'

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-gray-900 text-lg">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">M</span>
          </div>
          MyMenu
        </Link>
        <Link href="/register" className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors">
          <Rocket className="w-4 h-4" />
          Coba Gratis
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-20">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="inline-flex items-center gap-2 text-yellow-700 font-semibold text-sm uppercase tracking-widest mb-4 bg-yellow-100 px-3 py-1 rounded-full border border-yellow-200">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
            Harga
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
            Satu harga, semua fitur
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Tidak ada paket-paketan membingungkan. Bayar satu harga, dapat semua fitur.
          </p>
        </div>

        {/* Pricing card */}
        <div className="max-w-sm mx-auto">
          <div className="bg-white rounded-3xl border-2 border-green-500 shadow-xl shadow-green-500/10 p-8 relative">
            {/* Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-green-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                Paling Populer
              </span>
            </div>

            <div className="text-center mb-8">
              <p className="text-sm font-semibold text-gray-500 mb-2">Langganan Bulanan</p>
              <div className="flex items-end justify-center gap-1">
                <span className="text-5xl font-extrabold text-gray-900">Rp20K</span>
                <span className="text-gray-400 text-base mb-1.5">/bulan</span>
              </div>
              <p className="text-sm text-green-600 font-semibold mt-2 flex items-center justify-center gap-1.5">
                <Zap className="w-4 h-4" />
                Gratis 7 hari pertama
              </p>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {FEATURES.map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="space-y-3">
              <Link
                href="/register"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-500 text-white font-bold rounded-2xl hover:bg-green-600 transition-colors"
              >
                <Rocket className="w-4 h-4" />
                Mulai Gratis 7 Hari
              </Link>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 text-gray-600 text-sm font-semibold rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-green-500" />
                Tanya via WhatsApp
              </a>
            </div>
          </div>

          {/* Trust notes */}
          <div className="mt-6 space-y-2 text-center">
            {[
              'Tanpa kartu kredit',
              'Batal kapan saja',
              'Aktivasi manual oleh admin',
            ].map(t => (
              <p key={t} className="text-sm text-gray-400 flex items-center justify-center gap-2">
                <Check className="w-3.5 h-3.5 text-green-400" strokeWidth={2.5} />
                {t}
              </p>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">Pertanyaan Umum</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Bagaimana cara bayar?',
                a: 'Pembayaran dilakukan manual via transfer bank atau QRIS. Setelah konfirmasi, admin akan mengaktifkan langganan Anda.',
              },
              {
                q: 'Apakah bisa batal kapan saja?',
                a: 'Ya. Tidak ada kontrak. Jika tidak diperpanjang, akun otomatis expired dan data tetap tersimpan.',
              },
              {
                q: 'Berapa banyak menu yang bisa ditambahkan?',
                a: 'Tidak ada batasan. Tambahkan sebanyak yang Anda butuhkan.',
              },
              {
                q: 'Apakah ada biaya setup?',
                a: 'Tidak ada. Daftar gratis, setup sendiri dalam 5 menit.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="bg-gray-50 rounded-2xl p-5">
                <p className="font-bold text-gray-900 mb-1.5">{q}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
