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
import { ThemeProvider } from '@/components/theme-provider'
import { PublicMenuWrapper } from '@/components/public-menu-wrapper'
import { DarkModeToggle } from '@/components/dark-mode-toggle'
import { PublicMenuContent } from '@/components/public-menu-content'

export const revalidate = 60
export const dynamic = 'force-dynamic'

// Disable static generation for this page since it requires Supabase at build time
// export async function generateStaticParams() {
//   const { createClient } = await import('@supabase/supabase-js')
//   const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   )
//   const { data } = await supabase.from('stores').select('slug')
//   return (data ?? []).map(({ slug }: { slug: string }) => ({ slug }))
// }

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
      siteName: 'Menuly',
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
  const accentColor = store.store_settings?.accent_color ?? '#10b981'
  const theme = store.store_settings?.theme ?? 'default'
  const font = store.store_settings?.font ?? 'sans'
  const menuLayout = store.store_settings?.menu_layout ?? 'list'
  const showPrice = store.store_settings?.show_price ?? true
  const darkModeEnabled = store.store_settings?.dark_mode_enabled ?? false
  const borderRadius = store.store_settings?.border_radius ?? 'rounded'
  const cardStyle = store.store_settings?.card_style ?? 'card'
  const textSize = store.store_settings?.text_size ?? 'md'
  const backgroundPattern = store.store_settings?.background_pattern ?? 'none'
  
  // Only enable ordering if both setting is ON and WhatsApp is filled
  const enableOrdering = (store.store_settings?.enable_ordering ?? true) && !!store.whatsapp
  const defaultIsDark = theme === 'dark'

  const fontClass =
    font === 'poppins'  ? 'font-poppins' :
    font === 'playfair' ? 'font-playfair' :
    font === 'space'    ? 'font-space' :
    font === 'nunito'   ? 'font-nunito' :
    font === 'dm'       ? 'font-dm' :
    font === 'serif'    ? 'font-serif' :
    font === 'mono'     ? 'font-mono' :
    'font-sans'

  const textSizeClass =
    textSize === 'sm' ? 'text-sm' :
    textSize === 'lg' ? 'text-lg' :
    'text-base'

  const borderRadiusClass =
    borderRadius === 'sharp' ? 'rounded-none' :
    borderRadius === 'pill' ? 'rounded-full' :
    'rounded-xl'

  const backgroundPatternStyle =
    backgroundPattern === 'dots' ? 'bg-[radial-gradient(circle,rgba(148,163,184,0.15)_1px,transparent_1px)] [background-size:20px_20px]' :
    backgroundPattern === 'grid' ? 'bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:24px_24px]' :
    backgroundPattern === 'waves' ? `[background-image:repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(148,163,184,0.03)_10px,rgba(148,163,184,0.03)_20px)]` :
    ''

  return (
    <ThemeProvider storeId={store.id} defaultDark={defaultIsDark} darkModeEnabled={darkModeEnabled}>
      <CartProvider storeId={store.id}>
        <PublicMenuWrapper 
          fontClass={fontClass} 
          textSizeClass={textSizeClass}
          backgroundPattern={backgroundPatternStyle}
        >
          <PageViewTracker storeId={store.id} />

          {/* ── Navbar ── */}
          <PublicNavbar
            storeName={store.name}
            logoUrl={store.store_settings?.logo_url}
            primaryColor={primaryColor}
          />

          {/* ── Hero & Menu Content ── */}
          <PublicMenuContent
            storeName={store.name}
            storeDescription={store.description}
            bannerUrl={store.store_settings?.banner_url ?? null}
            primaryColor={primaryColor}
          >
            <PublicMenuList
              menus={menus}
              categories={categories}
              menuLayout={menuLayout}
              showPrice={showPrice}
              enableOrdering={enableOrdering}
              primaryColor={primaryColor}
              accentColor={accentColor}
              storeId={store.id}
              borderRadius={borderRadiusClass}
              cardStyle={cardStyle}
            />
          </PublicMenuContent>

          {/* ── Dark Mode Toggle ── */}
          {darkModeEnabled && (
            <DarkModeToggle
              storeId={store.id}
              enabled={darkModeEnabled}
              primaryColor={primaryColor}
            />
          )}

          {/* ── WhatsApp floating ── */}
          {enableOrdering && (
            <PublicMenuCart
              storeId={store.id}
              storeName={store.name}
              locations={locations}
              storeWhatsapp={store.whatsapp}
              primaryColor={primaryColor}
              buttonText={store.store_settings?.whatsapp_button_text}
              showPrice={showPrice}
            />
          )}

          {/* ── Footer ── */}
          <PublicMenuFooter
            store={store}
            locations={locations}
            primaryColor={primaryColor}
          />
        </PublicMenuWrapper>
      </CartProvider>
    </ThemeProvider>
  )
}
