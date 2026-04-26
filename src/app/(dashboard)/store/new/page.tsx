import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NewStoreForm } from '@/components/new-store-form'
import { Store } from 'lucide-react'
import type { Metadata } from 'next'
import { getStoresByUser } from '@/lib/queries/store'

export const metadata: Metadata = {
  title: 'Buat Toko — Menuly',
}

export default async function NewStorePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const stores = await getStoresByUser(user.id)
  if (stores.length > 0) redirect('/store')

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Buat Toko Baru</h1>
            <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Store className="w-4 h-4 text-green-500" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">Buat halaman menu digital usaha Anda — isi nama, URL, dan nomor WhatsApp untuk mulai.</p>
        </div>
      </div>
      <NewStoreForm />
    </div>
  )
}
