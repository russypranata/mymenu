'use client'

import { useState, useRef, useTransition, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Plus, X, ChevronUp, ChevronDown, ImageIcon, Trash2 } from 'lucide-react'
import { ImageCropModal } from '@/components/image-crop-modal'
import { useToast, ToastContainer } from '@/components/toast'
import {
  uploadGalleryPhoto,
  updateGalleryCaption,
  deleteGalleryPhoto,
  reorderGalleryPhotos,
  toggleGallery,
} from '@/lib/actions/gallery'
import type { GalleryPhoto } from '@/lib/queries/gallery'

const MAX_PHOTOS = 12

interface Props {
  storeId: string
  initialPhotos: GalleryPhoto[]
  galleryEnabled: boolean
}

export function GalleryManager({ storeId, initialPhotos, galleryEnabled: initialEnabled }: Props) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(initialPhotos)
  const [enabled, setEnabled] = useState(initialEnabled)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [isUploading, startUploadTransition] = useTransition()
  const [, startCaptionTransition] = useTransition()
  const [, startDeleteTransition] = useTransition()
  const [, startReorderTransition] = useTransition()
  const [, startToggleTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const { toasts, addToast, removeToast } = useToast()
  const router = useRouter()

  // Sync state dengan prop terbaru setelah router.refresh() re-fetch Server Component
  useEffect(() => {
    setPhotos(initialPhotos)
  }, [initialPhotos])

  useEffect(() => {
    setEnabled(initialEnabled)
  }, [initialEnabled])

  const atMax = photos.length >= MAX_PHOTOS

  // ── Toggle gallery enabled ──
  const handleToggle = () => {
    const next = !enabled
    setEnabled(next)
    startToggleTransition(async () => {
      const { error } = await toggleGallery(storeId, next)
      if (error) {
        setEnabled(!next)
        addToast(error, 'error')
      }
    })
  }

  // ── File picker → crop modal ──
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      addToast('File harus berupa gambar JPEG, PNG, atau WebP.', 'error')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      addToast('Ukuran file maksimal 5 MB.', 'error')
      return
    }
    e.target.value = ''
    setCropSrc(URL.createObjectURL(file))
  }

  // ── Setelah crop selesai → upload ──
  const handleCropComplete = (blob: Blob) => {
    setCropSrc(null)
    const fd = new FormData()
    fd.append('photo', new File([blob], 'photo.jpg', { type: 'image/jpeg' }))

    startUploadTransition(async () => {
      const { error } = await uploadGalleryPhoto(fd, storeId)
      if (error) {
        addToast(error, 'error')
      } else {
        addToast('Foto berhasil diupload.')
        router.refresh()
      }
    })
  }

  // ── Update caption (auto-save on blur) ──
  const handleCaptionBlur = (photoId: string, caption: string) => {
    startCaptionTransition(async () => {
      const { error } = await updateGalleryCaption(photoId, caption)
      if (error) addToast(error, 'error')
    })
  }

  // ── Hapus foto ──
  const handleDelete = (photo: GalleryPhoto) => {
    setDeletingId(photo.id)
  }

  const confirmDelete = (photo: GalleryPhoto) => {
    setDeletingId(null)
    setPhotos(prev => prev.filter(p => p.id !== photo.id))
    startTransition(async () => {
      const { error } = await deleteGalleryPhoto(photo.id, photo.image_url, storeId)
      if (error) {
        setPhotos(prev => [...prev, photo].sort((a, b) => a.sort_order - b.sort_order))
        addToast(error, 'error')
      } else {
        addToast('Foto dihapus.')
        router.refresh()
      }
    })
  }

  // ── Reorder ──
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newPhotos = [...photos]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newPhotos.length) return
    ;[newPhotos[index], newPhotos[targetIndex]] = [newPhotos[targetIndex], newPhotos[index]]
    const updated = newPhotos.map((p, i) => ({ ...p, sort_order: i }))
    setPhotos(updated)
    startTransition(async () => {
      const { error } = await reorderGalleryPhotos(
        storeId,
        updated.map(p => ({ id: p.id, sort_order: p.sort_order }))
      )
      if (error) {
        setPhotos(photos)
        addToast(error, 'error')
      }
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          aspect={4 / 3}
          onComplete={handleCropComplete}
          onCancel={() => setCropSrc(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">Galeri Foto</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Tampilkan suasana toko kepada pelanggan. {photos.length}/{MAX_PHOTOS} foto.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-500 hidden sm:block">
            {enabled ? 'Ditampilkan' : 'Disembunyikan'}
          </span>
          <button
            type="button"
            onClick={handleToggle}
            className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-green-500' : 'bg-gray-200'}`}
            role="switch"
            aria-checked={enabled}
            aria-label="Tampilkan galeri di halaman publik"
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/*
       * Grid foto + placeholder upload
       * Foto yang sudah ada + satu cell placeholder "klik untuk upload"
       * jika belum mencapai batas maksimum
       */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Foto yang sudah diupload */}
        {photos.map((photo, index) => (
          <div key={photo.id} className="group relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
            {/* Thumbnail */}
            <div className="relative aspect-[4/3] bg-gray-100">
              <Image
                src={photo.image_url}
                alt={photo.caption ?? `Foto ${index + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover"
              />

              {/* Overlay actions on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-start justify-between p-2 opacity-0 group-hover:opacity-100">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0 || isPending}
                    className="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center disabled:opacity-30 hover:bg-white transition-colors"
                    aria-label="Pindah ke atas"
                  >
                    <ChevronUp className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === photos.length - 1 || isPending}
                    className="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center disabled:opacity-30 hover:bg-white transition-colors"
                    aria-label="Pindah ke bawah"
                  >
                    <ChevronDown className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(photo)}
                  className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                  aria-label="Hapus foto"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>

            {/* Caption input */}
            <div className="p-2">
              <input
                type="text"
                defaultValue={photo.caption ?? ''}
                maxLength={80}
                placeholder="Tambah caption..."
                onBlur={e => handleCaptionBlur(photo.id, e.target.value)}
                className="w-full text-xs text-gray-700 placeholder-gray-400 bg-transparent border-0 outline-none focus:ring-0 p-0"
              />
            </div>

            {/* Konfirmasi hapus */}
            {deletingId === photo.id && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-3 rounded-xl">
                <p className="text-xs font-semibold text-white text-center drop-shadow">Hapus foto ini?</p>
                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => setDeletingId(null)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg text-white bg-white/15 hover:bg-white/25 transition-colors border border-white/20"
                  >
                    <X className="w-3 h-3" />
                    Batal
                  </button>
                  <button
                    onClick={() => confirmDelete(photo)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Hapus
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Placeholder upload — hanya tampil jika belum max */}
        {!atMax && (
          <button
            type="button"
            onClick={() => !isPending && fileRef.current?.click()}
            disabled={isPending}
            className="aspect-[4/3] rounded-xl border-2 border-dashed border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all flex flex-col items-center justify-center gap-2 group disabled:cursor-not-allowed"
            aria-label={isPending ? 'Mengupload foto...' : 'Upload foto baru'}
          >
            {isPending ? (
              /* Loading state — spinner + teks */
              <>
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-500 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-green-600">Mengupload...</span>
              </>
            ) : (
              /* Default state */
              <>
                <div className="w-9 h-9 rounded-xl bg-gray-100 group-hover:bg-green-100 flex items-center justify-center transition-colors">
                  <Plus className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
                </div>
                <span className="text-xs font-medium text-gray-400 group-hover:text-green-600 transition-colors">
                  Upload foto
                </span>
                <span className="text-[10px] text-gray-300">
                  {photos.length}/{MAX_PHOTOS}
                </span>
              </>
            )}
          </button>
        )}

        {/* Pesan batas tercapai */}
        {atMax && (
          <div className="aspect-[4/3] rounded-xl border border-gray-100 bg-gray-50 flex flex-col items-center justify-center gap-1">
            <ImageIcon className="w-5 h-5 text-gray-300" />
            <span className="text-[10px] text-gray-400 text-center px-2">
              Batas {MAX_PHOTOS} foto tercapai
            </span>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400">Maks 5 MB per foto · JPEG, PNG, atau WebP · Klik foto untuk edit caption</p>
    </div>
  )
}
