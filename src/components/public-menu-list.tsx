'use client'

import { useState } from 'react'
import Image from 'next/image'
import { UtensilsCrossed, ChevronRight, Search, X, MessageCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { MenuDetailModal } from '@/components/menu-detail-modal'
import type { Database } from '@/types/database.types'

type Menu = Database['public']['Tables']['menus']['Row']
type Category = Database['public']['Tables']['categories']['Row']

interface Props {
  menus: Menu[]
  categories?: Category[]
  menuLayout: string
  showPrice: boolean
  primaryColor: string
  isDark: boolean
  waNumber: string | null
  storeName: string
  waButtonText: string
}

export function PublicMenuList({
  menus, categories = [], menuLayout, showPrice, primaryColor, isDark, waNumber, storeName, waButtonText
}: Props) {
  const [selected, setSelected] = useState<Menu | null>(null)
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMenus = menus
    .filter(m => activeCategoryId ? m.category_id === activeCategoryId : true)
    .filter(m => searchQuery.trim()
      ? m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    )

  const cardBg = isDark ? 'bg-gray-800/80 border-gray-700/60' : 'bg-white border-gray-100'
  const menuNameColor = isDark ? 'text-white' : 'text-gray-900'
  const menuDescColor = isDark ? 'text-gray-400' : 'text-gray-500'
  const menuImageBg = isDark ? 'bg-gray-700' : 'bg-gray-100'
  const chevronColor = isDark ? 'text-gray-600' : 'text-gray-300'
  const inputBg = isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'

  return (
    <>
      {/* ── Section header ── */}
      <div className={`flex items-end justify-between mb-5 sm:mb-6 ${waNumber ? 'pb-0' : ''}`}>
        <div>
          <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Apa yang kami sajikan
          </p>
          <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Menu Kami
          </h2>
        </div>
        <span className={`text-sm font-semibold px-3 py-1.5 rounded-full ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
          {menus.length} item
        </span>
      </div>

      {/* ── Search bar ── */}
      <div className="relative mb-4">
        <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Cari menu..."
          className={`w-full pl-10 pr-10 py-3 rounded-2xl border text-sm focus:outline-none focus:ring-2 transition-all ${inputBg}`}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-500'}`}
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-1 px-1 mb-4">
          <button
            onClick={() => setActiveCategoryId(null)}
            className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 shadow-sm transition-all"
            style={
              activeCategoryId === null
                ? { backgroundColor: primaryColor, color: '#fff' }
                : { backgroundColor: isDark ? '#1f2937' : '#fff', color: isDark ? '#9ca3af' : '#6b7280', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }
            }
          >
            Semua ({menus.length})
          </button>
          {categories.map(cat => {
            const count = menus.filter(m => m.category_id === cat.id).length
            const isActive = activeCategoryId === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(isActive ? null : cat.id)}
                className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all"
                style={
                  isActive
                    ? { backgroundColor: primaryColor, color: '#fff' }
                    : { backgroundColor: isDark ? '#1f2937' : '#fff', color: isDark ? '#9ca3af' : '#6b7280', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }
                }
              >
                {cat.name} ({count})
              </button>
            )
          })}
        </div>
      )}

      {/* Empty state */}
      {filteredMenus.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${primaryColor}20` }}>
            {searchQuery ? (
              <Search className="w-8 h-8" style={{ color: primaryColor }} />
            ) : (
              <UtensilsCrossed className="w-8 h-8" style={{ color: primaryColor }} />
            )}
          </div>
          <p className={`text-sm font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {searchQuery
              ? `Tidak ada menu yang cocok dengan "${searchQuery}"`
              : activeCategoryId ? 'Tidak ada menu di kategori ini.' : 'Belum ada menu tersedia.'
            }
          </p>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="mt-3 text-xs font-semibold" style={{ color: primaryColor }}>
              Hapus pencarian
            </button>
          )}
        </div>
      )}

      {/* Grid layout */}
      {menuLayout === 'grid' && filteredMenus.length > 0 && (
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {filteredMenus.map((menu) => (
            <li key={menu.id} className="h-full">
              <button
                type="button"
                onClick={() => setSelected(menu)}
                className={`w-full h-full text-left rounded-2xl border overflow-hidden shadow-sm transition-all active:scale-95 hover:shadow-md flex flex-col ${cardBg}`}
              >
                <div className={`relative w-full aspect-[4/3] ${menuImageBg}`}>
                  {menu.image_url ? (
                    <Image src={menu.image_url} alt={menu.name} fill sizes="(max-width: 640px) 50vw, 240px" className="object-cover" quality={85} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UtensilsCrossed className={`w-8 h-8 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                    </div>
                  )}
                  {showPrice && (
                    <div className="absolute bottom-2 left-2">
                      <span className="px-2 py-0.5 rounded-lg text-xs font-bold text-white shadow-md"
                        style={{ backgroundColor: primaryColor }}>
                        {formatCurrency(menu.price)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <h3 className={`font-bold text-sm leading-tight ${menuNameColor}`}>{menu.name}</h3>
                  {menu.description && (
                    <p className={`mt-1 text-xs line-clamp-2 leading-relaxed ${menuDescColor}`}>{menu.description}</p>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* List layout */}
      {menuLayout !== 'grid' && filteredMenus.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
          {filteredMenus.map((menu) => (
            <li key={menu.id} className="h-full">
              <button
                type="button"
                onClick={() => setSelected(menu)}
                className={`w-full h-full text-left rounded-2xl border flex items-center overflow-hidden shadow-sm transition-all active:scale-[0.99] hover:shadow-md ${cardBg}`}
              >
                <div className={`relative w-24 h-24 flex-shrink-0 ${menuImageBg}`}>
                  {menu.image_url ? (
                    <Image src={menu.image_url} alt={menu.name} fill sizes="96px" className="object-cover" quality={85} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UtensilsCrossed className={`w-7 h-7 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 px-4 py-3">
                  <h3 className={`font-bold text-sm leading-tight ${menuNameColor}`}>{menu.name}</h3>
                  {menu.description && (
                    <p className={`mt-1 text-xs line-clamp-2 leading-relaxed ${menuDescColor}`}>{menu.description}</p>
                  )}
                  {showPrice && (
                    <p className="mt-2 text-sm font-extrabold" style={{ color: primaryColor }}>
                      {formatCurrency(menu.price)}
                    </p>
                  )}
                </div>
                <div className="pr-3 flex-shrink-0">
                  <ChevronRight className={`w-4 h-4 ${chevronColor}`} />
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <MenuDetailModal
          menu={selected}
          primaryColor={primaryColor}
          showPrice={showPrice}
          isDark={isDark}
          waNumber={waNumber}
          storeName={storeName}
          waButtonText={waButtonText}
          onClose={() => setSelected(null)}
        />
      )}

      {/* Sticky WhatsApp button for mobile */}
      {waNumber && (
        <div className="fixed bottom-0 inset-x-0 z-40 p-4 pointer-events-none">
          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full max-w-sm mx-auto py-3.5 rounded-2xl text-white text-sm font-bold shadow-lg pointer-events-auto transition-transform active:scale-95"
            style={{ backgroundColor: primaryColor }}
          >
            <MessageCircle className="w-5 h-5" />
            {waButtonText}
          </a>
        </div>
      )}
    </>
  )
}