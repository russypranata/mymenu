import { notFound } from 'next/navigation'
import { getStoreBySlug } from '@/lib/queries/store'
import { getActiveMenusByStore, getCategoriesByStore } from '@/lib/queries/menu'
import { getStoreLocations } from '@/lib/queries/locations'
import { getGalleryByStore } from '@/lib/queries/gallery'
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
import { PublicGallery } from '@/components/public-gallery'
import {
  getFontClass,
  getTextSizeClass,
  getBorderRadiusClass,
  getBackgroundPattern,
} from '@/lib/utils'

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

  // Destructure settings once — used throughout
  const s = store.store_settings

  const galleryEnabled = s?.gallery_enabled ?? false

  const [categories, menus, locations, galleryPhotos] = await Promise.all([
    getCategoriesByStore(store.id),
    getActiveMenusByStore(store.id),
    getStoreLocations(store.id),
    galleryEnabled ? getGalleryByStore(store.id) : Promise.resolve([]),
  ])

  const primaryColor    = s?.primary_color      ?? '#16a34a'
  const accentColor     = s?.accent_color       ?? '#10b981'
  const theme           = s?.theme              ?? 'default'
  const menuLayout      = s?.menu_layout        ?? 'list'
  const showPrice       = s?.show_price         ?? true
  const darkModeEnabled = s?.dark_mode_enabled  ?? false
  const cardStyle       = s?.card_style         ?? 'card'

  const fontClass         = getFontClass(s?.font              ?? 'sans')
  const textSizeClass     = getTextSizeClass(s?.text_size     ?? 'md')
  const borderRadiusClass = getBorderRadiusClass(s?.border_radius ?? 'rounded')
  const backgroundPattern = getBackgroundPattern(s?.background_pattern ?? 'none')

  const menuSectionTitle    = store.menu_section_title
  const menuSectionSubtitle = store.menu_section_subtitle
  const enableOrdering      = (s?.enable_ordering ?? true) && !!store.whatsapp
  const defaultIsDark       = theme === 'dark'

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

          <PublicNavbar storeName={store.name} logoUrl={s?.logo_url} />

          <PublicMenuContent
            storeName={store.name}
            storeDescription={store.description}
            bannerUrl={s?.banner_url ?? null}
            menuSectionTitle={menuSectionTitle}
            menuSectionSubtitle={menuSectionSubtitle}
            gallerySection={
              galleryEnabled && galleryPhotos.length > 0
                ? <PublicGallery photos={galleryPhotos} />
                : undefined
            }
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

          {darkModeEnabled && (
            <DarkModeToggle storeId={store.id} enabled={darkModeEnabled} />
          )}

          <ScrollToTop />

          {enableOrdering && (
            <PublicMenuCart
              storeId={store.id}
              storeName={store.name}
              locations={locations}
              storeWhatsapp={store.whatsapp}
              buttonText={s?.whatsapp_button_text}
              showPrice={showPrice}
            />
          )}

          <PublicMenuFooter store={store} locations={locations} />
        </PublicMenuWrapper>
      </CartProvider>
    </ThemeProvider>
  )
}
