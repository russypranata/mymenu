'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Save, AlertCircle, Tag } from 'lucide-react'
import { Spinner } from '@/components/spinner'
import { updateMenu, uploadMenuImage } from '@/lib/actions/menu'
import type { Tables, Database } from '@/types/database.types'
import { useToast, ToastContainer } from '@/components/toast'
import { MenuImageUploader, type ImageEntry } from '@/components/menu-image-uploader'
import { SelectDropdown } from '@/components/select-dropdown'

type Category = Database['public']['Tables']['categories']['Row']

const schema = z.object({
  name: z.string().min(1, 'Nama menu tidak boleh kosong.').max(100),
  price: z.string().min(1, 'Harga tidak boleh kosong.').refine(
    (v) => !isNaN(Number(v)) && Number(v) >= 0,
    'Masukkan harga yang valid.'
  ),
  description: z.string().max(500).optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  menu: Tables<'menus'>
  storeId: string
  backHref: string
  categories?: Category[]
}

function buildInitialImages(menu: Tables<'menus'>): ImageEntry[] {
  const entries: ImageEntry[] = []
  if (menu.image_url) {
    entries.push({ id: 'main', preview: menu.image_url, file: null })
  }
  for (const url of menu.extra_images ?? []) {
    entries.push({ id: `extra-${url}`, preview: url, file: null })
  }
  return entries
}

export function EditMenuForm({ menu, storeId, backHref, categories = [] }: Props) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [images, setImages] = useState<ImageEntry[]>(() => buildInitialImages(menu))
  const [categoryId, setCategoryId] = useState<string>(menu.category_id ?? '')
  const { toasts, addToast, removeToast } = useToast()

  const {
    register, handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: menu.name,
      price: String(menu.price),
      description: menu.description ?? '',
    },
  })

  const imagesChanged = (() => {
    const original = buildInitialImages(menu)
    if (original.length !== images.length) return true
    return images.some((img, i) => img.preview !== original[i]?.preview)
  })()

  const categoryChanged = categoryId !== (menu.category_id ?? '')

  const onSubmit = async (values: FormValues) => {
    setServerError(null)

    const uploadedUrls: string[] = []
    for (const img of images) {
      if (!img.file) { uploadedUrls.push(img.preview); continue }
      const fd = new FormData()
      fd.append('image', img.file)
      const { url, error } = await uploadMenuImage(fd)
      if (error) { setServerError('Gagal upload foto: ' + error); addToast('Gagal upload foto.', 'error'); return }
      if (url) uploadedUrls.push(url)
    }

    const [imageUrl, ...extraImages] = uploadedUrls

    const { error } = await updateMenu({
      id: menu.id,
      name: values.name.trim(),
      description: values.description?.trim() || null,
      price: Number(values.price),
      imageUrl: imageUrl ?? null,
      extraImages,
      categoryId: categoryId || null,
    })

    if (error) { setServerError(error); addToast('Gagal menyimpan perubahan menu.', 'error'); return }
    addToast('Menu berhasil diperbarui.')
    router.push(backHref)
    router.refresh()
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        {serverError && (
          <div role="alert" className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {serverError}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Nama Menu <span className="text-red-400">*</span>
          </label>
          <input id="name" type="text" autoComplete="off" {...register('name')}
            className={`w-full px-3.5 py-3 bg-gray-50 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
            placeholder="cth. Nasi Goreng Special"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Harga (Rp) <span className="text-red-400">*</span>
          </label>
          <input id="price" type="number" min="0" step="500" {...register('price')}
            className={`w-full px-3.5 py-3 bg-gray-50 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all ${errors.price ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
            placeholder="cth. 25000"
          />
          {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi</label>
          <textarea id="description" rows={3} {...register('description')}
            className="w-full px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all resize-none"
            placeholder="Deskripsikan menu ini..."
          />
        </div>

        {categories.length > 0 && (
          <div>
            <label htmlFor="edit-category" className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-gray-400" />
              Kategori
            </label>
            <SelectDropdown
              id="edit-category"
              value={categoryId}
              onChange={setCategoryId}
              placeholder="— Tanpa kategori —"
              options={[
                { value: '', label: '— Tanpa kategori —' },
                ...categories.map(cat => ({ value: cat.id, label: cat.name })),
              ]}
            />
          </div>
        )}

        <div>
          <p className="block text-sm font-semibold text-gray-700 mb-2">Foto Menu</p>
          <MenuImageUploader images={images} onChange={setImages} />
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <Link href={backHref} className="px-4 py-2.5 border border-gray-200 text-sm font-medium rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
            Batal
          </Link>
          <button type="submit" disabled={isSubmitting || (!isDirty && !imagesChanged && !categoryChanged)}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <><Spinner />Menyimpan...</> : <><Save className="w-4 h-4" />Simpan Perubahan</>}
          </button>
        </div>
      </form>
    </>
  )
}
