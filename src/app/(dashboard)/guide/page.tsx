import Link from 'next/link'
import type { Metadata } from 'next'
import {
  Store,
  UtensilsCrossed,
  ExternalLink,
  Settings,
  UserCircle,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Palette,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
  BookOpen,
  Tag,
  Images,
  Zap,
  QrCode,
  Link2,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Panduan — MyMenu',
}

export default function GuidePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Panduan Penggunaan</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Pelajari cara mengelola halaman menu digital Anda di MyMenu — dari setup awal sampai siap dibagikan ke pelanggan.
          </p>
        </div>
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {[
          { href: '#toko', icon: Store, label: 'Toko', color: 'bg-green-50 text-green-500' },
          { href: '#menu', icon: UtensilsCrossed, label: 'Menu', color: 'bg-amber-50 text-amber-500' },
          { href: '#kategori', icon: Tag, label: 'Kategori', color: 'bg-green-50 text-green-500' },
          { href: '#tampilan', icon: Palette, label: 'Tampilan', color: 'bg-purple-50 text-purple-500' },
          { href: '#bagikan', icon: QrCode, label: 'Bagikan', color: 'bg-blue-50 text-blue-500' },
          { href: '#akun', icon: UserCircle, label: 'Akun', color: 'bg-gray-50 text-gray-500' },
        ].map(({ href, icon: Icon, label, color }) => (
          <a
            key={href}
            href={href}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-sm transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-gray-600 group-hover:text-green-500 transition-colors">{label}</span>
          </a>
        ))}
      </div>

      {/* Tip banner */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
        <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          <span className="font-semibold">Tips:</span> Mulai dengan membuat toko (halaman menu digital Anda), buat kategori menu, lalu tambahkan item menu. Setelah itu bagikan link atau QR code ke pelanggan.
        </p>
      </div>

      {/* ── SECTION 1: TOKO ── */}
      <section id="toko" className="space-y-4 scroll-mt-20">
        <SectionHeader icon={Store} color="bg-green-500" number="01" title="Kelola Toko" />

        <StepCard
          step={1}
          title="Buat toko baru"
          description="Toko di MyMenu adalah halaman menu digital usaha Anda yang bisa dibagikan via link atau QR code. Klik tombol Buat Toko, lalu isi nama, URL, deskripsi, nomor WhatsApp, dan alamat."
          action={{ label: 'Buat Toko', href: '/store/new' }}
          tips={[
            'URL toko otomatis dibuat dari nama — bisa kamu ubah sendiri.',
            'URL hanya boleh huruf kecil, angka, dan tanda hubung (-). Contoh: warung-bu-sari',
            'URL ini yang akan dibagikan ke pelanggan: mymenu.id/nama-toko-kamu',
            'Nomor WhatsApp dipakai untuk tombol hubungi di halaman publik. Format: +628xxxxxxxxx',
          ]}
          icon={<Plus className="w-4 h-4" />}
        />

        <StepCard
          step={2}
          title="Edit informasi toko"
          description="Masuk ke Pengaturan Toko (ikon ⚙️ di daftar toko) untuk mengubah nama, URL halaman publik, deskripsi, WhatsApp, atau alamat kapan saja."
          tips={[
            'Jika kamu ubah URL, link lama tidak akan berfungsi lagi — update semua tempat yang sudah memakai link tersebut.',
            'Pastikan nomor WhatsApp dalam format internasional: +628xxxxxxxxx',
          ]}
          icon={<Pencil className="w-4 h-4" />}
        />

        <StepCard
          step={3}
          title="Hapus toko"
          description="Di halaman Toko, klik ikon hapus (🗑️) di samping toko yang ingin dihapus. Konfirmasi dengan mengetik nama toko."
          tips={['Menghapus toko akan menghapus semua menu, kategori, dan halaman publik secara permanen. Link yang sudah dibagikan tidak akan bisa diakses lagi.']}
          icon={<Trash2 className="w-4 h-4" />}
          danger
        />
      </section>

      {/* ── SECTION 2: MENU ── */}
      <section id="menu" className="space-y-4 scroll-mt-20">
        <SectionHeader icon={UtensilsCrossed} color="bg-amber-500" number="02" title="Kelola Menu" />

        <StepCard
          step={1}
          title="Tambah item menu"
          description="Buka toko lewat sidebar Menu, lalu klik Tambah Menu. Isi nama, harga, deskripsi, pilih kategori, dan upload foto."
          tips={[
            'Bisa upload hingga 5 foto per item menu — foto pertama jadi gambar utama.',
            'Foto menu maksimal 2 MB per file (JPEG, PNG, atau WebP).',
            'Deskripsi opsional, tapi membantu pelanggan memilih.',
            'Harga diisi dalam Rupiah tanpa titik atau koma — contoh: 25000',
          ]}
          icon={<Plus className="w-4 h-4" />}
        />

        <StepCard
          step={2}
          title="Multi-foto per menu"
          description="Saat tambah atau edit menu, klik area Tambah di uploader foto untuk menambahkan lebih dari 1 gambar. Foto pertama tampil sebagai gambar utama, foto lainnya bisa dilihat di galeri saat pelanggan membuka detail menu."
          tips={[
            'Klik tanda × di pojok foto untuk menghapus foto tertentu.',
            'Urutan foto bisa diatur — foto paling kiri jadi gambar utama.',
          ]}
          icon={<Images className="w-4 h-4" />}
        />

        <StepCard
          step={3}
          title="Edit item menu"
          description="Di halaman daftar menu toko, klik ikon edit (✏️) pada item yang ingin diubah. Kamu bisa ubah nama, harga, deskripsi, kategori, dan foto."
          tips={['Tombol simpan hanya aktif jika ada perubahan.']}
          icon={<Pencil className="w-4 h-4" />}
        />

        <StepCard
          step={4}
          title="Aktif / Nonaktif menu"
          description="Klik ikon toggle di daftar menu untuk mengaktifkan atau menonaktifkan item. Item nonaktif tidak ditampilkan ke pelanggan."
          tips={['Gunakan filter Status di atas daftar untuk melihat item berdasarkan statusnya.']}
          icon={<Eye className="w-4 h-4" />}
        />

        <StepCard
          step={5}
          title="Hapus item menu"
          description="Klik ikon hapus (🗑️) pada item menu, lalu konfirmasi penghapusan. Tindakan ini tidak bisa dibatalkan."
          icon={<Trash2 className="w-4 h-4" />}
          danger
        />
      </section>

      {/* ── SECTION 3: KATEGORI ── */}
      <section id="kategori" className="space-y-4 scroll-mt-20">
        <SectionHeader icon={Tag} color="bg-green-500" number="03" title="Kelola Kategori" />

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Kategori membantu mengelompokkan menu berdasarkan jenis — misalnya <span className="font-semibold text-gray-800">Makanan</span>, <span className="font-semibold text-gray-800">Minuman</span>, <span className="font-semibold text-gray-800">Dessert</span>. Pelanggan bisa filter menu berdasarkan kategori di halaman publik.
          </p>

          <div className="space-y-3">
            {[
              { title: 'Buat kategori', desc: 'Buka Pengaturan Toko (ikon ⚙️ di daftar toko), lalu scroll ke bagian Kategori Menu. Ketik nama kategori lalu klik Tambah atau tekan Enter.' },
              { title: 'Edit nama kategori', desc: 'Klik ikon pensil (✏️) di samping kategori, ubah nama, lalu klik ✓ untuk menyimpan atau Esc untuk batal.' },
              { title: 'Hapus kategori', desc: 'Klik ikon hapus (🗑️) di samping kategori. Menu yang sudah pakai kategori ini tidak ikut terhapus, hanya kategorinya yang dihapus.' },
              { title: 'Assign kategori ke menu', desc: 'Saat tambah atau edit menu, pilih kategori dari dropdown Kategori. Pilih "Tanpa kategori" jika tidak ingin dikategorikan.' },
            ].map(({ title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm font-semibold text-gray-800">{title}</span>
                  <span className="text-sm text-gray-500"> — {desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: TAMPILAN ── */}
      <section id="tampilan" className="space-y-4 scroll-mt-20">
        <SectionHeader icon={Palette} color="bg-purple-500" number="04" title="Kustomisasi Tampilan" />

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <p className="text-sm text-gray-600">
            Buka <span className="font-semibold text-gray-800">Pengaturan Toko → Tampilan Publik</span> untuk mengubah tampilan halaman menu yang dilihat pelanggan.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: 'Logo & Banner', desc: 'Upload logo (rasio 1:1) dan banner (rasio 3:1) toko. Maks 3 MB per file.' },
              { title: 'Tema & Warna', desc: 'Pilih dari preset tema atau tentukan warna kustom sendiri menggunakan color picker.' },
              { title: 'Font', desc: 'Pilih gaya font: Modern (sans-serif), Klasik (serif), atau Teknis (monospace).' },
              { title: 'Tata Letak Menu', desc: 'List: tampilan baris horizontal. Grid: 2 kolom dengan gambar lebih besar.' },
              { title: 'Jam Operasional', desc: 'Format: HH:MM - HH:MM, contoh: 08:00 - 22:00. Badge "Buka/Tutup" otomatis menyesuaikan jam saat ini.' },
              { title: 'Tombol WhatsApp', desc: 'Ubah teks tombol pesan WhatsApp. Maks 40 karakter.' },
            ].map(({ title, desc }) => (
              <div key={title} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: BAGIKAN ── */}
      <section id="bagikan" className="space-y-4 scroll-mt-20">
        <SectionHeader icon={QrCode} color="bg-blue-500" number="05" title="Bagikan ke Pelanggan" />

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Setiap toko punya link publik yang bisa langsung dibuka pelanggan tanpa perlu login atau install apapun.
          </p>

          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
            <span className="text-sm font-mono text-gray-500">mymenu.id/</span>
            <span className="text-sm font-mono font-semibold text-green-500">nama-toko-kamu</span>
          </div>

          <div className="space-y-3">
            {[
              { icon: ExternalLink, text: 'Klik ikon 🔗 di daftar toko untuk membuka halaman publik di tab baru.' },
              { icon: QrCode, text: 'Klik ikon QR di daftar toko untuk generate QR code — bisa diunduh dan dicetak untuk ditempel di meja.' },
              { icon: Link2, text: 'Klik ikon salin (📋) untuk menyalin link toko langsung ke clipboard.' },
              { icon: ChevronRight, text: 'Bagikan link via WhatsApp, Instagram bio, atau cetak sebagai QR code di struk.' },
              { icon: ChevronRight, text: 'Pelanggan bisa filter menu berdasarkan kategori langsung di halaman publik.' },
              { icon: ChevronRight, text: 'Pelanggan bisa klik item menu untuk melihat detail dan galeri foto.' },
              { icon: ChevronRight, text: 'Tombol WhatsApp di halaman publik langsung mengarah ke chat dengan toko.' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-2.5 text-sm text-gray-600">
                <Icon className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: LANGGANAN ── */}
      <section className="space-y-4 scroll-mt-20">
        <SectionHeader icon={Zap} color="bg-amber-500" number="06" title="Langganan" />

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <p className="text-sm text-gray-600">
            MyMenu menggunakan sistem langganan berbayar. Akun baru mendapat masa trial gratis selama <span className="font-semibold text-gray-800">7 hari</span>.
          </p>

          <div className="space-y-3">
            {[
              { status: 'Trial', color: 'bg-green-100 text-green-700', desc: 'Akun baru otomatis mendapat trial 7 hari. Semua fitur bisa digunakan penuh.' },
              { status: 'Aktif', color: 'bg-blue-100 text-blue-700', desc: 'Langganan aktif setelah admin mengaktifkan akun Anda. Semua fitur tersedia.' },
              { status: 'Expired', color: 'bg-red-100 text-red-700', desc: 'Langganan habis. Toko dan menu masih tersimpan, tapi tidak bisa menambah atau mengedit menu.' },
            ].map(({ status, color, desc }) => (
              <div key={status} className="flex items-start gap-3">
                <span className={`text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0 mt-0.5 ${color}`}>{status}</span>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <Zap className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              Untuk mengaktifkan atau memperpanjang langganan, hubungi admin via WhatsApp. Biaya langganan <span className="font-semibold">Rp20.000/bulan</span>.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: AKUN ── */}
      <section id="akun" className="space-y-4 scroll-mt-20">
        <SectionHeader icon={UserCircle} color="bg-gray-600" number="07" title="Pengaturan Akun" />

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Buka halaman <Link href="/profile" className="font-semibold text-green-500 hover:underline">Akun</Link> untuk mengelola profil dan keamanan akun Anda.
          </p>

          <div className="space-y-3">
            {[
              { title: 'Foto Profil', desc: 'Upload foto avatar. Maks 2 MB (JPEG, PNG, WebP). Foto ditampilkan di header dashboard.' },
              { title: 'Nama Tampilan', desc: 'Nama yang muncul di header dashboard.' },
              { title: 'Ganti Email', desc: 'Ubah alamat email login. Link konfirmasi dikirim ke email baru — klik link tersebut untuk menyelesaikan perubahan.' },
              { title: 'Ganti Password', desc: 'Masukkan password baru minimal 8 karakter.' },
              { title: 'Hapus Akun', desc: 'Menghapus akun secara permanen beserta semua toko, kategori, menu, dan data terkait. Konfirmasi dengan mengetik email akun.' },
            ].map(({ title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0 mt-2" />
                <div>
                  <span className="text-sm font-semibold text-gray-800">{title}</span>
                  <span className="text-sm text-gray-500"> — {desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
        <p className="text-lg font-extrabold mb-1">Siap mulai?</p>
        <p className="text-sm text-green-100 mb-4">Buat toko pertama Anda dan mulai kelola menu digital sekarang.</p>
        <Link
          href="/store/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-green-500 text-sm font-bold rounded-xl hover:bg-green-50 transition-colors"
        >
          <Store className="w-4 h-4" />
          Buat Toko Sekarang
        </Link>
      </div>
    </div>
  )
}

function SectionHeader({
  icon: Icon,
  color,
  number,
  title,
}: {
  icon: React.ElementType
  color: string
  number: string
  title: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-xs font-bold text-gray-300 tracking-widest">{number}</span>
        <h2 className="text-lg font-extrabold text-gray-900">{title}</h2>
      </div>
    </div>
  )
}

function StepCard({
  step,
  title,
  description,
  tips,
  action,
  icon,
  danger,
}: {
  step: number
  title: string
  description: string
  tips?: string[]
  action?: { label: string; href: string }
  icon?: React.ReactNode
  danger?: boolean
}) {
  return (
    <div className={`bg-white rounded-2xl border p-5 space-y-3 ${danger ? 'border-red-100' : 'border-gray-100'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${danger ? 'bg-red-50 text-red-400' : 'bg-green-50 text-green-500'}`}>
            {step}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{title}</p>
            <p className="text-sm text-gray-500 mt-0.5">{description}</p>
          </div>
        </div>
        {action && (
          <Link
            href={action.href}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition-colors flex-shrink-0"
          >
            {icon}
            {action.label}
          </Link>
        )}
      </div>

      {tips && tips.length > 0 && (
        <ul className="space-y-1.5 pl-10">
          {tips.map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-xs text-gray-500">
              <span className="text-green-300 flex-shrink-0 mt-0.5">•</span>
              {tip}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

