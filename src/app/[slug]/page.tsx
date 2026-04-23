import { notFound } from 'next/navigation'
import Image from 'next/image'
import { MapPin, Clock } from 'lucide-react'
import { getStoreBySlug } from '@/lib/queries/store'
import { getActiveMenusByStore, getCategoriesByStore } from '@/lib/queries/menu'
import { PublicMenuList } from '@/components/public-menu-list'
import { CartProvider } from '@/components/cart-provider'
import { CartDrawer } from '@/components/cart-drawer'
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

  const [categories, menus] = await Promise.all([
    getCategoriesByStore(store.id),
    getActiveMenusByStore(store.id),
  ])

  const primaryColor = store.store_settings?.primary_color ?? '#16a34a'
  const theme = store.store_settings?.theme ?? 'default'
  const font = store.store_settings?.font ?? 'sans'
  const menuLayout = store.store_settings?.menu_layout ?? 'list'
  const showPrice = store.store_settings?.show_price ?? true
  const openingHours = store.store_settings?.opening_hours ?? null
  const isDark = theme === 'dark'
  const instagram = store.store_settings?.instagram ?? null
  const facebook = store.store_settings?.facebook ?? null
  const tiktok = store.store_settings?.tiktok ?? null

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
            primaryColor={primaryColor}
            isDark={isDark}
            storeId={store.id}
          />
        </section>

        {/* ── WhatsApp floating ── */}
        {store.whatsapp && (
          <CartDrawer
            whatsapp={store.whatsapp}
            storeId={store.id}
            storeName={store.name}
            primaryColor={primaryColor}
            isDark={isDark}
            buttonText={store.store_settings?.whatsapp_button_text}
            showPrice={showPrice}
          />
        )}

        {/* ── Footer ── */}
        <footer className={`border-t ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">

              {/* Tentang Toko */}
              <div>
                <div className="flex items-start gap-3 mb-4">
                  {store.store_settings?.logo_url ? (
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={store.store_settings.logo_url} alt={store.name} fill sizes="40px" className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold text-white flex-shrink-0" style={{ backgroundColor: primaryColor }}>
                      {store.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-base font-bold mb-2 ${titleColor}`}>{store.name}</h3>
                    {store.description && (
                      <p className={`text-sm leading-relaxed ${descColor}`}>{store.description}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Informasi & Kontak */}
              <div>
                <h4 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Informasi & Kontak</h4>
                <div className="space-y-3">
                  {store.address && (
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`} target="_blank" rel="noopener noreferrer"
                      className={`flex items-start gap-2.5 text-sm ${descColor} hover:text-current transition-colors group`}>
                      <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: primaryColor }} />
                      <span className="group-hover:underline leading-relaxed">{store.address}</span>
                    </a>
                  )}
                  {openingHours && (
                    <div className={`flex items-start gap-2.5 text-sm ${descColor}`}>
                      <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: primaryColor }} />
                      <span className="leading-relaxed">{openingHours}</span>
                    </div>
                  )}
                  {store.whatsapp && (
                    <a href={`https://wa.me/${store.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                      className={`flex items-center gap-2.5 text-sm ${descColor} hover:text-current transition-colors group`}>
                      <svg className="w-4 h-4 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      <span className="group-hover:underline">{store.whatsapp}</span>
                    </a>
                  )}
                  {(instagram || facebook || tiktok) && (
                    <div className="pt-1">
                      <p className={`text-xs font-medium mb-2 ${descColor}`}>Ikuti Kami</p>
                      <div className="flex items-center gap-2">
                        {instagram && (
                          <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer"
                            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-105 ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`} aria-label="Instagram">
                            <svg className="w-4 h-4" style={{ color: primaryColor }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                          </a>
                        )}
                        {facebook && (
                          <a href={`https://facebook.com/${facebook}`} target="_blank" rel="noopener noreferrer"
                            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-105 ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`} aria-label="Facebook">
                            <svg className="w-4 h-4" style={{ color: primaryColor }} fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                          </a>
                        )}
                        {tiktok && (
                          <a href={`https://tiktok.com/@${tiktok}`} target="_blank" rel="noopener noreferrer"
                            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-105 ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`} aria-label="TikTok">
                            <svg className="w-4 h-4" style={{ color: primaryColor }} fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Powered by MyMenu */}
              <div>
                <h4 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Powered by MyMenu</h4>
                <p className={`text-sm leading-relaxed mb-4 ${descColor}`}>
                  Platform menu digital modern untuk bisnis kuliner Anda.
                </p>
                <a href="/" className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:gap-3" style={{ color: primaryColor }}>
                  <span>Buat Menu Digital Anda</span>
                  <svg className="w-4 h-4 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </a>
              </div>

            </div>

            {/* Bottom Bar */}
            <div className={`mt-10 pt-6 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <p className={`text-xs ${descColor}`}>
                © {new Date().getFullYear()} {store.name}. Powered by <a href="/" className="font-semibold hover:opacity-70 transition-opacity" style={{ color: primaryColor }}>MyMenu</a>
              </p>
            </div>
          </div>
        </footer>

      </div>
    </CartProvider>
  )
}
