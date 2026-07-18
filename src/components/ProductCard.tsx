import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Eye } from 'lucide-react'
import { useWishlistStore } from '../stores/wishlistStore'
import { useCartStore } from '../stores/cartStore'
import type { Product } from '../types/product'
import { Button } from './ui/button'

interface ProductCardProps {
  product: Product
  onQuickView: (product: Product) => void
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const wishlist = useWishlistStore((state) => state.items)
  const toggleItem = useWishlistStore((state) => state.toggleItem)
  const addToCart = useCartStore((state) => state.addToCart)
  const isWishlisted = wishlist.some((item) => item.id === product.id)

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="group overflow-hidden rounded-[24px] border border-zinc-200/70 bg-white/80 p-3 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.25)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80"
    >
      <div className="relative overflow-hidden rounded-[20px]">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className="h-48 w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute left-3 top-3 rounded-full bg-cyan-500/90 px-3 py-1 text-xs font-semibold text-white">
          {product.discountPercentage.toFixed(0)}% off
        </div>
        <button
          type="button"
          aria-label="Toggle wishlist"
          onClick={() => toggleItem(product)}
          className={`absolute right-3 top-3 rounded-full p-2 transition ${isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/80 text-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200'}`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-zinc-500">{product.brand}</p>
            <h3 className="line-clamp-2 font-semibold text-zinc-900 dark:text-zinc-100">{product.title}</h3>
          </div>
          <div className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            ★ {product.rating.toFixed(1)}
          </div>
        </div>

        <p className="line-clamp-2 text-sm text-zinc-500">{product.description}</p>

        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 dark:bg-zinc-800">{product.category}</span>
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 dark:bg-zinc-800">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">${product.price.toFixed(2)}</p>
            <p className="text-sm text-zinc-500">Save ${(product.price * (product.discountPercentage / 100)).toFixed(2)}</p>
          </div>
          <Button onClick={() => addToCart(product)} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90">
            <ShoppingCart className="mr-2 h-4 w-4" /> Add
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onQuickView(product)} className="flex-1 border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200">
            <Eye className="mr-2 h-4 w-4" /> Quick View
          </Button>
        </div>
      </div>
    </motion.article>
  )
}
