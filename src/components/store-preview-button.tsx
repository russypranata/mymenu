'use client'

import { ExternalLink } from 'lucide-react'

interface StorePreviewButtonProps {
  storeSlug: string
}

export function StorePreviewButton({ storeSlug }: StorePreviewButtonProps) {
  const handleOpenPublic = () => {
    // Open in new window with mobile size
    const width = 430
    const height = 932
    const left = window.screen.width - width - 100
    const top = 100
    
    window.open(
      `/${storeSlug}`,
      'public-menu',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Preview</p>
        <p className="text-xs text-gray-400 mt-0.5">Lihat tampilan halaman menu publik Anda</p>
      </div>

      {/* Preview card */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 p-8">
        <div className="text-center space-y-4">
          {/* Text */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Lihat Halaman Menu Anda</h3>
            <p className="text-sm text-gray-600">
              Buka halaman menu publik di window baru untuk melihat tampilan yang dilihat pelanggan
            </p>
          </div>

          {/* Button */}
          <div className="pt-2">
            <button
              onClick={handleOpenPublic}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white text-sm font-bold rounded-xl hover:bg-green-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Lihat Halaman Publik
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">i</span>
          </div>
          <div className="flex-1 text-sm text-blue-900">
            <p className="font-semibold mb-1">Cara melihat perubahan:</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-800">
              <li>Klik "Lihat Halaman Publik" untuk membuka halaman menu</li>
              <li>Ubah pengaturan tampilan (warna, font, layout, dll) di halaman ini</li>
              <li>Klik "Simpan Tampilan"</li>
              <li>Muat ulang halaman publik yang sudah terbuka untuk melihat perubahan</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
