'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Palette, ImageIcon, AlertCircle, Save, X, Clock, LayoutList, LayoutGrid, Type } from 'lucide-react'
import { Spinner } from '@/components/spinner'
import { uploadStoreAsset, updateStoreSettings } from '@/lib/actions/store'
import type { Tables } from '@/types/database.types'
import { useToast, ToastContainer } from '@/components/toast'
import { ImageCropModal } from '@/components/image-crop-modal'

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
  { value: 'sans', label: 'Modern', preview: 'font-sans' },
  { value: 'serif', label: 'Klasik', preview: 'font-serif' },
  { value: 'mono', label: 'Teknis', preview: 'font-mono' },
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
        <div className="flex gap-2 flex-wrap">
          {FONTS.map(f => (
            <button key={f.value} type="button" onClick={() => setFont(f.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all ${
                font === f.value ? 'border-green-400 bg-green-50 text-green-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}>
              <span className={f.preview}>{f.label}</span>
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
        <label htmlFor="opening-hours" className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-gray-400" />Jam Operasional
        </label>
        <input id="opening-hours" type="text" value={openingHours}
          onChange={(e) => setOpeningHours(e.target.value)}
          className="w-full px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all"
          placeholder="cth. Senin–Sabtu, 08.00–21.00" />
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

      <div className="flex justify-end pt-2 border-t border-gray-100">
        <button type="button" onClick={handleSave} disabled={isPending}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
          {isPending ? <><Spinner />Menyimpan...</> : <><Save className="w-4 h-4" />Simpan Tampilan</>}
        </button>
      </div>
    </div>
  )
}
