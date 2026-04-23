'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, AlertCircle } from 'lucide-react'
import { generateSlug } from '@/lib/utils'
import { Spinner } from '@/components/spinner'
import { checkSlugAvailable, updateStore } from '@/lib/actions/store'
import type { Tables } from '@/types/database.types'
import { useToast, ToastContainer } from '@/components/toast'

const schema = z.object({
  name: z.string().min(1, 'Nama toko tidak boleh kosong.').max(100),
  slug: z.string().min(1, 'URL toko tidak boleh kosong.').max(60)
    .regex(/^[a-z0-9-]+$/, 'Hanya huruf kecil, angka, dan tanda hubung.'),
  description: z.string().max(150, 'Deskripsi maksimal 150 karakter.').optional(),
  whatsapp: z.string().min(1, 'Nomor WhatsApp tidak boleh kosong.')
    .regex(/^\+?[0-9]{10,15}$/, 'Format nomor tidak valid. Contoh: +628123456789'),
})

type FormValues = z.infer<typeof schema>

export function StoreInfoForm({ store }: { store: Tables<'stores'> }) {
  const router = useRouter()
  const { register, handleSubmit, watch, setValue, setError, formState: { errors, isSubmitting, isDirty } } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        name: store.name, slug: store.slug,
        description: store.description ?? '',
        whatsapp: store.whatsapp ?? '',
      },
    })
  const { toasts, addToast, removeToast } = useToast()

  const nameValue = watch('name')
  const slugValue = watch('slug')

  useEffect(() => {
    if (slugValue === store.slug || slugValue === generateSlug(store.name)) {
      setValue('slug', generateSlug(nameValue), { shouldValidate: false })
    }
  }, [nameValue]) // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (values: FormValues) => {
    if (values.slug !== store.slug) {
      const available = await checkSlugAvailable(values.slug)
      if (!available) { setError('slug', { message: 'URL toko sudah digunakan.' }); return }
    }
    const { error } = await updateStore({
      id: store.id, name: values.name.trim(), slug: values.slug,
      description: values.description?.trim() || null,
      whatsapp: values.whatsapp?.trim() || null,
    })
    if (error) { setError('root', { message: error }); addToast('Gagal menyimpan informasi toko.', 'error'); return }
    addToast('Informasi toko berhasil disimpan.')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div>
        <h2 className="text-base font-bold text-gray-900">Informasi Dasar</h2>
        <p className="text-sm text-gray-500 mt-0.5">Nama toko, URL halaman publik, dan deskripsi singkat.</p>
      </div>

      {errors.root && (
        <div role="alert" className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{errors.root.message}
        </div>
      )}

      {/* Preview */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-xl font-bold text-green-500">{nameValue?.[0]?.toUpperCase() || '?'}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{nameValue || 'Nama Toko'}</p>
          <p className="text-xs text-gray-400 font-mono">mymenu.id/{slugValue || 'url-toko'}</p>
          <p className="text-xs text-gray-400 mt-0.5">Link halaman menu publik Anda</p>
        </div>
      </div>

      <div>
        <label htmlFor="si-name" className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Toko <span className="text-red-400">*</span></label>
        <input id="si-name" type="text" {...register('name')}
          className={`w-full px-3.5 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
          placeholder="cth. Warung Makan Bu Sari" />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="si-slug" className="block text-sm font-semibold text-gray-700 mb-1.5">URL Toko <span className="text-red-400">*</span></label>
        <div className="flex">
          <span className="px-3.5 py-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-sm text-gray-400 select-none whitespace-nowrap">mymenu.id/</span>
          <input id="si-slug" type="text" {...register('slug')}
            className={`flex-1 px-3.5 py-3 bg-gray-50 border rounded-r-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all ${errors.slug ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
            placeholder="warung-bu-sari" />
        </div>
        {errors.slug ? <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>
          : <p className="text-xs text-gray-400 mt-1.5">Hanya huruf kecil, angka, dan tanda hubung.</p>}
      </div>

      <div>
        <label htmlFor="si-desc" className="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi</label>
        <textarea id="si-desc" rows={3} {...register('description')}
          maxLength={150}
          className="w-full px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all resize-none"
          placeholder="Ceritakan sedikit tentang toko Anda..." />
          <p className="text-xs text-gray-400 mt-1.5">
            Maksimal 150 karakter. Ditampilkan di halaman menu publik Anda.
          </p>
      </div>

      <div>
        <label htmlFor="si-whatsapp" className="block text-sm font-semibold text-gray-700 mb-1.5">
          WhatsApp <span className="text-red-400">*</span>
        </label>
        <input id="si-whatsapp" type="tel" {...register('whatsapp')}
          className={`w-full px-3.5 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all ${errors.whatsapp ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
          placeholder="+628123456789" />
        {errors.whatsapp ? <p className="text-xs text-red-500 mt-1">{errors.whatsapp.message}</p>
          : <p className="text-xs text-gray-400 mt-1.5">
              Nomor ini digunakan untuk menerima pesanan dari pelanggan. Semua pesanan dari semua lokasi akan dikirim ke nomor ini.
            </p>}
      </div>

      <div className="flex justify-end pt-2 border-t border-gray-100">
        <button type="submit" disabled={isSubmitting || !isDirty}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
          {isSubmitting ? <><Spinner />Menyimpan...</> : <><Save className="w-4 h-4" />Simpan Informasi</>}
        </button>
      </div>
    </form>
  )
}

