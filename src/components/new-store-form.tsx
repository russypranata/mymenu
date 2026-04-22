'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Store, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { generateSlug } from '@/lib/utils'
import { Spinner } from '@/components/spinner'
import { checkSlugAvailable, createStore } from '@/lib/actions/store'
import { useToast, ToastContainer } from '@/components/toast'

const schema = z.object({
  name: z.string().min(1, 'Nama toko tidak boleh kosong.').max(100),
  slug: z
    .string()
    .min(1, 'URL toko tidak boleh kosong.')
    .max(60)
    .regex(/^[a-z0-9-]+$/, 'Hanya huruf kecil, angka, dan tanda hubung.'),
  description: z.string().max(150, 'Deskripsi maksimal 150 karakter.').optional(),
  whatsapp: z
    .string()
    .regex(/^\d{10,15}$/, 'Nomor WhatsApp harus 10–15 digit angka.')
    .optional()
    .or(z.literal('')),
  address: z.string().max(300).optional(),
})

type FormValues = z.infer<typeof schema>

export function NewStoreForm() {
  const router = useRouter()
  const { toasts, addToast, removeToast } = useToast()
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', slug: '', description: '', whatsapp: '', address: '' },
  })

  const nameValue = watch('name')
  const slugValue = watch('slug')

  // Auto-generate slug from name
  useEffect(() => {
    setValue('slug', generateSlug(nameValue), { shouldValidate: false })
    setSlugStatus('idle')
  }, [nameValue, setValue])

  // Debounced real-time slug check
  const checkSlug = useCallback(async (slug: string) => {
    if (!slug || slug.length < 2) { setSlugStatus('idle'); return }
    setSlugStatus('checking')
    const available = await checkSlugAvailable(slug)
    setSlugStatus(available ? 'available' : 'taken')
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => checkSlug(slugValue), 500)
    return () => clearTimeout(timer)
  }, [slugValue, checkSlug])

  const onSubmit = async (values: FormValues) => {
    if (slugStatus === 'taken') {
      setError('slug', { message: 'URL toko sudah digunakan. Coba nama lain.' })
      return
    }
    const available = await checkSlugAvailable(values.slug)
    if (!available) {
      setError('slug', { message: 'URL toko sudah digunakan. Coba nama lain.' })
      setSlugStatus('taken')
      return
    }

    const { error } = await createStore({
      name: values.name.trim(),
      slug: values.slug,
      description: values.description?.trim() || null,
      whatsapp: values.whatsapp?.trim() || null,
      address: values.address?.trim() || null,
    })

    if (error) {
      setError('root', { message: 'Gagal membuat toko: ' + error })
      addToast('Gagal membuat toko.', 'error')
      return
    }

    addToast('Toko berhasil dibuat.')
    router.push('/store')
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {errors.root && (
        <div role="alert" className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
          {errors.root.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        {/* Preview */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
          <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center" aria-hidden="true">
            <Store className="w-7 h-7 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{nameValue || 'Nama Toko'}</p>
            <p className="text-xs text-gray-400 font-mono">mymenu.id/{slugValue || 'url-toko'}</p>
            <p className="text-xs text-gray-400 mt-0.5">Link halaman menu publik Anda</p>
          </div>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Nama Toko <span className="text-red-400" aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            type="text"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            {...register('name')}
            className={`w-full px-3.5 py-3 bg-gray-50 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all ${
              errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
            placeholder="cth. Warung Makan Bu Sari"
          />
          {errors.name && <p id="name-error" className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-semibold text-gray-700 mb-1.5">
            URL Toko <span className="text-red-400" aria-hidden="true">*</span>
          </label>
          <div className="flex">
            <span className="px-3.5 py-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-sm text-gray-400 select-none whitespace-nowrap">
              mymenu.id/
            </span>
            <div className="relative flex-1">
              <input
                id="slug"
                type="text"
                aria-invalid={!!errors.slug || slugStatus === 'taken'}
                aria-describedby={errors.slug ? 'slug-error' : 'slug-hint'}
                {...register('slug', {
                  onChange: () => setSlugStatus('idle'),
                })}
                className={`w-full px-3.5 py-3 bg-gray-50 border rounded-r-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all pr-9 ${
                  errors.slug || slugStatus === 'taken' ? 'border-red-300 bg-red-50' :
                  slugStatus === 'available' ? 'border-green-400 bg-green-50/30' :
                  'border-gray-200'
                }`}
                placeholder="warung-bu-sari"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {slugStatus === 'checking' && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
                {slugStatus === 'available' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                {slugStatus === 'taken' && <AlertCircle className="w-4 h-4 text-red-500" />}
              </div>
            </div>
          </div>
          {errors.slug
            ? <p id="slug-error" className="text-xs text-red-500 mt-1">{errors.slug.message}</p>
            : slugStatus === 'taken'
            ? <p className="text-xs text-red-500 mt-1">URL ini sudah digunakan. Coba yang lain.</p>
            : slugStatus === 'available'
            ? <p className="text-xs text-green-500 mt-1">URL tersedia.</p>
            : <p id="slug-hint" className="text-xs text-gray-400 mt-1.5">Hanya huruf kecil, angka, dan tanda hubung.</p>
          }
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi</label>
          <textarea
            id="description"
            rows={3}
            maxLength={150}
            {...register('description')}
            className="w-full px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all resize-none"
            placeholder="Ceritakan sedikit tentang toko Anda..."
          />
          <p className="text-xs text-gray-400 mt-1.5">
            Maksimal 150 karakter. Ditampilkan di halaman menu publik Anda.
          </p>
        </div>

        <div>
          <label htmlFor="whatsapp" className="block text-sm font-semibold text-gray-700 mb-1.5">Nomor WhatsApp</label>
          <input
            id="whatsapp"
            type="tel"
            aria-invalid={!!errors.whatsapp}
            aria-describedby={errors.whatsapp ? 'wa-error' : 'wa-hint'}
            {...register('whatsapp')}
            className={`w-full px-3.5 py-3 bg-gray-50 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all ${
              errors.whatsapp ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
            placeholder="cth. 628123456789"
          />
          {errors.whatsapp
            ? <p id="wa-error" className="text-xs text-red-500 mt-1">{errors.whatsapp.message}</p>
            : <p id="wa-hint" className="text-xs text-gray-400 mt-1.5">Format internasional, cth: 628123456789</p>
          }
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-1.5">Alamat</label>
          <textarea
            id="address"
            rows={2}
            {...register('address')}
            className="w-full px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all resize-none"
            placeholder="Alamat lengkap toko Anda..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <Link href="/store" className="px-4 py-2.5 border border-gray-200 text-sm font-medium rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Spinner />
                Menyimpan...
              </>
            ) : (
              <>
                <Store className="w-4 h-4" aria-hidden="true" />
                Buat Toko
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
