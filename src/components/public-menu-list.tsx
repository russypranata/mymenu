'use client'

import { useState } from 'react'
import Image from 'next/image'
import { UtensilsCrossed, Search, X, Plus, Minus } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { MenuDetailModal } from '@/components/menu-detail-modal'
import { useCart } from '@/components/cart-provider'
import type { Database } from '@/types/database.types'

type Menu = Database['public']['Tables']['menus']['Row']
type Category = Database['public']['Tables']['categories']['Row']

interface Props {
  menus: Menu[]
  categories?: Category[]
  menuLayout: string
  showPrice: boolean
  enableOrdering: boolean
  primaryColor: string
  isDark: boolean
  storeId: string
}

interface CardListProps {
  items: Menu[]
  cardBg: string
  menuNameColor: string
  menuDescColor: string
  menuImageBg: string
  showPrice: boolean
  enableOrdering: boolean
  primaryColor: string
  isDark: boolean
  onSelect: (menu: Menu) => void
}

function MenuCardList({ items, cardBg, menuNameColor, menuDescColor, menuImageBg, showPrice, enableOrdering, primaryColor, isDark, onSelect }: CardListProps) {
  const { add, increment, decrement, items: cartItems } = useCart()

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
      {items.map((menu, idx) => {
        const cartItem = cartItems.find(i => i.menu.id === menu.id)
        const qty = cartItem?.qty ?? 0
        return (
          <li key={menu.id} className="flex">
            <div
              className={`rounded-[1.5rem] border overflow-hidden flex flex-col w-full transition-all duration-300 ${cardBg}`}
            >
              {/* Image */}
              <button
                type="button"
                onClick={() => onSelect(menu)}
                className={`relative w-full h-44 sm:h-52 ${menuImageBg} overflow-hidden flex-shrink-0`}
                aria-label={`Lihat detail ${menu.name}`}
              >
                {menu.image_url ? (
                  <Image
                    src={menu.image_url}
                    alt={menu.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    quality={85}
                    priority={idx < 4}
                    loading={idx < 4 ? 'eager' : 'lazy'}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UtensilsCrossed className={`w-10 h-10 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                  </div>
                )}
                {!menu.is_active && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-xs font-black bg-black/70 px-3 py-1.5 rounded-lg tracking-widest uppercase">Habis</span>
                  </div>
                )}
              </button>

              {/* Info */}
              <div className="flex flex-col flex-1 p-4 sm:p-5">
                <button type="button" onClick={() => onSelect(menu)} className="text-left mb-3">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className={`font-extrabold text-sm sm:text-base leading-snug ${menuNameColor}`} style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      minHeight: '2.5rem'
                    }}>{menu.name}</h3>
                    {showPrice && (
                      <span className="text-sm font-extrabold flex-shrink-0" style={{ color: primaryColor }}>
                        {formatCurrency(menu.price)}
                      </span>
                    )}
                  </div>
                  {menu.description && (
                    <p className={`text-xs leading-relaxed ${menuDescColor}`} style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      minHeight: '2.25rem'
                    }}>{menu.description}</p>
                  )}
                </button>

                {/* Add to cart */}
                {menu.is_active && enableOrdering && (
                  <div className="mt-auto">
                    {qty === 0 ? (
                      <button
                        onClick={() => add(menu)}
                        className="w-full py-3 rounded-2xl text-sm font-extrabold transition-all active:scale-95 flex items-center justify-center gap-2 group"
                        style={{ backgroundColor: `${primaryColor}12`, color: primaryColor }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = primaryColor;
                          (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${primaryColor}12`;
                          (e.currentTarget as HTMLButtonElement).style.color = primaryColor;
                        }}
                        aria-label={`Tambah ${menu.name}`}
                      >
                        Pesan Menu
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        <button
                          onClick={() => decrement(menu.id)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'}`}
                          aria-label="Kurangi"
                        >
                          <Minus className="w-3.5 h-3.5" style={{ color: isDark ? '#94a3b8' : '#64748b' }} />
                        </button>
                        <span className={`text-sm font-extrabold ${menuNameColor}`}>{qty}</span>
                        <button
                          onClick={() => increment(menu.id)}
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all active:scale-90"
                          style={{ backgroundColor: primaryColor }}
                          aria-label="Tambah"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

// ── Main export ──
export function PublicMenuList({ menus, categories = [], menuLayout, showPrice, enableOrdering, primaryColor, isDark, storeId }: Props) {
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

  const cardBg = isDark ? 'bg-slate-800 border-slate-700/50' : 'bg-white border-slate-100'
  const menuNameColor = isDark ? 'text-white' : 'text-slate-900'
  const menuDescColor = isDark ? 'text-slate-400' : 'text-slate-500'
  const menuImageBg = isDark ? 'bg-slate-700' : 'bg-slate-100'
  const inputBg = isDark
    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'

  const sharedProps = { cardBg, menuNameColor, menuDescColor, menuImageBg, showPrice, enableOrdering, primaryColor, isDark, onSelect: setSelected }

  return (
    <>
      {/* Search + Category row */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 mb-10">
        {/* Search */}
        <div className="relative w-full lg:max-w-sm group">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'} group-focus-within:text-current transition-colors`} style={{ '--tw-text-opacity': 1 } as React.CSSProperties} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari menu..."
            className={`w-full pl-11 pr-10 py-3.5 rounded-2xl border text-sm focus:outline-none focus:ring-4 transition-all ${inputBg}`}
            style={{ '--tw-ring-color': `${primaryColor}20` } as React.CSSProperties}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center ${isDark ? 'bg-slate-600 text-slate-300' : 'bg-slate-200 text-slate-500'}`}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Category tabs */}
        {categories.length > 0 && (
          <div className="flex gap-2.5 overflow-x-auto pb-1 w-full lg:w-auto" style={{ scrollbarWidth: 'none' }}>
            <button
              onClick={() => setActiveCategoryId(null)}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all duration-200 border"
              style={
                activeCategoryId === null
                  ? { backgroundColor: primaryColor, color: '#fff', borderColor: primaryColor, boxShadow: `0 4px 14px ${primaryColor}40` }
                  : { backgroundColor: isDark ? '#1e293b' : '#fff', color: isDark ? '#94a3b8' : '#64748b', borderColor: isDark ? '#334155' : '#e2e8f0' }
              }
            >
              Semua
            </button>
            {categories.map(cat => {
              const isActive = activeCategoryId === cat.id
              const count = menus.filter(m => m.category_id === cat.id).length
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryId(isActive ? null : cat.id)}
                  className="px-5 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-200 flex items-center gap-1.5 border"
                  style={
                    isActive
                      ? { backgroundColor: primaryColor, color: '#fff', borderColor: primaryColor, boxShadow: `0 4px 14px ${primaryColor}40` }
                      : { backgroundColor: isDark ? '#1e293b' : '#fff', color: isDark ? '#94a3b8' : '#64748b', borderColor: isDark ? '#334155' : '#e2e8f0' }
                  }
                >
                  {cat.name}
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Empty state */}
      {filteredMenus.length === 0 && (
        <div className="text-center py-24">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: `${primaryColor}15` }}>
            {searchQuery
              ? <Search className="w-9 h-9" style={{ color: primaryColor }} />
              : <UtensilsCrossed className="w-9 h-9" style={{ color: primaryColor }} />
            }
          </div>
          <p className={`text-base font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {searchQuery ? 'Menu tidak ditemukan' : 'Belum ada menu'}
          </p>
          <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : 'Menu sedang disiapkan'}
          </p>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="mt-4 text-sm font-semibold px-4 py-2 rounded-xl" style={{ color: primaryColor, backgroundColor: `${primaryColor}15` }}>
              Hapus pencarian
            </button>
          )}
        </div>
      )}

      {/* Menu list — grouped by category when no filter active */}
      {filteredMenus.length > 0 && (() => {
        const grouped = categories.length > 0 && !activeCategoryId && !searchQuery
          ? categories.map(cat => ({ cat, items: filteredMenus.filter(m => m.category_id === cat.id) })).filter(g => g.items.length > 0)
          : null
        const uncategorized = grouped
          ? filteredMenus.filter(m => !m.category_id || !categories.find(c => c.id === m.category_id))
          : []

        if (grouped) {
          return (
            <div className="space-y-12">
              {grouped.map(({ cat, items }) => (
                <section key={cat.id}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: primaryColor }} />
                    <h3 className={`text-lg font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{cat.name}</h3>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                      {items.length} item
                    </span>
                  </div>
                  <MenuCardList items={items} {...sharedProps} />
                </section>
              ))}
              {uncategorized.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: primaryColor }} />
                    <h3 className={`text-lg font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Lainnya</h3>
                  </div>
                  <MenuCardList items={uncategorized} {...sharedProps} />
                </section>
              )}
            </div>
          )
        }

        return <MenuCardList items={filteredMenus} {...sharedProps} />
      })()}

      {selected && (
        <MenuDetailModal menu={selected} primaryColor={primaryColor} showPrice={showPrice} isDark={isDark} onClose={() => setSelected(null)} />
      )}
    </>
  )
}
