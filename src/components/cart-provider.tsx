'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import type { Database } from '@/types/database.types'

type Menu = Database['public']['Tables']['menus']['Row']

export interface CartItem {
  menu: Menu
  qty: number
}

interface CartContextValue {
  items: CartItem[]
  add: (menu: Menu) => void
  remove: (menuId: string) => void
  increment: (menuId: string) => void
  decrement: (menuId: string) => void
  clear: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'mymenu_cart'

export function CartProvider({ children, storeId }: { children: ReactNode; storeId?: string }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage on mount, scoped to storeId
  useEffect(() => {
    const storageKey = storeId ? `${STORAGE_KEY}_${storeId}` : STORAGE_KEY
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setItems(parsed)
      }
    } catch { /* ignore */ }
    setHydrated(true)
  }, [storeId])

  // Persist to localStorage on every change (after hydration)
  useEffect(() => {
    if (!hydrated) return
    const storageKey = storeId ? `${STORAGE_KEY}_${storeId}` : STORAGE_KEY
    try {
      if (items.length === 0) {
        localStorage.removeItem(storageKey)
      } else {
        localStorage.setItem(storageKey, JSON.stringify(items))
      }
    } catch { /* ignore */ }
  }, [items, hydrated, storeId])

  const add = useCallback((menu: Menu) => {
    setItems(prev => {
      const existing = prev.find(i => i.menu.id === menu.id)
      if (existing) return prev.map(i => i.menu.id === menu.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { menu, qty: 1 }]
    })
  }, [])

  const remove = useCallback((menuId: string) => {
    setItems(prev => prev.filter(i => i.menu.id !== menuId))
  }, [])

  const increment = useCallback((menuId: string) => {
    setItems(prev => prev.map(i => i.menu.id === menuId ? { ...i, qty: i.qty + 1 } : i))
  }, [])

  const decrement = useCallback((menuId: string) => {
    setItems(prev => {
      const item = prev.find(i => i.menu.id === menuId)
      if (!item) return prev
      if (item.qty <= 1) return prev.filter(i => i.menu.id !== menuId)
      return prev.map(i => i.menu.id === menuId ? { ...i, qty: i.qty - 1 } : i)
    })
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const total = items.reduce((s, i) => s + i.menu.price * i.qty, 0)
  const count = items.reduce((s, i) => s + i.qty, 0)

  return (
    <CartContext.Provider value={{ items, add, remove, increment, decrement, clear, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
