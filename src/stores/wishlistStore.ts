import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '../types/product'

interface WishlistState {
  items: Product[]
  toggleItem: (product: Product) => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (product) => {
        const exists = get().items.some((item) => item.id === product.id)
        set({ items: exists ? get().items.filter((item) => item.id !== product.id) : [...get().items, product] })
      },
    }),
    { name: 'tech-hub-wishlist' },
  ),
)
