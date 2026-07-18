import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '../types/product'

export interface CartItem extends Product {
  quantity: number
}

interface CartState {
  items: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (id: number) => void
  increaseQuantity: (id: number) => void
  decreaseQuantity: (id: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addToCart: (product) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id)
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
              ),
            }
          }
          return { items: [...state.items, { ...product, quantity: 1 }] }
        }),
      removeFromCart: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      increaseQuantity: (id) =>
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)),
        })),
      decreaseQuantity: (id) =>
        set((state) => ({
          items: state.items
            .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
            .filter((item) => item.quantity > 0),
        })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'tech-hub-cart' },
  ),
)
