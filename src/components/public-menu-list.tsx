'use client'

import { useState } from 'react'
import Image from 'next/image'
import { UtensilsCrossed, Search, X } from 'lucide-react'
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
  storeId: string
}

export function PublicMenuList({
  menus, categories = [], menuLayout, showPrice, primaryColor, isDark, storeId
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

  const cardBg = isDark ? 'bg-gray-800/90 border-gray-700/40' : 'bg-white border-gray-100'
  const menuNameColor = isDark ? 'text-white' : 'text-gray-900'
  const menuDescColor = isDark ? 'text-gray-400' : 'text-gray-500'
  const menuImageBg = isDark ? 'bg-gray-700' : 'bg-gray-100'
  const inputBg = isDark
    ? 'bg-gray-800/80 border-gray-700 text-white placeholder-gray-500'
    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
  const sectionBg = isDark ? 'bg-gray-900/60' : 'bg-gray-50/80'

  return (
    <>
      {/* ── Search ── */}
      <div className="relative mb-5">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Cari menu..."
          className={`w-full pl-11 pr-10 py-3 rounded-2xl border text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all ${inputBg}`}
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

      {/* ── Category pills ── */}
      {categories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-6">
          <button
            onClick={() => setActiveCategoryId(null)}
            className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all"
            style={
              activeCategoryId === null
                ? { backgroundColor: primaryColor, color: '#fff', boxShadow: `0 4px 14px ${primaryColor}50` }
                : { backgroundColor: isDark ? '#1f2937' : '#fff', color: isDark ? '#9ca3af' : '#6b7280', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }
            }
          >
            Semua
          </button>
          {categories.map(cat => {
            const isActive = activeCategoryId === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(isActive ? null : cat.id)}
                className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all"
                style={
                  isActive
                    ? { backgroundColor: primaryColor, color: '#fff', boxShadow: `0 4px 14px ${primaryColor}50` }
                    : { backgroundColor: isDark ? '#1f2937' : '#fff', color: isDark ? '#9ca3af' : '#6b7280', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }
                }
              >
                {cat.name}
              </button>
            )
          })}
        </div>
      )}

      {/* ── Empty state ── */}
      {filteredMenus.length === 0 && (
        <div className="text-center py-24">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: `${primaryColor}15` }}>
            {searchQuery
              ? <Search className="w-9 h-9" style={{ color: primaryColor }} />
              : <UtensilsCrossed className="w-9 h-9" style={{ color: primaryColor }} />
            }
          </div>
          <p className={`text-base font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {searchQuery ? 'Menu tidak ditemukan' : 'Belum ada menu'}
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : 'Menu sedang disiapkan'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
              style={{ color: primaryColor, backgroundColor: `${primaryColor}15` }}
            >
              Hapus pencarian
            </button>
          )}
        </div>
      )}

      {/* ── GRID layout — GoFood style ── */}
      {menuLayout === 'grid' && filteredMenus.length > 0 && (
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredMenus.map((menu) => (
            <li key={menu.id}>
              <button
                type="button"
                onClick={() => setSelected(menu)}
                className={`w-full text-left rounded-2xl border overflow-hidden transition-all duration-200 active:scale-[0.97] group ${cardBg}`}
              >
                {/* Photo — portrait ratio, bigger visual impact */}
                <div className={`relative w-full aspect-[3/2] ${menuImageBg} overflow-hidden`}>
                  {menu.image_url ? (
                    <Image
                      src={menu.image_url}
                      alt={menu.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      quality={85}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UtensilsCrossed className={`w-10 h-10 ${isDark ? 'text-gray-600' : 'text-gray-200'}`} />
                    </div>
                  )}
                  {/* Sold out overlay */}
                  {!menu.is_active && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs font-bold bg-black/60 px-3 py-1.5 rounded-full tracking-wide">
                        Habis
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className={`font-bold text-sm leading-snug line-clamp-2 mb-1 ${menuNameColor}`}>
                    {menu.name}
                  </h3>
                  {menu.description && (
                    <p className={`text-xs line-clamp-1 leading-relaxed mb-2 ${menuDescColor}`}>
                      {menu.description}
                    </p>
                  )}
                  {showPrice && (
                    <p className="text-sm font-extrabold" style={{ color: primaryColor }}>
                      {formatCurrency(menu.price)}
                    </p>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* ── LIST layout — GrabFood style ── */}
      {menuLayout !== 'grid' && filteredMenus.length > 0 && (() => {
        // Group by category if categories exist, otherwise flat list
        const grouped = categories.length > 0 && !activeCategoryId && !searchQuery
          ? categories
              .map(cat => ({
                cat,
                items: filteredMenus.filter(m => m.category_id === cat.id),
              }))
              .filter(g => g.items.length > 0)
          : null

        const uncategorized = grouped
          ? filteredMenus.filter(m => !m.category_id || !categories.find(c => c.id === m.category_id))
          : []

        if (grouped) {
          return (
            <div className="space-y-8">
              {grouped.map(({ cat, items }) => (
                <section key={cat.id}>
                  {/* Category heading */}
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className={`text-base font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {cat.name}
                    </h3>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                    >
                      {items.length}
                    </span>
                    <div className={`flex-1 h-px ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`} />
                  </div>
                  <MenuItemList items={items} cardBg={cardBg} menuNameColor={menuNameColor} menuDescColor={menuDescColor} menuImageBg={menuImageBg} showPrice={showPrice} primaryColor={primaryColor} isDark={isDark} onSelect={setSelected} />
                </section>
              ))}
              {uncategorized.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className={`text-base font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Lainnya
                    </h3>
                    <div className={`flex-1 h-px ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`} />
                  </div>
                  <MenuItemList items={uncategorized} cardBg={cardBg} menuNameColor={menuNameColor} menuDescColor={menuDescColor} menuImageBg={menuImageBg} showPrice={showPrice} primaryColor={primaryColor} isDark={isDark} onSelect={setSelected} />
                </section>
              )}
            </div>
          )
        }

        return (
          <MenuItemList
            items={filteredMenus}
            cardBg={cardBg}
            menuNameColor={menuNameColor}
            menuDescColor={menuDescColor}
            menuImageBg={menuImageBg}
            showPrice={showPrice}
            primaryColor={primaryColor}
            isDark={isDark}
            onSelect={setSelected}
          />
        )
      })()}

      {/* ── Modal ── */}
      {selected && (
        <MenuDetailModal
          menu={selected}
          primaryColor={primaryColor}
          showPrice={showPrice}
          isDark={isDark}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}

// ── Reusable list of menu items ──
interface MenuItemListProps {
  items: ReturnType<typeof Array.prototype.filter>
  cardBg: string
  menuNameColor: string
  menuDescColor: string
  menuImageBg: string
  showPrice: boolean
  primaryColor: string
  isDark: boolean
  onSelect: (menu: any) => void
}

function MenuItemList({ items, cardBg, menuNameColor, menuDescColor, menuImageBg, showPrice, primaryColor, isDark, onSelect }: MenuItemListProps) {
  return (
    <ul className="space-y-2.5">
      {items.map((menu: any) => (
        <li key={menu.id}>
          <button
            type="button"
            onClick={() => onSelect(menu)}
            className={`w-full text-left rounded-2xl border flex items-stretch overflow-hidden transition-all duration-150 active:scale-[0.99] group ${cardBg}`}
          >
            {/* Square image — consistent height */}
            <div className={`relative w-[100px] h-[100px] flex-shrink-0 ${menuImageBg} overflow-hidden`}>
              {menu.image_url ? (
                <Image
                  src={menu.image_url}
                  alt={menu.name}
                  fill
                  sizes="100px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  quality={85}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UtensilsCrossed className={`w-8 h-8 ${isDark ? 'text-gray-600' : 'text-gray-200'}`} />
                </div>
              )}
              {!menu.is_active && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold bg-black/60 px-2 py-0.5 rounded-full">Habis</span>
                </div>
              )}
            </div>

            {/* Text content — vertically centered, consistent */}
            <div className="flex-1 min-w-0 px-4 flex flex-col justify-center py-3 gap-0.5">
              <h3 className={`font-bold text-sm leading-snug line-clamp-2 ${menuNameColor}`}>
                {menu.name}
              </h3>
              {menu.description && (
                <p className={`text-xs line-clamp-2 leading-relaxed ${menuDescColor}`}>
                  {menu.description}
                </p>
              )}
              {showPrice && (
                <p className="text-sm font-extrabold mt-1" style={{ color: primaryColor }}>
                  {formatCurrency(menu.price)}
                </p>
              )}
            </div>
          </button>
        </li>
      ))}
    </ul>
  )
}
