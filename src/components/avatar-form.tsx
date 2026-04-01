'use client'

import { useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { AlertCircle, Camera, Upload } from 'lucide-react'
import { Spinner } from '@/components/spinner'
import { updateAvatar } from '@/lib/actions/profile'
import { useToast, ToastContainer } from '@/components/toast'
import { ImageCropModal } from '@/components/image-crop-modal'

interface Props {
  avatarUrl: string | null
  initial: string
}

export function AvatarForm({ avatarUrl, initial }: Props) {
  const [preview, setPreview] = useState<string | null>(avatarUrl)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const { toasts, addToast, removeToast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)

    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) { setError('File harus berupa gambar JPEG, PNG, atau WebP.'); return }
    if (file.size > 5 * 1024 * 1024) { setError('Ukuran file maksimal 5 MB.'); return }

    // Buka crop modal
    const url = URL.createObjectURL(file)
    setCropSrc(url)
    // reset input agar bisa pilih file yang sama lagi
    e.target.value = ''
  }

  const handleCropComplete = (blob: Blob) => {
    setCroppedBlob(blob)
    setPreview(URL.createObjectURL(blob))
    setCropSrc(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!croppedBlob) { setError('Pilih dan crop foto terlebih dahulu.'); return }
    setError(null)

    startTransition(async () => {
      const formData = new FormData()
      formData.append('avatar', croppedBlob, 'avatar.jpg')
      const result = await updateAvatar(formData)
      if (result.error) {
        setError(result.error)
        addToast('Gagal mengunggah foto profil.', 'error')
      } else {
        addToast('Foto profil berhasil diperbarui.')
        setCroppedBlob(null)
      }
    })
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          onComplete={handleCropComplete}
          onCancel={() => { setCropSrc(null); setCroppedBlob(null) }}
        />
      )}

      <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div>
          <h2 className="text-base font-bold text-gray-900">Foto Profil</h2>
          <p className="text-sm text-gray-500 mt-0.5">Upload foto lalu sesuaikan area crop sebelum disimpan.</p>
        </div>

        {error && (
          <div role="alert" className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
            {error}
          </div>
        )}

        <div className="flex items-center gap-5">
          {/* Avatar preview */}
          <div className="relative w-20 h-20 flex-shrink-0">
            {preview ? (
              <Image src={preview} alt="Foto profil" fill sizes="80px"
                className="rounded-full object-cover border-2 border-gray-100" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-green-100 border-2 border-gray-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-500" aria-label={`Inisial ${initial}`}>{initial}</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-2 border-white hover:bg-green-600 transition-colors"
              aria-label="Ganti foto profil"
            >
              <Camera className="w-3.5 h-3.5 text-white" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1">
            <label htmlFor="avatar-input" className="block text-sm font-semibold text-gray-700 mb-1.5">Pilih Gambar</label>
            <input
              ref={fileRef}
              id="avatar-input"
              name="avatar"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              disabled={isPending}
              className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-600 hover:file:bg-green-100 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">Maks 5 MB · Foto akan di-crop otomatis menjadi lingkaran</p>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-gray-100">
          <button
            type="submit"
            disabled={isPending || !croppedBlob}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? <><Spinner />Mengunggah...</> : <><Upload className="w-4 h-4" aria-hidden="true" />Simpan Foto</>}
          </button>
        </div>
      </form>
    </>
  )
}
