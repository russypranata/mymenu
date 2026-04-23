import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { StoreInfoForm } from '@/components/store-info-form'
import { StoreAppearanceForm } from '@/components/store-appearance-form'
import { StoreDeleteSection } from '@/components/store-delete-section'
import { CategoryManager } from '@/components/category-manager'
import { StoreQRCode } from '@/components/store-qr-code'
import { StoreLocationsManager } from '@/components/store-locations-manager'
import { getCategoriesByStore } from '@/lib/queries/menu'
import { getStoreLocations } from '@/lib/queries/locations'
import { Settings } from 'lucide-react'
import type { Database } from '@/types/database.types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pengaturan Toko — MyMenu',
}

type StoreSettings = Database['public']['Tables']['store_settings']['Row']

export default async function StoreSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { id } = await params

  const { data: store } = await supabase
    .from('stores').select('*').eq('id', id).eq('user_id', user.id).maybeSingle()
  if (!store) notFound()

  const [settingsResult, categories, locations] = await Promise.all([
    supabase.from('store_settings').select('*').eq('store_id', id).maybeSingle(),
    getCategoriesByStore(id),
    getStoreLocations(id),
  ])
  const settings = settingsResult.data as StoreSettings | null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Pengaturan Toko</h1>
            <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Settings className="w-4 h-4 text-green-500" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{store.name} · Kelola informasi, lokasi, tampilan, dan pengaturan lainnya</p>
        </div>
      </div>

      <section className="space-y-4">
        <SectionLabel>Informasi Dasar</SectionLabel>
        <StoreInfoForm store={store} />
      </section>

      <section className="space-y-4">
        <SectionLabel>Lokasi Toko</SectionLabel>
        <StoreLocationsManager storeId={store.id} initialLocations={locations} />
      </section>

      <section className="space-y-4">
        <SectionLabel>Kategori Menu</SectionLabel>
        <CategoryManager storeId={store.id} initialCategories={categories} />
      </section>

      <section className="space-y-4">
        <SectionLabel>Tampilan Publik</SectionLabel>
        <StoreAppearanceForm 
          storeId={store.id} 
          storeName={store.name} 
          storeSlug={store.slug}
          storeDescription={store.description}
          storeWhatsapp={store.whatsapp}
          settings={settings} 
        />
      </section>

      <section className="space-y-4">
        <SectionLabel>QR Code</SectionLabel>
        <StoreQRCode
          slug={store.slug}
          storeName={store.name}
          appUrl={process.env.NEXT_PUBLIC_APP_URL ?? 'https://mymenu.id'}
        />
      </section>

      <section className="space-y-4">
        <SectionLabel danger>Zona Berbahaya</SectionLabel>
        <StoreDeleteSection storeId={store.id} storeName={store.name} />
      </section>
    </div>
  )
}

function SectionLabel({ children, danger }: { children: React.ReactNode; danger?: boolean }) {
  return (
    <div className={`flex items-center gap-3 pb-2 border-b ${danger ? 'border-red-100' : 'border-gray-100'}`}>
      <p className={`text-xs font-bold uppercase tracking-wider ${danger ? 'text-red-400' : 'text-gray-400'}`}>
        {children}
      </p>
    </div>
  )
}
