'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Palette, ImageIcon, AlertCircle, Save, X, Clock, LayoutList, LayoutGrid, Type, Phone } from 'lucide-react'
import { Spinner } from '@/components/spinner'
import { uploadStoreAsset, updateStoreSettings } from '@/lib/actions/store'
import type { Tables } from '@/types/database.types'
import { useToast, ToastContainer } from '@/components/toast'
import { ImageCropModal } from '@/components/image-crop-modal'

// ── Opening Hours Picker ──
const DAYS_SHORT = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
const DAYS_FULL = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

function parseOpeningHours(val: string): { open: string; close: string } {
  const match = val.match(/(\d{2}[:.]\d{2})\s*[-–]\s*(\d{2}[:.]\d{2})/)
  if (match) {
    return {
      open: match[1].replace('.', ':'),
      close: match[2].replace('.', ':'),
    }
  }
  return { open: '08:00', close: '22:00' }
}

function OpeningHoursPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const parsed = parseOpeningHours(value)
  const [open, setOpen] = useState(parsed.open)
  const [close, setClose] = useState(parsed.close)
  const [enabled, setEnabled] = useState(!!value)

  function update(newOpen: string, newClose: string, isEnabled: boolean) {
    if (!isEnabled) { onChange(''); return }
    onChange(`${newOpen} - ${newClose}`)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => { const next = !enabled; setEnabled(next); update(open, close, next) }}
          className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${enabled ? 'bg-green-500' : 'bg-gray-200'}`}
          role="switch"
          aria-checked={enabled}
        >
          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
        <span className="text-sm text-gray-600">{enabled ? 'Aktif' : 'Tidak ditampilkan'}</span>
      </div>

      {enabled && (
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
          <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="flex items-center gap-2 flex-1">
            <input
              type="time"
              value={open}
              onChange={e => { setOpen(e.target.value); update(e.target.value, close, enabled) }}
              className="bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
            />
            <span className="text-gray-400 text-sm font-medium">–</span>
            <input
              type="time"
              value={close}
              onChange={e => { setClose(e.target.value); update(open, e.target.value, enabled) }}
              className="bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
            />
          </div>
          {value && (
            <span className="text-xs text-gray-400 font-mono">{value}</span>
          )}
        </div>
      )}
    </div>
  )
}

const THEMES = [
  { value: 'default', label: 'Default', bg: 'bg-green-500', color: '#16a34a' },
  { value: 'warm', label: 'Warm', bg: 'bg-amber-500', color: '#f59e0b' },
  { value: 'fresh', label: 'Fresh', bg: 'bg-green-500', color: '#22c55e' },
  { value: 'ocean', label: 'Ocean', bg: 'bg-blue-500', color: '#3b82f6' },
  { value: 'purple', label: 'Purple', bg: 'bg-purple-500', color: '#a855f7' },
  { value: 'rose', label: 'Rose', bg: 'bg-rose-500', color: '#f43f5e' },
  { value: 'dark', label: 'Dark', bg: 'bg-gray-800', color: '#1f2937' },
]

const FONTS = [
  { value: 'sans',     label: 'Plus Jakarta',  preview: 'font-sans',     sample: 'Aa' },
  { value: 'poppins',  label: 'Poppins',        preview: 'font-poppins',  sample: 'Aa' },
  { value: 'nunito',   label: 'Nunito',         preview: 'font-nunito',   sample: 'Aa' },
  { value: 'dm',       label: 'DM Sans',        preview: 'font-dm',       sample: 'Aa' },
  { value: 'space',    label: 'Space Grotesk',  preview: 'font-space',    sample: 'Aa' },
  { value: 'playfair', label: 'Playfair',       preview: 'font-playfair', sample: 'Aa' },
  { value: 'serif',    label: 'Serif',          preview: 'font-serif',    sample: 'Aa' },
  { value: 'mono',     label: 'Monospace',      preview: 'font-mono',     sample: 'Aa' },
]

interface Props {
  storeId: string
  storeName: string
  settings: Tables<'store_settings'> | null
}

export function StoreAppearanceForm({ storeId, storeName, settings }: Props) {
  const [logoPreview, setLogoPreview] = useState<string | null>(settings?.logo_url ?? null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(settings?.banner_url ?? null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [removeLogo, setRemoveLogo] = useState(false)
  const [removeBanner, setRemoveBanner] = useState(false)
  const [primaryColor, setPrimaryColor] = useState(settings?.primary_color ?? '#16a34a')
  const [theme, setTheme] = useState(settings?.theme ?? 'default')
  const [openingHours, setOpeningHours] = useState(settings?.opening_hours ?? '')
  const [waButtonText, setWaButtonText] = useState(settings?.whatsapp_button_text ?? 'Pesan via WhatsApp')
  const [showPrice, setShowPrice] = useState(settings?.show_price ?? true)
  const [font, setFont] = useState(settings?.font ?? 'sans')
  const [menuLayout, setMenuLayout] = useState(settings?.menu_layout ?? 'list')
  const [phone, setPhone] = useState(settings?.phone ?? '')
  const [instagram, setInstagram] = useState(settings?.instagram ?? '')
  const [facebook, setFacebook] = useState(settings?.facebook ?? '')
  const [tiktok, setTiktok] = useState(settings?.tiktok ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const { toasts, addToast, removeToast } = useToast()
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [cropType, setCropType] = useState<'logo' | 'banner' | null>(null)
  const logoRef = useRef<HTMLInputElement>(null)
  const bannerRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = e.target.files?.[0]
    if (!file) return
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) { setError('File harus JPEG, PNG, atau WebP.'); return }
    if (file.size > 5 * 1024 * 1024) { setError('Ukuran file maksimal 5 MB.'); return }
    setError(null)
    e.target.value = ''
    setCropSrc(URL.createObjectURL(file))
    setCropType(type)
  }

  const handleCropComplete = (blob: Blob) => {
    const url = URL.createObjectURL(blob)
    const file = new File([blob], `${cropType}.jpg`, { type: 'image/jpeg' })
    if (cropType === 'logo') { setLogoFile(file); setLogoPreview(url); setRemoveLogo(false) }
    else if (cropType === 'banner') { setBannerFile(file); setBannerPreview(url); setRemoveBanner(false) }
    setCropSrc(null); setCropType(null)
  }

  const handleRemove = (type: 'logo' | 'banner') => {
    if (type === 'logo') {
      setLogoPreview(null); setLogoFile(null); setRemoveLogo(true)
      if (logoRef.current) logoRef.current.value = ''
    } else {
      setBannerPreview(null); setBannerFile(null); setRemoveBanner(true)
      if (bannerRef.current) bannerRef.current.value = ''
    }
  }

  const handleThemeSelect = (t: typeof THEMES[0]) => {
    setTheme(t.value)
    setPrimaryColor(t.color)
  }

  const handleSave = async () => {
    setError(null); setIsPending(true)

    let logoUrl = removeLogo ? null : (settings?.logo_url ?? null)
    let bannerUrl = removeBanner ? null : (settings?.banner_url ?? null)

    if (logoFile) {
      const fd = new FormData(); fd.append('logo', logoFile)
      const { url, error } = await uploadStoreAsset(fd, 'logo')
      if (error) { setError('Gagal upload logo: ' + error); setIsPending(false); return }
      logoUrl = url
    }
    if (bannerFile) {
      const fd = new FormData(); fd.append('banner', bannerFile)
      const { url, error } = await uploadStoreAsset(fd, 'banner')
      if (error) { setError('Gagal upload banner: ' + error); setIsPending(false); return }
      bannerUrl = url
    }

    const { error } = await updateStoreSettings({
      storeId, logoUrl, bannerUrl, primaryColor, theme,
      openingHours: openingHours.trim() || null,
      whatsappButtonText: waButtonText.trim() || 'Pesan via WhatsApp',
      showPrice, font, menuLayout,
      phone: phone.trim() || null,
      instagram: instagram.trim() || null,
      facebook: facebook.trim() || null,
      tiktok: tiktok.trim() || null,
    })
    setIsPending(false)
    if (error) { setError(error); addToast('Gagal menyimpan tampilan toko.', 'error'); return }
    addToast('Tampilan toko berhasil disimpan.')
    setLogoFile(null); setBannerFile(null)
    setRemoveLogo(false); setRemoveBanner(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {cropSrc && cropType && (
        <ImageCropModal
          imageSrc={cropSrc}
          aspect={cropType === 'banner' ? 3 / 1 : 1}
          onComplete={handleCropComplete}
          onCancel={() => { setCropSrc(null); setCropType(null) }}
        />
      )}
      <div>
        <h2 className="text-base font-bold text-gray-900">Tampilan Publik</h2>
        <p className="text-sm text-gray-500 mt-0.5">Kustomisasi tampilan halaman menu Anda.</p>
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{error}
        </div>
      )}

      {/* Live preview */}
      <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 pt-3 pb-2">Preview</p>
        <div className="h-24 relative" style={{ backgroundColor: primaryColor }}>
          {bannerPreview && (
            <Image src={bannerPreview} alt="Banner preview" fill sizes="(max-width: 640px) 100vw, 672px" className="object-cover" quality={90} />
          )}
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
            <div className="relative w-16 h-16 rounded-xl bg-white border border-gray-100 shadow flex items-center justify-center overflow-hidden">
              {logoPreview
                ? <Image src={logoPreview} alt="Logo preview" fill sizes="64px" className="object-cover" quality={90} />
                : <span className="text-xl font-bold text-gray-400">{storeName?.[0]?.toUpperCase()}</span>}
            </div>
          </div>
        </div>
        <div className="bg-gray-50 pt-10 pb-4 text-center">
          <p className={`text-sm font-bold text-gray-800 ${font === 'serif' ? 'font-serif' : font === 'mono' ? 'font-mono' : 'font-sans'}`}>{storeName}</p>
          <div className="mt-1 flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
            <span className="text-xs text-gray-400 capitalize">{theme} · {font} · {menuLayout}</span>
          </div>
        </div>
      </div>

      {/* Logo */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">Logo Toko</p>
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
            {logoPreview
              ? <Image src={logoPreview} alt="Logo" fill sizes="64px" className="object-cover" quality={90} />
              : <ImageIcon className="w-5 h-5 text-gray-300" />}
          </div>
          <div className="flex-1 space-y-1.5">
            <input ref={logoRef} type="file" accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleFile(e, 'logo')}
              className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-600 hover:file:bg-green-100 cursor-pointer" />
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">Maks 5 MB. Disarankan rasio 1:1.</p>
              {logoPreview && (
                <button type="button" onClick={() => handleRemove('logo')}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors">
                  <X className="w-3 h-3" />Hapus logo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">Banner Toko</p>
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-14 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
            {bannerPreview
              ? <Image src={bannerPreview} alt="Banner" fill sizes="96px" className="object-cover" />
              : <ImageIcon className="w-5 h-5 text-gray-300" />}
          </div>
          <div className="flex-1 space-y-1.5">
            <input ref={bannerRef} type="file" accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleFile(e, 'banner')}
              className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-600 hover:file:bg-green-100 cursor-pointer" />
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">Maks 5 MB. Disarankan rasio 3:1.</p>
              {bannerPreview && (
                <button type="button" onClick={() => handleRemove('banner')}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors">
                  <X className="w-3 h-3" />Hapus banner
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Theme presets */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">Tema Preset</p>
        <div className="flex gap-2 flex-wrap">
          {THEMES.map(t => (
            <button key={t.value} type="button" onClick={() => handleThemeSelect(t)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                theme === t.value ? 'border-green-400 bg-green-50 text-green-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}>
              <span className={`w-4 h-4 rounded-full flex-shrink-0 ${t.bg}`} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom color */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">Warna Kustom</p>
        <div className="flex items-center gap-3">
          <input type="color" value={primaryColor}
            onChange={(e) => { setPrimaryColor(e.target.value); setTheme('custom') }}
            className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-0.5 bg-white" />
          <div className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl flex-1">
            <Palette className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-mono text-gray-700">{primaryColor}</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1.5">Pilih warna kustom akan mengganti tema preset.</p>
      </div>

      {/* Font */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
          <Type className="w-4 h-4 text-gray-400" />Font
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FONTS.map(f => (
            <button key={f.value} type="button" onClick={() => setFont(f.value)}
              className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl border text-sm transition-all ${
                font === f.value ? 'border-green-400 bg-green-50 text-green-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}>
              <span className={`text-2xl font-bold leading-none ${f.preview}`}>{f.sample}</span>
              <span className="text-xs font-medium">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Menu layout */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">Tata Letak Menu</p>
        <div className="flex gap-3">
          <button type="button" onClick={() => setMenuLayout('list')}
            className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
              menuLayout === 'list' ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
            <LayoutList className={`w-6 h-6 ${menuLayout === 'list' ? 'text-green-500' : 'text-gray-400'}`} />
            <span className={`text-xs font-semibold ${menuLayout === 'list' ? 'text-green-600' : 'text-gray-500'}`}>List</span>
            <span className="text-xs text-gray-400">Baris horizontal</span>
          </button>
          <button type="button" onClick={() => setMenuLayout('grid')}
            className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
              menuLayout === 'grid' ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
            <LayoutGrid className={`w-6 h-6 ${menuLayout === 'grid' ? 'text-green-500' : 'text-gray-400'}`} />
            <span className={`text-xs font-semibold ${menuLayout === 'grid' ? 'text-green-600' : 'text-gray-500'}`}>Grid</span>
            <span className="text-xs text-gray-400">2 kolom dengan gambar</span>
          </button>
        </div>
      </div>

      {/* Show price toggle */}
      <div className="flex items-center justify-between py-3 border-t border-gray-100">
        <div>
          <p className="text-sm font-semibold text-gray-700">Tampilkan Harga</p>
          <p className="text-xs text-gray-400 mt-0.5">Nonaktifkan untuk menyembunyikan harga dari pelanggan</p>
        </div>
        <button type="button" onClick={() => setShowPrice(v => !v)}
          className={`relative w-11 h-6 rounded-full transition-colors ${showPrice ? 'bg-green-500' : 'bg-gray-200'}`}
          role="switch" aria-checked={showPrice}>
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${showPrice ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
      </div>

      {/* Opening hours */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-gray-400" />Jam Operasional
        </label>
        <OpeningHoursPicker value={openingHours} onChange={setOpeningHours} />
        <p className="text-xs text-gray-400 mt-1.5">Ditampilkan di bawah nama toko pada halaman publik.</p>
      </div>

      {/* WA button text */}
      <div>
        <label htmlFor="wa-btn-text" className="block text-sm font-semibold text-gray-700 mb-2">Teks Tombol WhatsApp</label>
        <input id="wa-btn-text" type="text" value={waButtonText}
          onChange={(e) => setWaButtonText(e.target.value)}
          maxLength={40}
          className="w-full px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all"
          placeholder="Pesan via WhatsApp" />
        <p className="text-xs text-gray-400 mt-1.5">{waButtonText.length}/40 karakter</p>
      </div>

      {/* ── Kontak & Sosial Media ── */}
      <div className="pt-2 border-t border-gray-100 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-0.5">Kontak & Sosial Media</h3>
          <p className="text-xs text-gray-400">Ditampilkan di footer halaman menu publik.</p>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="sa-phone" className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-gray-400" />Nomor Telepon
          </label>
          <input id="sa-phone" type="tel" value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all"
            placeholder="cth. 08123456789" />
          <p className="text-xs text-gray-400 mt-1">Nomor yang bisa dihubungi pelanggan (bukan untuk order).</p>
        </div>

        {/* Instagram */}
        <div>
          <label htmlFor="sa-ig" className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            Instagram
          </label>
          <div className="flex">
            <span className="px-3.5 py-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-sm text-gray-400 select-none">@</span>
            <input id="sa-ig" type="text" value={instagram}
              onChange={e => setInstagram(e.target.value.replace(/^@/, ''))}
              className="flex-1 px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-r-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all"
              placeholder="namatoko" />
          </div>
        </div>

        {/* Facebook */}
        <div>
          <label htmlFor="sa-fb" className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Facebook
          </label>
          <div className="flex">
            <span className="px-3.5 py-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-sm text-gray-400 select-none whitespace-nowrap">fb.com/</span>
            <input id="sa-fb" type="text" value={facebook}
              onChange={e => setFacebook(e.target.value)}
              className="flex-1 px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-r-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all"
              placeholder="namatoko" />
          </div>
        </div>

        {/* TikTok */}
        <div>
          <label htmlFor="sa-tt" className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg>
            TikTok
          </label>
          <div className="flex">
            <span className="px-3.5 py-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-sm text-gray-400 select-none">@</span>
            <input id="sa-tt" type="text" value={tiktok}
              onChange={e => setTiktok(e.target.value.replace(/^@/, ''))}
              className="flex-1 px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-r-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all"
              placeholder="namatoko" />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2 border-t border-gray-100">        <button type="button" onClick={handleSave} disabled={isPending}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
          {isPending ? <><Spinner />Menyimpan...</> : <><Save className="w-4 h-4" />Simpan Tampilan</>}
        </button>
      </div>
    </div>
  )
}
