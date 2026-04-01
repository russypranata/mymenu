'use client'

import Image from 'next/image'
import { ImageIcon, X, Plus } from 'lucide-react'

export interface ImageEntry {
  id: string           // local id untuk key
  preview: string      // object URL atau URL dari server
  file: File | null    // null = sudah ada di server
}

interface Props {
  images: ImageEntry[]
  onChange: (images: ImageEntry[]) => void
  maxImages?: number
  error?: string | null
}

const MAX_SIZE = 2 * 1024 * 1024
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']

export function MenuImageUploader({ images, onChange, maxImages = 5, error }: Props) {
  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''

    const valid: ImageEntry[] = []
    for (const file of files) {
      if (!ALLOWED.includes(file.type)) continue
      if (file.size > MAX_SIZE) continue
      valid.push({ id: `${Date.now()}-${Math.random()}`, preview: URL.createObjectURL(file), file })
    }

    const next = [...images, ...valid].slice(0, maxImages)
    onChange(next)
  }

  const handleRemove = (id: string) => {
    onChange(images.filter(img => img.id !== id))
  }

  const canAdd = images.length < maxImages

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-3">
        {images.map((img, idx) => (
          <div key={img.id} className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
            <Image
              src={img.preview}
              alt={`Foto ${idx + 1}`}
              fill
              sizes="80px"
              className="object-cover"
            />
            {/* Badge utama */}
            {idx === 0 && (
              <span className="absolute bottom-0 left-0 right-0 text-center text-[10px] font-bold bg-green-500/80 text-white py-0.5">
                Utama
              </span>
            )}
            <button
              type="button"
              onClick={() => handleRemove(img.id)}
              className="absolute top-1 right-1 w-5 h-5 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Hapus foto ${idx + 1}`}
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        ))}

        {canAdd && (
          <label className="w-20 h-20 flex-shrink-0 rounded-xl border-2 border-dashed border-gray-200 hover:border-green-400 bg-gray-50 hover:bg-green-50 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors">
            <Plus className="w-5 h-5 text-gray-400" />
            <span className="text-[10px] text-gray-400 font-medium">Tambah</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleAdd}
              className="sr-only"
            />
          </label>
        )}

        {images.length === 0 && !canAdd && (
          <div className="w-20 h-20 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-gray-300" />
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400">
        {images.length}/{maxImages} foto · Foto pertama jadi gambar utama · Maks 2 MB per foto (JPEG, PNG, WebP)
      </p>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
