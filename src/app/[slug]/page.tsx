import { notFound } from 'next/navigation'
import Image from 'next/image'
import { MapPin, MessageCircle, Clock } from 'lucide-react'
import { getStoreBySlug } from '@/lib/queries/store'
import { getActiveMenusByStore, getCategoriesByStore } from '@/lib/queries/menu'
import { PublicMenuList } from '@/components/public-menu-list'
import { PageViewTracker } from '@/components/page-view-tracker'

// ISR: revalidate public menu pages every 60 seconds
// Reduces server load since menu content changes infrequently
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
  const waButtonText = store.store_settings?.whatsapp_button_text ?? 'Pesan via WhatsApp'
  const isDark = theme === 'dark'

  // Fix #4: isOpen based on actual time parsing, not just presence of openingHours.
  // Format expected: "HH:MM - HH:MM" e.g. "08:00 - 22:00"
  const isOpen = (() => {
    if (!openingHours) return false
    const match = openingHours.match(/(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/)
    if (!match) return true // can't parse, assume open if hours are set
    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    const openMinutes = parseInt(match[1]) * 60 + parseInt(match[2])
    const closeMinutes = parseInt(match[3]) * 60 + parseInt(match[4])
    return currentMinutes >= openMinutes && currentMinutes < closeMinutes
  })()

  const fontClass = font === 'serif' ? 'font-serif' : font === 'mono' ? 'font-mono' : 'font-sans'
  const pageBg = isDark ? 'bg-gray-950' : 'bg-gray-50'
  const titleColor = isDark ? 'text-white' : 'text-gray-900'
  const descColor = isDark ? 'text-gray-400' : 'text-gray-500'
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-100'

  return (
    <div className={`min-h-screen ${pageBg} ${fontClass} relative overflow-x-hidden`}>
      <PageViewTracker storeId={store.id} />
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">

        {/* Papan menu - kiri atas */}
        <div className="absolute top-[5%] left-[3%] opacity-[0.06] -rotate-12">
          <svg width="120" height="145" viewBox="0 0 140 170" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="22" width="128" height="142" rx="12" stroke={primaryColor} strokeWidth="6" />
            <rect x="44" y="10" width="52" height="24" rx="7" fill={primaryColor} />
            <rect x="22" y="58" width="96" height="8" rx="4" fill={primaryColor} />
            <rect x="22" y="78" width="64" height="7" rx="3.5" fill={primaryColor} opacity="0.6" />
            <rect x="22" y="104" width="96" height="8" rx="4" fill={primaryColor} />
            <rect x="22" y="124" width="76" height="7" rx="3.5" fill={primaryColor} opacity="0.6" />
            <rect x="22" y="150" width="96" height="8" rx="4" fill={primaryColor} />
          </svg>
        </div>

        {/* Minuman/gelas - kanan atas agak ke tengah */}
        <div className="absolute top-[3%] right-[8%] opacity-[0.06] rotate-[15deg]">
          <svg width="100" height="135" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 20 L30 140 Q30 150 60 150 Q90 150 90 140 L100 20 Z" stroke={primaryColor} strokeWidth="6" strokeLinejoin="round" fill="none" />
            <line x1="18" y1="50" x2="102" y2="50" stroke={primaryColor} strokeWidth="5" strokeLinecap="round" />
            <ellipse cx="60" cy="20" rx="40" ry="8" stroke={primaryColor} strokeWidth="5" fill="none" />
            <line x1="60" y1="0" x2="60" y2="20" stroke={primaryColor} strokeWidth="4" strokeLinecap="round" />
            <circle cx="60" cy="0" r="5" fill={primaryColor} />
          </svg>
        </div>

        {/* Piring - tengah kiri, agak ke dalam */}
        <div className="absolute top-[38%] left-[5%] opacity-[0.05] rotate-[8deg]">
          <svg width="130" height="130" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="75" cy="75" r="65" stroke={primaryColor} strokeWidth="6" fill="none" />
            <circle cx="75" cy="75" r="45" stroke={primaryColor} strokeWidth="4" fill="none" opacity="0.6" />
            <circle cx="75" cy="75" r="20" fill={primaryColor} opacity="0.3" />
            <line x1="75" y1="10" x2="75" y2="30" stroke={primaryColor} strokeWidth="5" strokeLinecap="round" />
            <line x1="55" y1="15" x2="60" y2="34" stroke={primaryColor} strokeWidth="4" strokeLinecap="round" opacity="0.6" />
            <line x1="95" y1="15" x2="90" y2="34" stroke={primaryColor} strokeWidth="4" strokeLinecap="round" opacity="0.6" />
          </svg>
        </div>

        {/* Kopi - kanan tengah bawah */}
        <div className="absolute top-[55%] right-[4%] opacity-[0.06] -rotate-[8deg]">
          <svg width="115" height="125" viewBox="0 0 130 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 50 L30 120 Q30 130 65 130 Q100 130 100 120 L110 50 Z" stroke={primaryColor} strokeWidth="6" fill="none" strokeLinejoin="round" />
            <path d="M100 65 Q125 65 125 85 Q125 105 100 105" stroke={primaryColor} strokeWidth="5" fill="none" strokeLinecap="round" />
            <line x1="18" y1="50" x2="112" y2="50" stroke={primaryColor} strokeWidth="5" strokeLinecap="round" />
            <path d="M45 30 Q45 15 55 20 Q55 5 65 10 Q65 0 75 5" stroke={primaryColor} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.7" />
          </svg>
        </div>

        {/* Phone - kiri bawah */}
        <div className="absolute bottom-[8%] left-[6%] opacity-[0.06] rotate-[12deg]">
          <svg width="95" height="155" viewBox="0 0 110 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="6" width="90" height="168" rx="18" stroke={primaryColor} strokeWidth="6" fill="none" />
            <rect x="38" y="14" width="34" height="6" rx="3" fill={primaryColor} />
            <circle cx="55" cy="162" r="7" stroke={primaryColor} strokeWidth="4" fill="none" />
            <rect x="22" y="36" width="66" height="8" rx="4" fill={primaryColor} />
            <rect x="22" y="56" width="44" height="7" rx="3.5" fill={primaryColor} opacity="0.6" />
            <rect x="22" y="80" width="66" height="8" rx="4" fill={primaryColor} />
            <rect x="22" y="100" width="52" height="7" rx="3.5" fill={primaryColor} opacity="0.6" />
            <rect x="22" y="124" width="66" height="8" rx="4" fill={primaryColor} />
          </svg>
        </div>

        {/* Garpu & sendok - kanan bawah */}
        <div className="absolute bottom-[5%] right-[5%] opacity-[0.06] -rotate-[12deg]">
          <svg width="105" height="160" viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="30" y1="10" x2="30" y2="170" stroke={primaryColor} strokeWidth="6" strokeLinecap="round" />
            <path d="M15 10 L15 60 Q15 75 30 75 Q45 75 45 60 L45 10" stroke={primaryColor} strokeWidth="5" fill="none" strokeLinecap="round" />
            <line x1="90" y1="10" x2="90" y2="170" stroke={primaryColor} strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="90" cy="45" rx="22" ry="38" stroke={primaryColor} strokeWidth="5" fill="none" />
          </svg>
        </div>

        {/* Papan menu kecil - tengah kanan atas */}
        <div className="absolute top-[22%] right-[2%] opacity-[0.04] rotate-[20deg]">
          <svg width="80" height="97" viewBox="0 0 140 170" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="22" width="128" height="142" rx="12" stroke={primaryColor} strokeWidth="6" />
            <rect x="44" y="10" width="52" height="24" rx="7" fill={primaryColor} />
            <rect x="22" y="58" width="96" height="8" rx="4" fill={primaryColor} />
            <rect x="22" y="104" width="96" height="8" rx="4" fill={primaryColor} />
            <rect x="22" y="150" width="96" height="8" rx="4" fill={primaryColor} />
          </svg>
        </div>

        {/* Kopi kecil - tengah kiri bawah */}
        <div className="absolute bottom-[30%] left-[2%] opacity-[0.04] -rotate-[18deg]">
          <svg width="80" height="87" viewBox="0 0 130 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 50 L30 120 Q30 130 65 130 Q100 130 100 120 L110 50 Z" stroke={primaryColor} strokeWidth="6" fill="none" strokeLinejoin="round" />
            <path d="M100 65 Q125 65 125 85 Q125 105 100 105" stroke={primaryColor} strokeWidth="5" fill="none" strokeLinecap="round" />
            <line x1="18" y1="50" x2="112" y2="50" stroke={primaryColor} strokeWidth="5" strokeLinecap="round" />
          </svg>
        </div>

      </div>

      {/* ── Hero header with overlay ── */}
      <div className="relative h-[240px] sm:h-[280px] lg:h-[320px] w-full overflow-hidden">
        {/* Background image or color */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: primaryColor }}
        >
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
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                  radial-gradient(circle at 80% 20%, white 1px, transparent 1px),
                  radial-gradient(circle at 60% 80%, white 1px, transparent 1px)`,
                backgroundSize: '60px 60px',
              }}
            />
          )}
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Store info overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Logo */}
              {store.store_settings?.logo_url ? (
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-2xl sm:rounded-3xl overflow-hidden flex-shrink-0 border-4 border-white/20 shadow-2xl bg-white">
                  <Image 
                    src={store.store_settings.logo_url} 
                    alt={`Logo ${store.name}`} 
                    fill 
                    sizes="128px" 
                    className="object-cover" 
                    quality={90} 
                    priority 
                  />
                </div>
              ) : (
                <div
                  className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-2xl sm:rounded-3xl flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white shadow-2xl flex-shrink-0 border-4 border-white/20"
                  style={{ backgroundColor: primaryColor }}
                >
                  {store.name.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Store details */}
              <div className="flex-1 min-w-0 pb-2">
                <div className="flex items-start gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                    {store.name}
                  </h1>
                  {isOpen && (
                    <span className="text-[10px] sm:text-xs font-extrabold tracking-wide text-white bg-gradient-to-r from-green-500 to-emerald-500 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg flex-shrink-0 shadow-lg animate-pulse">
                      BUKA
                    </span>
                  )}
                </div>

                {store.description && (
                  <p className="text-sm sm:text-base text-white/90 mb-3 line-clamp-2 leading-relaxed max-w-2xl">
                    {store.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2">
                  {store.address && (
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs sm:text-sm text-white/90 hover:text-white transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                      </div>
                      <span className="truncate max-w-[200px] sm:max-w-none underline decoration-white/30 group-hover:decoration-white/60">
                        {store.address}
                      </span>
                    </a>
                  )}
                  {openingHours && (
                    <span className="flex items-center gap-2 text-xs sm:text-sm font-medium text-white/80">
                      <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                      </div>
                      {openingHours}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Info bar jam operasional ── */}
      {openingHours && (
        <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border-b`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${primaryColor}20` }}>
              <Clock className="w-4 h-4" style={{ color: primaryColor }} />
            </div>
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Jam Operasional:
            </span>
            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {openingHours}
            </span>
            <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              {isOpen ? 'Sedang Buka' : 'Sedang Tutup'}
            </span>
          </div>
        </div>
      )}

      {/* ── Menu list with category filter built-in ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 lg:mt-12 pb-24">
        <PublicMenuList
          menus={menus}
          categories={categories}
          menuLayout={menuLayout}
          showPrice={showPrice}
          primaryColor={primaryColor}
          isDark={isDark}
          waNumber={store.whatsapp}
          storeName={store.name}
          waButtonText={waButtonText}
        />
      </div>

      {/* ── Footer ── */}
      <footer className={`border-t ${borderColor} ${isDark ? 'bg-gray-900' : 'bg-white'} mt-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Store Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {store.store_settings?.logo_url ? (
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                    <Image 
                      src={store.store_settings.logo_url} 
                      alt={store.name} 
                      fill 
                      sizes="48px" 
                      className="object-cover" 
                    />
                  </div>
                ) : (
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {store.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <h3 className={`text-lg font-bold ${titleColor}`}>{store.name}</h3>
              </div>
              {store.description && (
                <p className={`text-sm leading-relaxed ${descColor}`}>
                  {store.description}
                </p>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Kontak
              </h4>
              <div className="space-y-3">
                {store.address && (
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-start gap-3 text-sm ${descColor} hover:text-current transition-colors group`}
                  >
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: primaryColor }} />
                    <span className="group-hover:underline">{store.address}</span>
                  </a>
                )}
                {openingHours && (
                  <div className={`flex items-start gap-3 text-sm ${descColor}`}>
                    <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: primaryColor }} />
                    <span>{openingHours}</span>
                  </div>
                )}
                {store.whatsapp && (
                  <a 
                    href={`https://wa.me/${store.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-start gap-3 text-sm ${descColor} hover:text-current transition-colors group`}
                  >
                    <MessageCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: primaryColor }} />
                    <span className="group-hover:underline">WhatsApp: +{store.whatsapp}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Powered By */}
            <div className="space-y-4">
              <h4 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Menu Digital
              </h4>
              <div className="space-y-3">
                <p className={`text-sm ${descColor}`}>
                  Menu digital modern untuk bisnis kuliner Anda
                </p>
                <a 
                  href="/"
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                  style={{ color: primaryColor }}
                >
                  <span>Buat Menu Digital Anda</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`mt-8 pt-8 border-t ${borderColor} flex flex-col sm:flex-row justify-between items-center gap-4`}>
            <p className={`text-xs ${descColor}`}>
              © {new Date().getFullYear()} {store.name}. All rights reserved.
            </p>
            <p className={`text-xs ${descColor}`}>
              Powered by <span className="font-semibold" style={{ color: primaryColor }}>MyMenu</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}