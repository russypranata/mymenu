import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NewStoreForm } from '@/components/new-store-form'
import { Store } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Buat Toko Baru — MyMenu',
}

export default async function NewStorePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <Store className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Buat Toko Baru</h1>
          <p className="text-sm text-gray-500 mt-0.5">Isi informasi dasar untuk memulai toko digital Anda.</p>
        </div>
      </div>
      <NewStoreForm />
    </div>
  )
}
