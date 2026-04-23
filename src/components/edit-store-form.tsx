'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Save, AlertCircle } from 'lucide-react'
import { generateSlug } from '@/lib/utils'
import { Spinner } from '@/components/spinner'
import { checkSlugAvailable, updateStore } from '@/lib/actions/store'
import type { Tables } from '@/types/database.types'

const schema = z.object({
  name: z.string().min(1, 'Nama toko tidak boleh kosong.').max(100),
  slug: z.string().min(1, 'URL toko tidak boleh kosong.').max(60)
    .regex(/^[a-z0-9-]+$/, 'Hanya huruf kecil, angka, dan tanda hubung.'),
  description: z.string().max(500).optional(),
  whatsapp: z.string().regex(/^\d{10,15}$/, 'Nomor WhatsApp harus 10-15 digit angka.').optional().or(z.literal('')),
  address: z.string().max(300).optional(),
})

type FormValues = z.infer<typeof schema>

export function EditStoreForm({ store }: { store: Tables<'stores'> }) {
  const router = useRouter()

  const {
    register, handleSubmit, watch, setValue, setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: store.name,
      slug: store.slug,
      description: store.description ?? '',
      whatsapp: store.whatsapp ?? '',
      address: store.address ?? '',
    },
  })

  const nameValue = watch('name')
  const slugValue = watch('slug')

  // Auto-generate slug only if slug hasn't been manually changed from original
  useEffect(() => {
    if (slugValue === store.slug || slugValue === generateSlug(store.name)) {
      setValue('slug', generateSlug(nameValue), { shouldValidate: false })
    }
  }, [nameValue]) // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (values: FormValues) => {
    // Only check slug availability if it changed
    if (values.slug !== store.slug) {
      const available = await checkSlugAvailable(values.slug)
      if (!available) {
        setError('slug', { message: 'URL toko sudah digunakan. Coba nama lain.' })
        return
      }
    }

    const { error } = await updateStore({
      id: store.id,
      name: values.name.trim(),
      slug: values.slug,
      description: values.description?.trim() || null,
      whatsapp: values.whatsapp?.trim() || null,
      address: values.address?.trim() || null,
    })

    if (error) {
      setError('root', { message: error })
      return
    }

    router.push('/store')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
      {errors.root && (
        <div role="alert" className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {errors.root.message}
        </div>
      )}

      {/* Preview */}
      <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
        <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
          <span className="text-2xl font-bold text-green-500">{nameValue?.[0]?.toUpperCase() || '?'}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{nameValue || 'Nama Toko'}</p>
          <p className="text-xs text-gray-400 font-mono">mymenu.id/{slugValue || 'url-toko'}</p>
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
          Nama Toko <span className="text-red-400">*</span>
        </label>
        <input id="name" type="text" {...register('name')}
          className={`w-full px-3.5 py-3 bg-gray-50 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
          placeholder="cth. Warung Makan Bu Sari"
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-semibold text-gray-700 mb-1.5">
          URL Toko <span className="text-red-400">*</span>
        </label>
        <div className="flex">
          <span className="px-3.5 py-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-sm text-gray-400 select-none whitespace-nowrap">mymenu.id/</span>
          <input id="slug" type="text" {...register('slug')}
            className={`flex-1 px-3.5 py-3 bg-gray-50 border rounded-r-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all ${errors.slug ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
            placeholder="warung-bu-sari"
          />
        </div>
        {errors.slug
          ? <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>
          : <p className="text-xs text-gray-400 mt-1.5">Hanya huruf kecil, angka, dan tanda hubung.</p>
        }
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi</label>
        <textarea id="description" rows={3} {...register('description')}
          className="w-full px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all resize-none"
          placeholder="Ceritakan sedikit tentang toko Anda..."
        />
      </div>

      <div>
        <label htmlFor="whatsapp" className="block text-sm font-semibold text-gray-700 mb-1.5">Nomor WhatsApp</label>
        <input id="whatsapp" type="tel" {...register('whatsapp')}
          className={`w-full px-3.5 py-3 bg-gray-50 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all ${errors.whatsapp ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
          placeholder="cth. +628123456789"
        />
        {errors.whatsapp
          ? <p className="text-xs text-red-500 mt-1">{errors.whatsapp.message}</p>
          : <p className="text-xs text-gray-400 mt-1.5">Format internasional, cth: +628123456789</p>
        }
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-1.5">Alamat</label>
        <textarea id="address" rows={2} {...register('address')}
          className="w-full px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all resize-none"
          placeholder="Alamat lengkap toko Anda..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <Link href="/store" className="px-4 py-2.5 border border-gray-200 text-sm font-medium rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
          Batal
        </Link>
        <button type="submit" disabled={isSubmitting || !isDirty}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <><Spinner />Menyimpan...</> : <><Save className="w-4 h-4" />Simpan Perubahan</>}
        </button>
      </div>
    </form>
  )
}

