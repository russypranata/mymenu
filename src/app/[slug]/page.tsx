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
import { ScrollToTop } from '@/components/scroll-to-top'
import { ShareButton } from '@/components/share-button'
import {
  getFontClass,
  getTextSizeClass,
  getBorderRadiusClass,
  getBackgroundPattern,
} from '@/lib/utils'

// ISR: revalidate every 60 seconds. Remove force-dynamic to allow caching.
export const revalidate = 60

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

  const settings = store.store_settings

  const primaryColor    = settings?.primary_color      ?? '#16a34a'
  const accentColor     = settings?.accent_color       ?? '#10b981'
  const theme           = settings?.theme              ?? 'default'
  const menuLayout      = settings?.menu_layout        ?? 'list'
  const showPrice       = settings?.show_price         ?? true
  const darkModeEnabled = settings?.dark_mode_enabled  ?? false
  const cardStyle       = settings?.card_style         ?? 'card'

  // Derive classes from utility maps — single source of truth
  const fontClass              = getFontClass(settings?.font              ?? 'sans')
  const textSizeClass          = getTextSizeClass(settings?.text_size     ?? 'md')
  const borderRadiusClass      = getBorderRadiusClass(settings?.border_radius ?? 'rounded')
  const backgroundPattern = getBackgroundPattern(settings?.background_pattern ?? 'none')

  const menuSectionTitle    = store.menu_section_title
  const menuSectionSubtitle = store.menu_section_subtitle

  // Only enable ordering if both setting is ON and WhatsApp is filled
  const enableOrdering = (settings?.enable_ordering ?? true) && !!store.whatsapp

  // 'dark' theme means default to dark mode
  const defaultIsDark = theme === 'dark'

  return (
    <ThemeProvider
      storeId={store.id}
      defaultDark={defaultIsDark}
      darkModeEnabled={darkModeEnabled}
      primaryColor={primaryColor}
      accentColor={accentColor}
    >
      <CartProvider storeId={store.id}>
        <PublicMenuWrapper
          fontClass={fontClass}
          textSizeClass={textSizeClass}
          backgroundPattern={backgroundPattern}
        >
          <PageViewTracker storeId={store.id} />

          {/* ── Navbar ── */}
          <PublicNavbar
            storeName={store.name}
            logoUrl={settings?.logo_url}
          />

          {/* ── Hero & Menu Content ── */}
          <PublicMenuContent
            storeName={store.name}
            storeDescription={store.description}
            bannerUrl={settings?.banner_url ?? null}
            menuSectionTitle={menuSectionTitle}
            menuSectionSubtitle={menuSectionSubtitle}
          >
            <PublicMenuList
              menus={menus}
              categories={categories}
              menuLayout={menuLayout}
              showPrice={showPrice}
              enableOrdering={enableOrdering}
              storeId={store.id}
              borderRadius={borderRadiusClass}
              cardStyle={cardStyle}
            />
          </PublicMenuContent>

          {/* ── Dark Mode Toggle ── */}
          {darkModeEnabled && (
            <DarkModeToggle storeId={store.id} enabled={darkModeEnabled} />
          )}

          {/* ── Scroll to Top ── */}
          <ScrollToTop />

          {/* ── WhatsApp floating cart ── */}
          {enableOrdering && (
            <PublicMenuCart
              storeId={store.id}
              storeName={store.name}
              locations={locations}
              storeWhatsapp={store.whatsapp}
              buttonText={settings?.whatsapp_button_text}
              showPrice={showPrice}
            />
          )}

          {/* ── Footer ── */}
          <PublicMenuFooter store={store} locations={locations} />
        </PublicMenuWrapper>
      </CartProvider>
    </ThemeProvider>
  )
}
