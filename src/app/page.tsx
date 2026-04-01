import Link from "next/link";
import {
  LogOut,
  Zap,
  Eye,
  Check,
  Smartphone,
  MessageCircle,
  Grid3x3,
  QrCode,
  Globe,
  ClipboardList,
  Lock,
  Rocket,
  Coffee,
  UtensilsCrossed,
  Wine,
  ShoppingCart,
  Image as ImageIcon,
  ArrowRight,
  CheckCircle2,
  ScanLine,
  Link2,
  Pencil,
  BadgeCheck,
  Palette,
  LayoutTemplate,
} from "lucide-react";

// Color Palette: Green + Dark + White
// Primary: #16a34a (green-500)
// Hover: #15803d (green-600)
// Soft bg: #bbf7d0 (green-200)
// Dark: #1F2937 (gray-800)
// Background: #FFFFFF

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-green-200 selection:text-green-900">
      {/* Header - Floating Navbar */}
      <header className="fixed top-4 left-0 right-0 z-50 px-4">
        <nav className="max-w-6xl mx-auto bg-white border border-green-100 rounded-2xl transition-all">
          <div className="flex items-center justify-between px-6 py-3.5">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center transition-all">
                <ClipboardList
                  className="w-5 h-5 text-white"
                  strokeWidth={2.5}
                />
              </div>
              <span className="text-xl font-bold text-gray-800 tracking-tight">
                MyMenu
              </span>
            </Link>

            {/* Nav Actions */}
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-green-500 hover:bg-green-50 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" strokeWidth={2} />
                Masuk
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-all"
              >
                <Rocket className="w-4 h-4" strokeWidth={2} />
                Coba Gratis
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="pt-28">
        {/* Hero Section - Split Layout */}
        <section className="relative pb-24 sm:pb-32 overflow-hidden">
          {/* Background Pattern - Menu Icons */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-16 left-16 text-green-500">
              <ClipboardList className="w-40 h-40" strokeWidth={1.5} />
            </div>
            <div className="absolute top-10 left-1/2 -translate-x-1/2 text-green-500">
              <Coffee className="w-40 h-40" strokeWidth={1.5} />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green-500">
              <QrCode className="w-40 h-40" strokeWidth={1.5} />
            </div>
            <div className="absolute bottom-16 left-16 text-green-500">
              <Smartphone className="w-40 h-40" strokeWidth={1.5} />
            </div>
            <div className="absolute top-16 right-16 text-green-500">
              <UtensilsCrossed className="w-40 h-40" strokeWidth={1.5} />
            </div>
            <div className="absolute bottom-16 right-16 text-green-500">
              <Wine className="w-40 h-40" strokeWidth={1.5} />
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
              {/* Left Content - White Background */}
              <div className="text-center lg:text-left relative z-10">
                {/* Pill Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-yellow-100 border border-yellow-300 rounded-full text-yellow-800 font-medium text-xs sm:text-sm mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                  </span>
                  Solusi Menu Digital untuk UMKM Indonesia
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 tracking-tight leading-[1.15] mb-6">
                  Buat Menu Digital
                  <span className="block text-green-500">Dalam <span className="relative inline-block">
                    <span className="relative z-10">5 Menit</span>
                    <span className="absolute -bottom-3 left-0 right-0 h-3 bg-yellow-300/60 -rotate-1 rounded" />
                  </span></span>
                </h1>

                <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed lg:pr-8">
                  Solusi digital untuk penjualan warung, kafe, atau restoran Anda dengan
                  menu digital modern yang bisa langsung dibuka lewat link & QR
                  code.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
                  <Link
                    href="/register"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-green-500 text-white text-base font-semibold rounded-xl hover:bg-green-600 transition-all"
                  >
                    <Zap className="w-5 h-5" strokeWidth={2} />
                    Mulai Gratis 7 Hari
                  </Link>
                  <Link
                    href="#fitur"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-yellow-400 text-gray-900 text-base font-semibold rounded-xl hover:bg-yellow-500 transition-all shadow-sm"
                  >
                    <Eye className="w-5 h-5" strokeWidth={2} />
                    Lihat Fitur
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-3 text-sm font-medium text-gray-500">
                  <div className="flex items-center gap-2">
                    <Check
                      className="w-4 h-4 text-green-500"
                      strokeWidth={2.5}
                    />
                    <span>Tanpa kartu kredit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check
                      className="w-4 h-4 text-green-500"
                      strokeWidth={2.5}
                    />
                    <span>Batal kapan saja</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check
                      className="w-4 h-4 text-green-500"
                      strokeWidth={2.5}
                    />
                    <span>Rp20.000/bulan</span>
                  </div>
                </div>
              </div>

              {/* Right Content - Mobile Phone Mockup */}
              <div className="relative flex justify-center lg:justify-end">
                {/* Phone Frame - Single phone */}
                <div className="relative w-[280px] sm:w-[300px]">
                  {/* Phone Border */}
                  <div className="relative bg-slate-900 rounded-[2.5rem] p-2 shadow-2xl">
                    {/* Phone Screen */}
                    <div className="bg-white rounded-[2rem] overflow-hidden">
                      {/* Status Bar */}
                      <div className="bg-slate-900 px-6 py-2 flex justify-between items-center">
                        <span className="text-white text-xs font-medium">
                          09:41
                        </span>
                        <div className="flex items-center gap-1">
                          <Globe
                            className="w-4 h-4 text-white"
                            strokeWidth={2}
                          />
                          <Lock
                            className="w-4 h-4 text-white"
                            strokeWidth={2}
                          />
                        </div>
                      </div>

                      {/* App Header */}
                      <div className="bg-green-500 px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <ShoppingCart
                              className="w-6 h-6 text-white"
                              strokeWidth={2}
                            />
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-sm">
                              Kedai Kopi Senja
                            </h3>
                            <p className="text-green-100 text-xs flex items-center gap-1">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-400" />
                              Buka • 08:00 - 22:00
                            </p>
                          </div>
                          <span className="ml-auto text-[10px] font-bold bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full">OPEN</span>
                        </div>
                      </div>

                      {/* Categories */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex gap-2 overflow-hidden">
                          <div className="px-3 py-1.5 bg-green-200 text-green-800 text-xs font-bold rounded-full whitespace-nowrap">
                            Semua Menu
                          </div>
                          <div className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full whitespace-nowrap">
                            Kopi
                          </div>
                          <div className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full whitespace-nowrap">
                            Non-Kopi
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-4 space-y-3">
                        {/* Menu Item 1 */}
                        <div className="flex gap-3 p-2.5 bg-gray-50 rounded-xl">
                          <div className="w-16 h-16 bg-gradient-to-br from-amber-200 to-amber-300 rounded-lg flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-gray-900 font-bold text-sm truncate">
                              Kopi Susu Gula Aren
                            </h4>
                            <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">
                              Espresso dengan susu segar
                            </p>
                            <p className="text-green-500 font-bold text-sm mt-1">
                              Rp 18.000
                            </p>
                          </div>
                        </div>

                        {/* Menu Item 2 */}
                        <div className="flex gap-3 p-2.5 bg-gray-50 rounded-xl">
                          <div className="w-16 h-16 bg-gradient-to-br from-amber-700 to-amber-800 rounded-lg flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-gray-900 font-bold text-sm truncate">
                              Americano
                            </h4>
                            <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">
                              Espresso dengan air panas
                            </p>
                            <p className="text-green-500 font-bold text-sm mt-1">
                              Rp 15.000
                            </p>
                          </div>
                        </div>

                        {/* Menu Item 3 */}
                        <div className="flex gap-3 p-2.5 bg-gray-50 rounded-xl">
                          <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-pink-300 rounded-lg flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-gray-900 font-bold text-sm truncate">
                              Strawberry Latte
                            </h4>
                            <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">
                              Susu dengan sirup strawberry
                            </p>
                            <p className="text-green-500 font-bold text-sm mt-1">
                              Rp 22.000
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 — Kenapa MyMenu */}
        <section id="fitur" className="py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">

            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="inline-flex items-center gap-2 text-yellow-700 font-semibold text-sm uppercase tracking-widest mb-4 bg-yellow-100 px-3 py-1 rounded-full border border-yellow-200">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                Kenapa MyMenu?
              </p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.15]">
                Dari kertas ke digital,<br />
                <span className="text-green-500">dalam 5 menit</span>
              </h2>
            </div>

            {/* Bento Grid — value propositions */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4">

              {/* Card 1 — Tidak perlu cetak ulang */}
              <div className="md:col-span-5 bg-green-500 rounded-3xl p-8 flex flex-col justify-between min-h-[320px] relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-green-400/40 rounded-full" />
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-green-600/30 rounded-full" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-5">
                    <Pencil className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 leading-snug">
                    Tidak perlu cetak ulang setiap ada perubahan
                  </h3>
                  <p className="text-green-100 text-sm leading-relaxed">
                    Ganti nama, foto, harga, atau tandai menu habis — semua bisa dilakukan dari HP dan langsung live tanpa cetak ulang, tanpa biaya tambahan.
                  </p>
                </div>
                <div className="relative z-10 mt-6 bg-white/10 rounded-2xl px-4 py-3">
                  <p className="text-green-100 text-xs font-medium">💡 Rata-rata pemilik warung cetak ulang menu <span className="text-white font-bold">3–4x per tahun</span>. Dengan MyMenu, tidak perlu sama sekali.</p>
                </div>
              </div>

              {/* Card 2 — right column */}
              <div className="md:col-span-7 grid grid-rows-2 gap-4">
                <div className="bg-white rounded-3xl p-7 flex gap-5 items-start border border-gray-100">
                  <div className="w-11 h-11 bg-amber-50 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Smartphone className="w-5 h-5 text-amber-500" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1.5">Pelanggan tidak perlu download apa pun</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Tidak seperti aplikasi pesan antar yang butuh install dan akun. Menu MyMenu terbuka langsung di browser — scan QR atau klik link, selesai.
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-3xl p-7 flex gap-5 items-start border border-gray-100">
                  <div className="w-11 h-11 bg-green-50 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BadgeCheck className="w-5 h-5 text-green-500" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1.5">Jauh lebih murah dari solusi lain</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Aplikasi kasir dan POS bisa jutaan per bulan. MyMenu fokus ke satu hal — menu digital yang rapi dan bisa dibagikan — dengan harga yang masuk akal untuk UMKM.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="md:col-span-4 bg-stone-900 rounded-3xl p-7 flex flex-col justify-between min-h-[240px] relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mb-8 -mr-8" />
                <div>
                  <div className="w-11 h-11 bg-green-500/20 rounded-2xl flex items-center justify-center mb-5">
                    <Zap className="w-5 h-5 text-green-400" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Tidak perlu ahli IT</h3>
                  <p className="text-stone-400 text-sm leading-relaxed">
                    Kalau bisa pakai WhatsApp, Anda bisa pakai MyMenu. Tidak ada coding, tidak ada desain, tidak ada konfigurasi rumit.
                  </p>
                </div>
                <div className="flex gap-2 mt-5">
                  {['Daftar', 'Isi Menu', 'Bagikan'].map(d => (
                    <span key={d} className="text-xs bg-stone-800 text-stone-300 px-2.5 py-1 rounded-full">{d}</span>
                  ))}
                </div>
              </div>

              {/* Card 4 */}
              <div className="md:col-span-4 bg-white rounded-3xl p-7 border border-gray-100 flex flex-col justify-between min-h-[240px]">
                <div>
                  <div className="w-11 h-11 bg-purple-50 rounded-2xl flex items-center justify-center mb-5">
                    <Link2 className="w-5 h-5 text-purple-500" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Satu link untuk semua channel</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Satu URL yang sama bisa ditempel di bio Instagram, dikirim via WhatsApp, dicetak di struk, atau dipasang di QR code meja.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-5">
                  {['Instagram', 'WhatsApp', 'QR Meja', 'Struk'].map(c => (
                    <span key={c} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-medium">{c}</span>
                  ))}
                </div>
              </div>

              {/* Card 5 */}
              <div className="md:col-span-4 bg-green-50 rounded-3xl p-7 border border-green-100 flex flex-col justify-between min-h-[240px]">
                <div>
                  <div className="w-11 h-11 bg-green-100 rounded-2xl flex items-center justify-center mb-5">
                    <Eye className="w-5 h-5 text-green-500" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Kesan pertama yang profesional</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Menu digital yang rapi dan berisi foto produk membuat toko Anda terlihat lebih serius dan terpercaya di mata pelanggan baru.
                  </p>
                </div>
                <div className="mt-5 flex items-center gap-2 text-green-600 text-xs font-semibold">
                  <span>✨</span>
                  <span>Tampilan konsisten di semua perangkat</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* --- FITUR SECTION --- */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="mb-14">
                <p className="inline-flex items-center gap-2 text-yellow-700 font-semibold text-sm uppercase tracking-widest mb-4 bg-yellow-100 px-3 py-1 rounded-full border border-yellow-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                  Fitur
                </p>
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.15]">
                    Apa saja yang bisa<br />
                    <span className="text-green-500">Anda lakukan</span>
                  </h2>
                  <p className="text-gray-500 text-lg leading-relaxed max-w-xs lg:text-right border-l-2 border-yellow-300 pl-3 lg:border-l-0 lg:border-r-2 lg:pr-3 lg:pl-0">
                    Semua fitur untuk mengelola menu digital toko Anda.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

                {/* Row 1 */}
                {/* Dashboard — col 5, tall */}
                <div className="md:col-span-5 bg-stone-900 rounded-3xl p-7 flex flex-col justify-between min-h-[220px] relative overflow-hidden">
                  <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-green-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="relative z-10">
                    <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center mb-5">
                      <UtensilsCrossed className="w-5 h-5 text-green-400" strokeWidth={2} />
                    </div>
                    <h4 className="font-bold text-white text-lg mb-2">Dashboard Pemilik</h4>
                    <p className="text-sm text-stone-400 leading-relaxed">Tambah, edit, dan nonaktifkan menu kapan saja dari satu dashboard yang simpel.</p>
                  </div>
                  <div className="relative z-10 mt-5 flex items-center gap-2">
                    <span className="text-xs bg-green-500 text-white px-2.5 py-1 rounded-full font-medium">Live</span>
                    <span className="text-stone-500 text-xs">Perubahan langsung terlihat pelanggan</span>
                  </div>
                </div>

                {/* Kategori — col 4 */}
                <div className="md:col-span-4 bg-amber-50 rounded-3xl p-7 border border-amber-100 flex flex-col justify-between min-h-[220px]">
                  <div>
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mb-5">
                      <Grid3x3 className="w-5 h-5 text-amber-600" strokeWidth={2} />
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">Kategori Menu</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">Buat kategori sendiri: Makanan, Minuman, Snack, Promo — pelanggan mudah navigasi.</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {['Makanan', 'Minuman', 'Promo'].map(c => (
                      <span key={c} className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">{c}</span>
                    ))}
                  </div>
                </div>

                {/* Foto — col 3 */}
                <div className="md:col-span-3 bg-pink-50 rounded-3xl p-7 border border-pink-100 flex flex-col justify-between min-h-[220px]">
                  <div>
                    <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center mb-5">
                      <ImageIcon className="w-5 h-5 text-pink-600" strokeWidth={2} />
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">Foto per Item</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">Upload foto tiap menu. Visual yang bagus = lebih banyak yang pesan.</p>
                  </div>
                </div>

                {/* Row 2 */}
                {/* Aktif/Nonaktif — col 3 */}
                <div className="md:col-span-3 bg-green-500 rounded-3xl p-7 flex flex-col justify-between min-h-[200px]">
                  <div>
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-5">
                      <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                    <h4 className="font-bold text-white text-lg mb-2">Aktif / Nonaktif</h4>
                    <p className="text-sm text-green-100 leading-relaxed">Toggle item on/off. Menu habis? Nonaktifkan dalam satu klik.</p>
                  </div>
                </div>

                {/* QR Code — col 5 */}
                <div className="md:col-span-5 bg-white rounded-3xl p-7 border border-gray-100 flex flex-col justify-between min-h-[200px]">
                  <div>
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
                      <ScanLine className="w-5 h-5 text-blue-600" strokeWidth={2} />
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">QR Code & URL Toko</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">QR code otomatis siap cetak untuk meja. URL unik <span className="font-mono text-green-500 bg-green-50 px-1 rounded">mymenu.id/namatoko</span> untuk dibagikan ke mana saja.</p>
                  </div>
                </div>

                {/* Custom Tema — col 4 */}
                <div className="md:col-span-4 bg-violet-50 rounded-3xl p-7 border border-violet-100 flex flex-col justify-between min-h-[200px]">
                  <div>
                    <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center mb-5">
                      <Palette className="w-5 h-5 text-violet-600" strokeWidth={2} />
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">Custom Tema</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">Pilih warna dan gaya tampilan halaman menu sesuai identitas toko Anda.</p>
                  </div>
                </div>

                {/* Banner & Profil — full width */}
                <div className="md:col-span-12 bg-gray-50 rounded-3xl p-7 border border-gray-100 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                  <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <LayoutTemplate className="w-5 h-5 text-sky-600" strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Banner & Profil Toko</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">Upload foto banner dan logo toko. Halaman menu Anda tampil seperti landing page yang profesional — bukan sekadar daftar harga.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">

            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="inline-flex items-center gap-2 text-yellow-700 font-semibold text-sm uppercase tracking-widest mb-4 bg-yellow-100 px-3 py-1 rounded-full border border-yellow-200">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                Cara Kerja
              </p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.15]">
                Siap dalam hitungan<br />
                <span className="text-green-500">menit, bukan hari</span>
              </h2>
              <p className="text-gray-500 text-lg mt-5 leading-relaxed">
                Tidak perlu belajar desain atau coding. Ikuti 4 langkah ini dan menu digital Anda langsung bisa dibagikan.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              {/* Steps */}
              <div className="grid md:grid-cols-4 gap-6 relative">
                {/* Connector line desktop */}
                <div className="hidden md:block absolute top-9 left-[12.5%] right-[12.5%] h-px bg-yellow-200 z-0" />

                {[
                  {
                    step: "01",
                    icon: "✉️",
                    title: "Daftar akun",
                    desc: "Masukkan email dan password. Selesai dalam 30 detik, tanpa kartu kredit.",
                    color: "bg-green-50 border-green-100",
                    numColor: "text-green-500",
                  },
                  {
                    step: "02",
                    icon: "🏪",
                    title: "Buat profil toko",
                    desc: "Isi nama toko, deskripsi singkat, dan nomor WhatsApp untuk dihubungi pelanggan.",
                    color: "bg-amber-50 border-amber-100",
                    numColor: "text-amber-500",
                  },
                  {
                    step: "03",
                    icon: "🍜",
                    title: "Tambah menu",
                    desc: "Upload foto, tulis nama dan harga. Bisa tambah kategori seperti Makanan, Minuman, Promo.",
                    color: "bg-green-50 border-green-100",
                    numColor: "text-green-500",
                  },
                  {
                    step: "04",
                    icon: "📲",
                    title: "Bagikan ke pelanggan",
                    desc: "Cetak QR code untuk meja, atau pasang link menu di bio Instagram, TikTok, dan media sosial lainnya.",
                    color: "bg-amber-50 border-amber-100",
                    numColor: "text-amber-500",
                  },
                ].map((item, i) => (
                  <div key={i} className="relative z-10 flex flex-col items-center text-center">
                    {/* Step circle */}
                    <div className={`w-[72px] h-[72px] rounded-2xl border-2 ${item.color} flex items-center justify-center text-3xl mb-5 shadow-sm`}>
                      {item.icon}
                    </div>
                    <span className={`text-xs font-black tracking-widest ${item.numColor} mb-2`}>{item.step}</span>
                    <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Bottom proof strip */}
              <div className="mt-16 bg-yellow-50 rounded-2xl border border-yellow-200 px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-yellow-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Rata-rata pengguna baru selesai setup dan membagikan menu pertama mereka dalam <span className="font-semibold text-gray-900">kurang dari 8 menit.</span>
                  </p>
                </div>
                <Link
                  href="/register"
                  className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-yellow-400 text-gray-900 text-sm font-semibold rounded-xl hover:bg-yellow-500 transition-colors"
                >
                  Coba Sekarang
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* --- FINAL CTA SECTION --- */}
        <section className="py-24 bg-gray-50 relative">
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="relative rounded-3xl bg-stone-900 overflow-hidden px-6 py-16 sm:px-16 sm:py-20 shadow-2xl">
              {/* Subtle grid texture */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid-pattern-dark" width="32" height="32" patternUnits="userSpaceOnUse">
                      <path d="M0 32V0h32" fill="none" stroke="white" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-pattern-dark)" />
                </svg>
              </div>

              {/* Decorative green glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-3xl mx-auto text-center">
                {/* Social proof pill */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 rounded-full text-stone-300 text-sm mb-8">
                  <span className="flex h-2 w-2 rounded-full bg-green-400" />
                  500+ warung & kafe sudah bergabung
                </div>

                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.15]">
                  Tinggalkan menu kertas.<br />
                  <span className="text-green-500">Mulai hari ini.</span>
                </h2>

                <p className="text-stone-400 text-lg mb-10 leading-relaxed max-w-xl mx-auto">
                  Gratis 7 hari. Tidak perlu kartu kredit. Setup selesai sebelum kopi Anda dingin.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    href="/register"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-green-500 text-white text-base font-semibold rounded-xl hover:bg-green-600 transition-colors"
                  >
                    <Rocket className="w-5 h-5" />
                    Coba Gratis 7 Hari
                  </Link>
                  <a
                    href="https://wa.me/628123456789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-transparent text-stone-300 text-base font-semibold rounded-xl border border-stone-700 hover:bg-stone-800 hover:text-white transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Tanya via WhatsApp
                  </a>
                </div>

                <div className="mt-10 flex items-center justify-center gap-2 text-stone-500 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Gratis 7 hari · Tanpa kartu kredit · Batal kapan saja</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400">
        <div className="container mx-auto px-4 sm:px-6 pt-14 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center">
                  <ClipboardList className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="font-bold text-white text-lg tracking-tight">MyMenu</span>
              </div>
              <p className="text-sm leading-relaxed text-stone-500">
                Solusi menu digital untuk warung, kafe, dan restoran Indonesia. Mudah, cepat, terjangkau.
              </p>
            </div>

            {/* Product links */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-4">Produk</p>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="#fitur" className="hover:text-white transition-colors">Fitur</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Coba Gratis</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Masuk</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-4">Legal</p>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/syarat" className="hover:text-white transition-colors">Syarat & Ketentuan</Link></li>
                <li><Link href="/privasi" className="hover:text-white transition-colors">Kebijakan Privasi</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-stone-600">&copy; {new Date().getFullYear()} MyMenu. Hak Cipta Dilindungi.</p>
            <p className="text-xs text-stone-600">Dibuat dengan ❤️ untuk UMKM Indonesia</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
