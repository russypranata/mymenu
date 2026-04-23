import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getStoreBySlug } from '@/lib/queries/store'
import { getActiveMenusByStore, getCategoriesByStore } from '@/lib/queries/menu'
import { getStoreLocations } from '@/lib/queries/locations'
import { PublicMenuList } from '@/components/public-menu-list'
import { CartProvider } from '@/components/cart-provider'
import { PublicMenuCart } from '@/components/public-menu-cart'
import { PublicMenuFooter } from '@/components/public-menu-footer'
import { PageViewTracker } from '@/components/page-view-tracker'
import { PublicNavbar } from '@/components/public-navbar'

export const revalidate = 60

export async function generateStaticParams() {
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await supabase.from('stores').select('slug')
  return (data ?? []).map(({ slug }: { slug: string }) => ({ slug }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const store = await getStoreBySlug(slug)
  if (!store) return {}
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  return {
    title: `${store.name} — Menu Digital`,
    description: store.description ?? `Lihat menu digital ${store.name}`,
    openGraph: {
      title: store.name,
      description: store.description ?? `Menu digital ${store.name}`,
      url: `${appUrl}/${slug}`,
      siteName: 'MyMenu',
      images: store.store_settings?.banner_url
        ? [{ url: store.store_settings.banner_url, width: 1200, height: 630 }]
        : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: store.name,
      description: store.description ?? `Menu digital ${store.name}`,
      images: store.store_settings?.banner_url ? [store.store_settings.banner_url] : [],
    },
  }
}

export default async function PublicMenuPage({ params }: PageProps) {
  const { slug } = await params

  const store = await getStoreBySlug(slug)
  if (!store) notFound()

  const [categories, menus, locations] = await Promise.all([
    getCategoriesByStore(store.id),
    getActiveMenusByStore(store.id),
    getStoreLocations(store.id),
  ])

  const primaryColor = store.store_settings?.primary_color ?? '#16a34a'
  const theme = store.store_settings?.theme ?? 'default'
  const font = store.store_settings?.font ?? 'sans'
  const menuLayout = store.store_settings?.menu_layout ?? 'list'
  const showPrice = store.store_settings?.show_price ?? true
  // Only enable ordering if both setting is ON and WhatsApp is filled
  const enableOrdering = (store.store_settings?.enable_ordering ?? true) && !!store.whatsapp
  const isDark = theme === 'dark'

  const fontClass =
    font === 'poppins'  ? 'font-poppins' :
    font === 'playfair' ? 'font-playfair' :
    font === 'space'    ? 'font-space' :
    font === 'nunito'   ? 'font-nunito' :
    font === 'dm'       ? 'font-dm' :
    font === 'serif'    ? 'font-serif' :
    font === 'mono'     ? 'font-mono' :
    'font-sans'

  const pageBg = isDark ? 'bg-slate-950' : 'bg-[#FDFDFD]'
  const titleColor = isDark ? 'text-white' : 'text-slate-900'
  const descColor = isDark ? 'text-slate-400' : 'text-slate-500'

  return (
    <CartProvider storeId={store.id}>
      <div className={`min-h-screen ${pageBg} ${fontClass}`}>
        <PageViewTracker storeId={store.id} />

        {/* ── Navbar ── */}
        <PublicNavbar
          storeName={store.name}
          logoUrl={store.store_settings?.logo_url}
          primaryColor={primaryColor}
        />

        {/* ── Hero Banner ── */}
        <section className="relative pt-16 sm:pt-20 h-[300px] sm:h-[360px] flex items-center overflow-hidden">
          {store.store_settings?.banner_url ? (
            <Image
              src={store.store_settings.banner_url}
              alt={`Banner ${store.name}`}
              fill
              sizes="100vw"
              className="object-cover"
              quality={90}
              priority
            />
          ) : (
            <div className="absolute inset-0" style={{ backgroundColor: primaryColor }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/50 to-transparent" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-6">
            <div className="max-w-xl text-white">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-3 leading-tight tracking-tight">
                {store.name}
              </h1>
              {store.description && (
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-md">
                  {store.description}
                </p>
              )}
            </div>
          </div>

          {/* Wave divider */}
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none" style={{ height: '56px' }}>
              <path d="M0,32 C240,56 480,8 720,32 C960,56 1200,8 1440,32 L1440,56 L0,56 Z" fill={isDark ? '#020617' : '#FDFDFD'} />
            </svg>
          </div>
        </section>

        {/* ── Menu Section ── */}
        <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-20">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1 h-7 rounded-full flex-shrink-0" style={{ backgroundColor: primaryColor }} />
              <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${titleColor}`}>Jelajahi Menu Kami</h2>
            </div>
            <p className={`text-sm ml-4 ${descColor}`}>Temukan hidangan favorit yang memanjakan lidah Anda</p>
          </div>
          <PublicMenuList
            menus={menus}
            categories={categories}
            menuLayout={menuLayout}
            showPrice={showPrice}
            enableOrdering={enableOrdering}
            primaryColor={primaryColor}
            isDark={isDark}
            storeId={store.id}
          />
        </section>

        {/* ── WhatsApp floating ── */}
        {enableOrdering && (
          <PublicMenuCart
            storeId={store.id}
            storeName={store.name}
            locations={locations}
            storeWhatsapp={store.whatsapp}
            primaryColor={primaryColor}
            isDark={isDark}
            buttonText={store.store_settings?.whatsapp_button_text}
            showPrice={showPrice}
          />
        )}

        {/* ── Footer ── */}
        <PublicMenuFooter
          store={store}
          locations={locations}
          primaryColor={primaryColor}
          isDark={isDark}
        />

      </div>
    </CartProvider>
  )
}
