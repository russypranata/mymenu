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
  ClipboardList,
  Rocket,
  Coffee,
  UtensilsCrossed,
  Wine,
  Image as ImageIcon,
  ArrowRight,
  CheckCircle2,
  ScanLine,
  Link2,
  Pencil,
  BadgeCheck,
  Palette,
  LayoutTemplate,
  BarChart3,
  HelpCircle,
  Store,
  ChefHat,
  IceCream,
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
      <header className="fixed top-2 sm:top-4 left-0 right-0 z-50 px-2 sm:px-4">
        <nav className="max-w-6xl mx-auto bg-white border border-green-100 rounded-xl sm:rounded-2xl transition-all">
          <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3.5">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-green-500 rounded-lg sm:rounded-xl flex items-center justify-center transition-all">
                <ClipboardList
                  className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                  strokeWidth={2.5}
                />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-800 tracking-tight">
                MyMenu
              </span>
            </Link>

            {/* Nav Actions */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-green-500 hover:bg-green-50 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" strokeWidth={2} />
                Masuk
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-green-500 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:bg-green-600 transition-all"
              >
                <Rocket className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
                <span>Coba Gratis</span>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="pt-20 sm:pt-28">
        {/* Hero Section - Split Layout */}
        <section className="relative min-h-[calc(100dvh-5rem)] flex flex-col justify-center pb-16 sm:pb-24 lg:pb-32 overflow-hidden">
          {/* Background Pattern - Menu Icons */}
          <div className="absolute inset-0 opacity-5 sm:opacity-10 pointer-events-none">
            <div className="absolute top-16 left-16 text-green-500 hidden lg:block">
              <ClipboardList className="w-40 h-40" strokeWidth={1.5} />
            </div>
            <div className="absolute top-10 left-1/2 -translate-x-1/2 text-green-500 hidden lg:block">
              <Coffee className="w-40 h-40" strokeWidth={1.5} />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green-500">
              <QrCode className="w-32 h-32 sm:w-40 sm:h-40" strokeWidth={1.5} />
            </div>
            <div className="absolute bottom-16 left-16 text-green-500 hidden lg:block">
              <Smartphone className="w-40 h-40" strokeWidth={1.5} />
            </div>
            <div className="absolute top-16 right-16 text-green-500 hidden lg:block">
              <UtensilsCrossed className="w-40 h-40" strokeWidth={1.5} />
            </div>
            <div className="absolute bottom-16 right-16 text-green-500 hidden lg:block">
              <Wine className="w-40 h-40" strokeWidth={1.5} />
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 items-center max-w-6xl mx-auto">
              {/* Left Content - 60% */}
              <div className="lg:col-span-3 text-center lg:text-left relative z-10">
                {/* Pill Badge */}
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-yellow-100 border border-yellow-300 rounded-full text-yellow-800 font-medium text-[10px] sm:text-xs lg:text-sm mb-4 sm:mb-6">
                  <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-yellow-500"></span>
                  </span>
                  <span className="leading-none">Solusi Menu Digital untuk UMKM Indonesia</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 tracking-tight leading-[1.15] mb-4 sm:mb-6">
                  Buat Menu Digital
                  <span className="block text-green-500">Dalam <span className="relative inline-block">
                    <span className="relative z-10">5 Menit</span>
                    <span className="absolute -bottom-2 sm:-bottom-3 left-0 right-0 h-2 sm:h-3 bg-yellow-300/60 -rotate-1 rounded" />
                  </span></span>
                </h1>

                <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed lg:pr-16 xl:pr-24">
                  Solusi digital untuk penjualan warung, kafe, atau restoran Anda dengan
                  menu digital modern yang bisa langsung dibuka lewat link & QR
                  code.
                </p>

                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center lg:justify-start mb-6 sm:mb-8">
                  <Link
                    href="/register"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 bg-green-500 text-white text-sm sm:text-base font-semibold rounded-xl hover:bg-green-600 transition-all"
                  >
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
                    Coba Gratis
                  </Link>
                  <Link
                    href="/demo-kedai-kopi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 bg-yellow-400 text-gray-900 text-sm sm:text-base font-semibold rounded-xl hover:bg-yellow-500 transition-all"
                  >
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
                    Lihat Demo
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-x-4 sm:gap-x-6 gap-y-2 sm:gap-y-3 text-xs sm:text-sm font-medium text-gray-500">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Check
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500"
                      strokeWidth={2.5}
                    />
                    <span>Tanpa kartu kredit</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Check
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500"
                      strokeWidth={2.5}
                    />
                    <span>Batal kapan saja</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Check
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500"
                      strokeWidth={2.5}
                    />
                    <span>Rp20.000/bulan</span>
                  </div>
                </div>
              </div>

              {/* Right Content - Feature Bento Grid - 40% */}
              <div className="lg:col-span-2 relative flex justify-center lg:justify-end mt-6 lg:mt-0">
                <div className="w-full max-w-sm lg:max-w-none">
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    {/* QR Code Card */}
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center min-h-[140px] sm:min-h-[160px] lg:min-h-[150px] relative overflow-hidden">
                      <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
                      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full" />
                      <div className="relative z-10">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl flex items-center justify-center mb-2.5 mx-auto">
                          <QrCode className="w-6 h-6 sm:w-7 sm:h-7 text-green-500" strokeWidth={2} />
                        </div>
                        <p className="text-white font-bold text-xs sm:text-sm">Scan & Buka</p>
                        <p className="text-green-100 text-[10px] sm:text-xs mt-0.5">Tanpa install</p>
                      </div>
                    </div>

                    {/* Link Share Card */}
                    <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center min-h-[140px] sm:min-h-[160px] lg:min-h-[150px] relative overflow-hidden">
                      <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />
                      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
                      <div className="relative z-10">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl flex items-center justify-center mb-2.5 mx-auto">
                          <Link2 className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-500" strokeWidth={2} />
                        </div>
                        <p className="text-gray-900 font-bold text-xs sm:text-sm">Bagikan Link</p>
                        <p className="text-gray-800 text-[10px] sm:text-xs mt-0.5">Ke mana saja</p>
                      </div>
                    </div>

                    {/* Edit Anytime Card */}
                    <div className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center min-h-[140px] sm:min-h-[160px] lg:min-h-[150px] border-2 border-gray-100 relative overflow-hidden">
                      <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-50 rounded-full" />
                      <div className="relative z-10">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-50 rounded-xl flex items-center justify-center mb-2.5 mx-auto">
                          <Pencil className="w-6 h-6 sm:w-7 sm:h-7 text-green-500" strokeWidth={2} />
                        </div>
                        <p className="text-gray-900 font-bold text-xs sm:text-sm">Edit Kapan Saja</p>
                        <p className="text-gray-600 text-[10px] sm:text-xs mt-0.5">Langsung live</p>
                      </div>
                    </div>

                    {/* Custom Theme Card */}
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center min-h-[140px] sm:min-h-[160px] lg:min-h-[150px] relative overflow-hidden">
                      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />
                      <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
                      <div className="relative z-10">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl flex items-center justify-center mb-2.5 mx-auto">
                          <Palette className="w-6 h-6 sm:w-7 sm:h-7 text-purple-500" strokeWidth={2} />
                        </div>
                        <p className="text-white font-bold text-xs sm:text-sm">Custom Theme</p>
                        <p className="text-purple-100 text-[10px] sm:text-xs mt-0.5">Sesuai brand</p>
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 — Kenapa MyMenu */}
        <section id="fitur" className="py-16 sm:py-20 lg:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">

            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <p className="inline-flex items-center gap-2 text-yellow-700 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4 bg-yellow-100 px-2.5 sm:px-3 py-1 rounded-full border border-yellow-200">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                Kenapa MyMenu?
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.15]">
                Dari kertas ke digital,<br />
                <span className="text-green-500">dalam 5 menit</span>
              </h2>
            </div>

            {/* Bento Grid — value propositions */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">

              {/* Card 1 — Tidak perlu cetak ulang */}
              <div className="md:col-span-5 bg-green-500 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[280px] sm:min-h-[320px] relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-green-400/40 rounded-full" />
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-green-600/30 rounded-full" />
                <div className="relative z-10">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5">
                    <Pencil className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 leading-snug">
                    Tidak perlu cetak ulang setiap ada perubahan
                  </h3>
                  <p className="text-green-100 text-xs sm:text-sm leading-relaxed">
                    Ganti nama, foto, harga, atau tandai menu habis — semua bisa dilakukan dari HP dan langsung live tanpa cetak ulang, tanpa biaya tambahan.
                  </p>
                </div>
                <div className="relative z-10 mt-4 sm:mt-6 bg-white/10 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3">
                  <p className="text-green-100 text-[10px] sm:text-xs font-medium">💡 Rata-rata pemilik warung cetak ulang menu <span className="text-white font-bold">3–4x per tahun</span>. Dengan MyMenu, tidak perlu sama sekali.</p>
                </div>
              </div>

              {/* Card 2 — right column */}
              <div className="md:col-span-7 grid grid-rows-2 gap-3 sm:gap-4">
                <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 flex gap-4 sm:gap-5 items-start border border-gray-100">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-amber-50 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-1.5">Pelanggan tidak perlu download apa pun</h3>
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                      Tidak seperti aplikasi pesan antar yang butuh install dan akun. Menu MyMenu terbuka langsung di browser — scan QR atau klik link, selesai.
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 flex gap-4 sm:gap-5 items-start border border-gray-100">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-green-50 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BadgeCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-1.5">Jauh lebih murah dari solusi lain</h3>
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                      Aplikasi kasir dan POS bisa jutaan per bulan. MyMenu fokus ke satu hal — menu digital yang rapi dan bisa dibagikan — dengan harga yang masuk akal untuk UMKM.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="md:col-span-4 bg-stone-900 rounded-2xl sm:rounded-3xl p-5 sm:p-7 flex flex-col justify-between min-h-[200px] sm:min-h-[240px] relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mb-8 -mr-8" />
                <div>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-green-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" strokeWidth={2} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 sm:mb-2">Tidak perlu ahli IT</h3>
                  <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                    Kalau bisa pakai WhatsApp, Anda bisa pakai MyMenu. Tidak ada coding, tidak ada desain, tidak ada konfigurasi rumit.
                  </p>
                </div>
                <div className="flex gap-1.5 sm:gap-2 mt-4 sm:mt-5">
                  {['Daftar', 'Isi Menu', 'Bagikan'].map(d => (
                    <span key={d} className="text-[10px] sm:text-xs bg-stone-800 text-stone-300 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">{d}</span>
                  ))}
                </div>
              </div>

              {/* Card 4 */}
              <div className="md:col-span-4 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-gray-100 flex flex-col justify-between min-h-[200px] sm:min-h-[240px]">
                <div>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-purple-50 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5">
                    <Link2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" strokeWidth={2} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">Satu link untuk semua channel</h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                    Satu URL yang sama bisa ditempel di bio Instagram, dikirim via WhatsApp, dicetak di struk, atau dipasang di QR code meja.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-4 sm:mt-5">
                  {['Instagram', 'WhatsApp', 'QR Meja', 'Struk'].map(c => (
                    <span key={c} className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium">{c}</span>
                  ))}
                </div>
              </div>

              {/* Card 5 */}
              <div className="md:col-span-4 bg-green-50 rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-green-100 flex flex-col justify-between min-h-[200px] sm:min-h-[240px]">
                <div>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-green-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" strokeWidth={2} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">Kesan pertama yang profesional</h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    Menu digital yang rapi dan berisi foto produk membuat toko Anda terlihat lebih serius dan terpercaya di mata pelanggan baru.
                  </p>
                </div>
                <div className="mt-4 sm:mt-5 flex items-center gap-2 text-green-600 text-[10px] sm:text-xs font-semibold">
                  <span>✨</span>
                  <span>Tampilan konsisten di semua perangkat</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* --- FITUR SECTION --- */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="mb-10 sm:mb-14">
                <p className="inline-flex items-center gap-2 text-yellow-700 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4 bg-yellow-100 px-2.5 sm:px-3 py-1 rounded-full border border-yellow-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                  Fitur
                </p>
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 sm:gap-4">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.15]">
                    Apa saja yang bisa<br />
                    <span className="text-green-500">Anda lakukan</span>
                  </h2>
                  <p className="text-gray-500 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xs lg:text-right border-l-2 border-yellow-300 pl-3 lg:border-l-0 lg:border-r-2 lg:pr-3 lg:pl-0">
                    Semua fitur untuk mengelola menu digital toko Anda.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">

                {/* Row 1 */}
                {/* Dashboard — col 5, tall */}
                <div className="md:col-span-5 bg-stone-900 rounded-2xl sm:rounded-3xl p-5 sm:p-7 flex flex-col justify-between min-h-[200px] sm:min-h-[220px] relative overflow-hidden">
                  <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-green-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="relative z-10">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-5">
                      <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" strokeWidth={2} />
                    </div>
                    <h4 className="font-bold text-white text-base sm:text-lg mb-1.5 sm:mb-2">Dashboard Pemilik</h4>
                    <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">Tambah, edit, dan nonaktifkan menu kapan saja dari satu dashboard yang simpel.</p>
                  </div>
                  <div className="relative z-10 mt-4 sm:mt-5 flex items-center gap-2">
                    <span className="text-[10px] sm:text-xs bg-green-500 text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-medium">Live</span>
                    <span className="text-stone-500 text-[10px] sm:text-xs">Perubahan langsung terlihat pelanggan</span>
                  </div>
                </div>

                {/* Kategori — col 4 */}
                <div className="md:col-span-4 bg-amber-50 rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-amber-100 flex flex-col justify-between min-h-[200px] sm:min-h-[220px]">
                  <div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-amber-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-5">
                      <Grid3x3 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" strokeWidth={2} />
                    </div>
                    <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-1.5 sm:mb-2">Kategori Menu</h4>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">Buat kategori sendiri: Makanan, Minuman, Snack, Promo — pelanggan mudah navigasi.</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3 sm:mt-4">
                    {['Makanan', 'Minuman', 'Promo'].map(c => (
                      <span key={c} className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">{c}</span>
                    ))}
                  </div>
                </div>

                {/* Foto — col 3 */}
                <div className="md:col-span-3 bg-pink-50 rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-pink-100 flex flex-col justify-between min-h-[200px] sm:min-h-[220px]">
                  <div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-pink-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-5">
                      <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" strokeWidth={2} />
                    </div>
                    <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-1.5 sm:mb-2">Foto per Item</h4>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">Upload foto tiap menu. Visual yang bagus = lebih banyak yang pesan.</p>
                  </div>
                </div>

                {/* Row 2 */}
                {/* Aktif/Nonaktif — col 3 */}
                <div className="md:col-span-3 bg-green-500 rounded-2xl sm:rounded-3xl p-5 sm:p-7 flex flex-col justify-between min-h-[180px] sm:min-h-[200px]">
                  <div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-5">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2} />
                    </div>
                    <h4 className="font-bold text-white text-base sm:text-lg mb-1.5 sm:mb-2">Aktif / Nonaktif</h4>
                    <p className="text-xs sm:text-sm text-green-100 leading-relaxed">Toggle item on/off. Menu habis? Nonaktifkan dalam satu klik.</p>
                  </div>
                </div>

                {/* QR Code — col 5 */}
                <div className="md:col-span-5 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-gray-100 flex flex-col justify-between min-h-[180px] sm:min-h-[200px]">
                  <div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-5">
                      <ScanLine className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" strokeWidth={2} />
                    </div>
                    <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-1.5 sm:mb-2">QR Code & URL Toko</h4>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">QR code otomatis siap cetak untuk meja. URL unik <span className="font-mono text-green-500 bg-green-50 px-1 rounded text-[10px] sm:text-xs">mymenu.id/namatoko</span> untuk dibagikan ke mana saja.</p>
                  </div>
                </div>

                {/* Custom Tema — col 4 */}
                <div className="md:col-span-4 bg-violet-50 rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-violet-100 flex flex-col justify-between min-h-[180px] sm:min-h-[200px]">
                  <div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-violet-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-5">
                      <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600" strokeWidth={2} />
                    </div>
                    <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-1.5 sm:mb-2">Kustomisasi Tampilan</h4>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">Pilih warna brand, upload logo & banner, atur tema halaman menu sesuai identitas toko Anda. Tampil profesional tanpa perlu desainer.</p>
                  </div>
                </div>

                {/* Banner & Profil — full width */}
                <div className="md:col-span-12 bg-gray-50 rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-gray-100 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-sky-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <LayoutTemplate className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-1">Banner & Profil Toko</h4>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">Upload foto banner dan logo toko. Halaman menu Anda tampil seperti landing page yang profesional — bukan sekadar daftar harga.</p>
                  </div>
                </div>

                {/* Analytics */}
                <div className="md:col-span-12 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-indigo-100 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-1">Statistik Pengunjung</h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Lihat berapa banyak orang yang mengunjungi menu Anda. Data real-time untuk membantu Anda memahami performa menu digital.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">

            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <p className="inline-flex items-center gap-2 text-yellow-700 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4 bg-yellow-100 px-2.5 sm:px-3 py-1 rounded-full border border-yellow-200">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                Cara Kerja
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.15]">
                Siap dalam hitungan<br />
                <span className="text-green-500">menit, bukan hari</span>
              </h2>
              <p className="text-gray-500 text-sm sm:text-base lg:text-lg mt-4 sm:mt-5 leading-relaxed">
                Tidak perlu belajar desain atau coding. Ikuti 4 langkah ini dan menu digital Anda langsung bisa dibagikan.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              {/* Steps */}
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-4 md:gap-6 relative">
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
                    <div className={`w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-xl sm:rounded-2xl border-2 ${item.color} flex items-center justify-center text-2xl sm:text-3xl mb-4 sm:mb-5`}>
                      {item.icon}
                    </div>
                    <span className={`text-xs font-black tracking-widest ${item.numColor} mb-1.5 sm:mb-2`}>{item.step}</span>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1.5 sm:mb-2">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Bottom proof strip */}
              <div className="mt-12 sm:mt-16 bg-yellow-50 rounded-xl sm:rounded-2xl border border-yellow-200 px-5 sm:px-8 py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-yellow-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                    Rata-rata pengguna baru selesai setup dan membagikan menu pertama mereka dalam <span className="font-semibold text-gray-900">kurang dari 8 menit.</span>
                  </p>
                </div>
                <Link
                  href="/register"
                  className="flex-shrink-0 flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-yellow-400 text-gray-900 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:bg-yellow-500 transition-colors"
                >
                  Coba Sekarang
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* --- UNTUK SIAPA SECTION --- NEW */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <p className="inline-flex items-center gap-2 text-yellow-700 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4 bg-yellow-100 px-2.5 sm:px-3 py-1 rounded-full border border-yellow-200">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                Untuk Siapa?
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.15]">
                Cocok untuk<br />
                <span className="text-green-500">semua jenis usaha</span>
              </h2>
              <p className="text-gray-500 text-sm sm:text-base lg:text-lg mt-4 sm:mt-5 leading-relaxed">
                Dari warung kecil hingga restoran, MyMenu membantu UMKM Indonesia tampil profesional dengan menu digital.
              </p>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  icon: <Coffee className="w-5 h-5 sm:w-6 sm:h-6" />,
                  title: "Warung Kopi & Kafe",
                  desc: "Tampilkan menu kopi dan minuman dengan foto menarik. Pelanggan bisa lihat menu sebelum datang.",
                  color: "bg-amber-50 border-amber-100 text-amber-600",
                },
                {
                  icon: <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6" />,
                  title: "Rumah Makan & Restoran",
                  desc: "Menu digital yang rapi dengan kategori. Pelanggan bisa browse menu dari HP mereka.",
                  color: "bg-green-50 border-green-100 text-green-600",
                },
                {
                  icon: <Store className="w-5 h-5 sm:w-6 sm:h-6" />,
                  title: "Toko Kelontong",
                  desc: "Jual makanan & minuman? Buat katalog digital yang mudah dibagikan ke pelanggan.",
                  color: "bg-blue-50 border-blue-100 text-blue-600",
                },
                {
                  icon: <ChefHat className="w-5 h-5 sm:w-6 sm:h-6" />,
                  title: "Cloud Kitchen & Katering",
                  desc: "Fokus masak, biarkan menu digital yang promosikan produk Anda ke pelanggan.",
                  color: "bg-purple-50 border-purple-100 text-purple-600",
                },
                {
                  icon: <IceCream className="w-5 h-5 sm:w-6 sm:h-6" />,
                  title: "Dessert & Bakery",
                  desc: "Pamer kue dan dessert dengan foto yang menggugah selera. Tingkatkan order online.",
                  color: "bg-pink-50 border-pink-100 text-pink-600",
                },
                {
                  icon: <Wine className="w-5 h-5 sm:w-6 sm:h-6" />,
                  title: "Juice Bar & Minuman",
                  desc: "Menu minuman segar dengan visual menarik. Mudah update promo dan menu seasonal.",
                  color: "bg-orange-50 border-orange-100 text-orange-600",
                },
              ].map((item, i) => (
                <div key={i} className={`rounded-xl sm:rounded-2xl border-2 ${item.color} p-5 sm:p-6 hover:border-opacity-80 transition-all`}>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 ${item.color}`}>
                    {item.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- FAQ SECTION --- NEW */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <p className="inline-flex items-center gap-2 text-yellow-700 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4 bg-yellow-100 px-2.5 sm:px-3 py-1 rounded-full border border-yellow-200">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                FAQ
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.15]">
                Pertanyaan yang<br />
                <span className="text-green-500">sering ditanya</span>
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
              {[
                {
                  q: "Apakah benar gratis 7 hari?",
                  a: "Ya! Anda bisa coba semua fitur MyMenu gratis selama 7 hari. Tidak perlu kartu kredit untuk daftar. Setelah trial berakhir, Anda bisa lanjut berlangganan Rp20.000/bulan atau berhenti tanpa biaya apapun.",
                },
                {
                  q: "Bagaimana cara pembayaran setelah trial?",
                  a: "Setelah trial 7 hari, Anda bisa bayar via transfer bank, OVO, DANA, atau e-wallet lainnya. Hubungi admin via WhatsApp untuk mendapatkan instruksi pembayaran. Pembayaran per bulan, tanpa kontrak jangka panjang.",
                },
                {
                  q: "Bisakah saya punya lebih dari 1 toko?",
                  a: "Saat ini, 1 akun hanya bisa mengelola 1 toko. Ini untuk menjaga kesederhanaan dan fokus pada UMKM kecil. Jika Anda punya beberapa cabang, hubungi kami untuk solusi khusus.",
                },
                {
                  q: "Apakah bisa ganti nama atau URL toko?",
                  a: "Ya, keduanya bisa diganti kapan saja dari halaman pengaturan toko di dashboard. Perlu diingat, jika URL (slug) diganti, link dan QR code lama tidak akan berfungsi lagi — pastikan update semua tempat yang sudah memakai link tersebut.",
                },
                {
                  q: "Bagaimana cara cancel subscription?",
                  a: "Anda bisa cancel kapan saja dengan menghubungi admin via WhatsApp. Tidak ada biaya pembatalan. Menu Anda akan tetap aktif sampai akhir periode yang sudah dibayar.",
                },
                {
                  q: "Apakah data saya aman?",
                  a: "Sangat aman. Data Anda disimpan di server terenkripsi dengan backup rutin. Kami tidak pernah membagikan data Anda ke pihak ketiga. Privacy Anda adalah prioritas kami.",
                },
                {
                  q: "Berapa lama proses setup?",
                  a: "Rata-rata pengguna baru selesai setup dalam 5-8 menit. Anda hanya perlu: (1) Daftar akun, (2) Isi profil toko, (3) Tambah menu, (4) Bagikan link. Sesimpel itu!",
                },
                {
                  q: "Apakah ada biaya tambahan?",
                  a: "Tidak ada biaya tersembunyi. Rp20.000/bulan sudah termasuk semua fitur: unlimited menu, foto, QR code, custom tema, dan support. Tidak ada biaya setup atau biaya transaksi.",
                },
              ].map((item, i) => (
                <details key={i} className="group bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden hover:border-green-200 transition-all">
                  <summary className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 cursor-pointer list-none">
                    <span className="font-semibold text-gray-900 pr-3 sm:pr-4 text-sm sm:text-base">{item.q}</span>
                    <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-open:text-green-500 flex-shrink-0 transition-colors" />
                  </summary>
                  <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-1 sm:pt-2">
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{item.a}</p>
                  </div>
                </details>
              ))}
            </div>

            <div className="mt-10 sm:mt-12 text-center">
              <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4">Masih ada pertanyaan?</p>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '62895338170582'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-green-500 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Hubungi Kami via WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* --- HARGA SECTION --- */}
        <section id="harga" className="py-16 sm:py-20 lg:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <p className="inline-flex items-center gap-2 text-yellow-700 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4 bg-yellow-100 px-2.5 sm:px-3 py-1 rounded-full border border-yellow-200">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                Harga
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.15]">
                Satu harga,{" "}
                <span className="text-green-500">semua fitur</span>
              </h2>
              <p className="text-gray-500 text-sm sm:text-base lg:text-lg mt-4 sm:mt-5 leading-relaxed">
                Tanpa biaya tersembunyi. Tanpa kontrak jangka panjang.
              </p>
            </div>

            {/* Pricing Card - Compact & Centered */}
            <div className="max-w-sm mx-auto">
              <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-green-500 p-6 sm:p-8 relative">
                {/* Badge */}
                <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-green-500 text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full">
                    ⭐ Paling Populer
                  </span>
                </div>

                <div className="text-center mb-6 sm:mb-8">
                  <p className="text-xs sm:text-sm font-semibold text-gray-500 mb-1.5 sm:mb-2">Langganan Bulanan</p>
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-4xl sm:text-5xl font-extrabold text-gray-900">Rp20K</span>
                    <span className="text-gray-400 text-sm sm:text-base mb-1 sm:mb-1.5">/bulan</span>
                  </div>
                  <p className="text-xs sm:text-sm text-green-600 font-semibold mt-1.5 sm:mt-2 flex items-center justify-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Gratis 7 hari pertama
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                  {[
                    'Menu digital unlimited item',
                    'QR Code otomatis',
                    'Order via WhatsApp',
                    'Custom tema & warna',
                    'Upload foto per menu',
                    'Kategori menu',
                    'Jam operasional',
                    'Statistik pengunjung real-time',
                    'Banner & logo toko',
                    'Sosial media links',
                    'Subdomain mymenu.id/namatoko',
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-gray-700">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" strokeWidth={2.5} />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="space-y-2.5 sm:space-y-3">
                  <Link
                    href="/register"
                    className="w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 bg-green-500 text-white text-sm sm:text-base font-bold rounded-xl sm:rounded-2xl hover:bg-green-600 transition-colors"
                  >
                    <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
                    Mulai Gratis 7 Hari
                  </Link>
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '62895338170582'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 border border-gray-200 text-gray-600 text-xs sm:text-sm font-semibold rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                    Tanya via WhatsApp
                  </a>
                </div>
              </div>

              {/* Trust notes */}
              <div className="mt-5 sm:mt-6 space-y-1.5 sm:space-y-2 text-center">
                {[
                  'Tanpa kartu kredit',
                  'Batal kapan saja',
                  'Aktivasi manual oleh admin',
                ].map((note, i) => (
                  <p key={i} className="text-xs sm:text-sm text-gray-400 flex items-center justify-center gap-1.5 sm:gap-2">
                    <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-400" strokeWidth={2.5} />
                    {note}
                  </p>
                ))}
              </div>
            </div>

            {/* Comparison Table */}
            <div className="mt-12 sm:mt-16 max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl sm:rounded-2xl border-2 border-yellow-200 p-4 sm:p-6">
                <div className="flex items-center justify-center gap-2 mb-4 sm:mb-5">
                  <span className="text-lg sm:text-xl">💡</span>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Bandingkan dengan solusi lain</h4>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 border border-gray-200 text-center overflow-hidden">
                    <p className="font-bold text-gray-900 mb-1 sm:mb-1.5 text-[10px] sm:text-xs whitespace-nowrap">Menu Kertas</p>
                    <p className="text-gray-600 text-[9px] sm:text-[10px] mb-1.5 sm:mb-2 leading-tight">Cetak ulang<br className="sm:hidden" /> 3-4x/tahun</p>
                    <div className="pt-1.5 sm:pt-2 border-t border-gray-100">
                      <p className="text-red-600 font-bold text-[10px] sm:text-sm whitespace-nowrap">~Rp200K<span className="text-[8px] sm:text-[10px] font-normal">/thn</span></p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 border border-gray-200 text-center overflow-hidden">
                    <p className="font-bold text-gray-900 mb-1 sm:mb-1.5 text-[10px] sm:text-xs whitespace-nowrap">Aplikasi Kasir</p>
                    <p className="text-gray-600 text-[9px] sm:text-[10px] mb-1.5 sm:mb-2 leading-tight">Rp200K-<br className="sm:hidden" />500K/bln</p>
                    <div className="pt-1.5 sm:pt-2 border-t border-gray-100">
                      <p className="text-red-600 font-bold text-[10px] sm:text-sm whitespace-nowrap">~Rp2.4Jt<span className="text-[8px] sm:text-[10px] font-normal">/thn</span></p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-lg sm:rounded-xl p-2 sm:p-3 border-2 border-green-500 text-center relative overflow-hidden">
                    <div className="absolute -top-1 sm:-top-1.5 -right-1 sm:-right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-[9px] sm:text-[10px] font-bold">✓</span>
                    </div>
                    <p className="font-bold text-gray-900 mb-1 sm:mb-1.5 text-[10px] sm:text-xs whitespace-nowrap">MyMenu</p>
                    <p className="text-gray-700 text-[9px] sm:text-[10px] mb-1.5 sm:mb-2 leading-tight font-medium whitespace-nowrap">Rp20K/bln</p>
                    <div className="pt-1.5 sm:pt-2 border-t border-green-200">
                      <p className="text-green-600 font-bold text-[10px] sm:text-sm whitespace-nowrap">Rp240K<span className="text-[8px] sm:text-[10px] font-normal">/thn</span> ✨</p>
                    </div>
                  </div>
                </div>
                <p className="text-center text-[9px] sm:text-[10px] text-gray-600 mt-3 sm:mt-3 font-medium">
                  💰 Hemat <span className="text-green-600 font-bold">hingga Rp2.16Jt/tahun</span> vs aplikasi kasir
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* --- FINAL CTA SECTION --- */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gray-50 relative">
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="relative rounded-2xl sm:rounded-3xl bg-stone-900 overflow-hidden px-5 sm:px-8 lg:px-16 py-12 sm:py-16 lg:py-20">
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
              <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-3xl mx-auto text-center">
                {/* Social proof pill */}
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 border border-white/10 rounded-full text-stone-300 text-xs sm:text-sm mb-6 sm:mb-8">
                  <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-green-400" />
                  Dipercaya oleh UMKM Indonesia
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 sm:mb-6 tracking-tight leading-[1.15]">
                  Tinggalkan menu kertas.<br />
                  <span className="text-green-500">Mulai hari ini.</span>
                </h2>

                <p className="text-stone-400 text-sm sm:text-base lg:text-lg mb-8 sm:mb-10 leading-relaxed max-w-xl mx-auto">
                  Gratis 7 hari. Tidak perlu kartu kredit. Setup selesai sebelum kopi Anda dingin.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                  <Link
                    href="/register"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-green-500 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl hover:bg-green-600 transition-colors"
                  >
                    <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
                    Coba Gratis 7 Hari
                  </Link>
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '62895338170582'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-transparent text-stone-300 text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl border border-stone-700 hover:bg-stone-800 hover:text-white transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    Tanya via WhatsApp
                  </a>
                </div>

                <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-stone-500 text-xs sm:text-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                  <span>Gratis 7 hari · Tanpa kartu kredit · Batal kapan saja</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-14 pb-6 sm:pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 mb-10 sm:mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 sm:gap-2.5 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-green-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2.5} />
                </div>
                <span className="font-bold text-white text-lg sm:text-xl tracking-tight">MyMenu</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-stone-500 pl-10 sm:pl-11">
                Solusi menu digital untuk warung, kafe, dan restoran Indonesia. Mudah, cepat, terjangkau.
              </p>
            </div>

            {/* Produk */}
            <div>
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-stone-500 mb-3 sm:mb-4">Produk</p>
              <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
                <li><Link href="#fitur" className="hover:text-white transition-colors">Fitur</Link></li>
                <li><Link href="#harga" className="hover:text-white transition-colors">Harga</Link></li>
                <li><Link href="/demo-kedai-kopi" className="hover:text-white transition-colors">Lihat Demo</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Daftar</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Masuk</Link></li>
              </ul>
            </div>

            {/* Bantuan & Legal */}
            <div>
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-stone-500 mb-3 sm:mb-4">Bantuan & Legal</p>
              <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
                <li><Link href="/bantuan" className="hover:text-white transition-colors">Bantuan</Link></li>
                <li><Link href="/syarat" className="hover:text-white transition-colors">Syarat & Ketentuan</Link></li>
                <li><Link href="/privasi" className="hover:text-white transition-colors">Kebijakan Privasi</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-stone-800 pt-5 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
            <p className="text-[10px] sm:text-xs text-stone-600 text-center sm:text-left">&copy; {new Date().getFullYear()} MyMenu. Hak Cipta Dilindungi.</p>
            <p className="text-[10px] sm:text-xs text-stone-600 text-center sm:text-right">Dibuat dengan ❤️ untuk UMKM Indonesia</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
