import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Menu, ShoppingBag, Heart, Moon, Sun, ChevronDown, Sparkles, Cpu, Monitor, Camera, Gamepad2, Headphones, Watch, Tv, Smartphone, Laptop, Tablet, ArrowRight, ShieldCheck } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import type { Product } from './types/product'
import { useThemeStore } from './stores/themeStore'
import { useWishlistStore } from './stores/wishlistStore'
import { useCartStore } from './stores/cartStore'
import { ProductCard } from './components/ProductCard'
import { CartDrawer } from './components/CartDrawer'
import { Dialog, DialogContent } from './components/ui/dialog'
import { Button } from './components/ui/button'

const categories = [
  { name: 'Smartphones', icon: Smartphone },
  { name: 'Laptops', icon: Laptop },
  { name: 'Tablets', icon: Tablet },
  { name: 'VR', icon: Monitor },
  { name: 'Smart Watches', icon: Watch },
  { name: 'Smart TVs', icon: Tv },
  { name: 'Headphones', icon: Headphones },
  { name: 'Cameras', icon: Camera },
  { name: 'Gaming', icon: Gamepad2 },
  { name: 'Accessories', icon: Cpu },
]

const featuredDeals = ['Free 2-year warranty', 'Instant trade-in', 'Next-day delivery']

function normalizeText(value: string | null | undefined) {
  return (value ?? '').toString().toLowerCase()
}

function App() {
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const wishlistCount = useWishlistStore((state) => state.items.length)
  const cartItems = useCartStore((state) => state.items)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [priceRange, setPriceRange] = useState(1000)
  const [rating, setRating] = useState(0)
  const [availability, setAvailability] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.body.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
  }, [theme])

  const { data, isLoading, error } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('https://dummyjson.com/products?limit=40')
      if (!response.ok) throw new Error('Failed to load products')
      const json = await response.json()
      return json.products as Product[]
    },
  })

  const products = useMemo(() => {
    const source = data ?? []
    const normalized = source.filter((product) => {
      const searchableText = `${normalizeText(product.category)} ${normalizeText(product.title)} ${normalizeText(product.brand)}`
      return ['smartphones', 'laptops', 'tablets', 'watches', 'headphones', 'tv', 'monitor', 'camera', 'gaming', 'accessories', 'electronics', 'audio', 'wearable'].some((keyword) =>
        searchableText.includes(keyword),
      )
    })

    return normalized
      .filter((product) => {
        const searchText = `${normalizeText(product.title)} ${normalizeText(product.brand)} ${normalizeText(product.category)}`
        const matchesSearch = searchText.includes(normalizeText(search))
        const categoryText = `${normalizeText(product.category)} ${normalizeText(product.title)}`
        const matchesCategory = category === 'All' || categoryText.includes(normalizeText(category))
        const matchesPrice = product.price <= priceRange
        const matchesRating = product.rating >= rating
        const matchesAvailability = availability === 'all' ? true : availability === 'in-stock' ? product.stock > 0 : product.stock === 0
        return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesAvailability
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.price - b.price
          case 'price-high':
            return b.price - a.price
          case 'rating':
            return b.rating - a.rating
          case 'newest':
            return b.id - a.id
          default:
            return b.discountPercentage - a.discountPercentage
        }
      })
  }, [data, search, category, priceRange, rating, availability, sortBy])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.16),_transparent_25%)] text-zinc-900 transition-colors duration-300 dark:text-zinc-100">
      <header className="sticky top-0 z-40 border-b border-white/30 bg-white/60 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/60">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 text-white shadow-lg shadow-cyan-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold">Smart Store</p>
              <p className="text-xs text-zinc-500">Premium electronics</p>
            </div>
          </div>

          <div className="ml-4 flex flex-1 items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
            <Search className="h-4 w-4 text-zinc-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search products" placeholder="Search phones, laptops, audio..." className="w-full bg-transparent text-sm outline-none" />
            <div className="hidden items-center gap-2 rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-600 md:flex dark:bg-zinc-800 dark:text-zinc-300">
              <span>All</span>
              <ChevronDown className="h-3 w-3" />
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <button type="button" aria-label="Wishlist" className="relative rounded-full border border-zinc-200 p-2.5 transition hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 ? <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">{wishlistCount}</span> : null}
            </button>
            <button type="button" onClick={() => setCartOpen(true)} className="relative rounded-full border border-zinc-200 p-2.5 transition hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800">
              <ShoppingBag className="h-5 w-5" />
              {cartItems.length > 0 ? <span className="absolute -right-1 -top-1 rounded-full bg-cyan-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">{cartItems.length}</span> : null}
            </button>
            <Button onClick={toggleTheme} className="rounded-full border border-zinc-200 bg-white/70 p-2.5 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-200">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>

          <button type="button" className="rounded-full border border-zinc-200 p-2.5 md:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 lg:px-8 lg:py-10">
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[32px] border border-white/50 bg-gradient-to-br from-white via-cyan-50/70 to-blue-100/70 p-6 shadow-[0_40px_120px_-40px_rgba(59,130,246,0.4)] dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/50 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-700 dark:text-cyan-300">
                <Sparkles className="h-4 w-4" /> New collection • 2026 flagship tech
              </div>
              <div className="space-y-4">
                <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">Future-ready devices for the modern life.</h1>
                <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-300">Discover premium smartphones, immersive displays, next-gen audio, and sleek accessories curated for performance and style.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-white shadow-lg shadow-cyan-500/20 hover:opacity-90">Shop now <ArrowRight className="ml-2 h-4 w-4" /></Button>
                <Button className="border border-zinc-300 bg-white/70 px-5 py-3 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950/70 dark:text-zinc-200">Explore deals</Button>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-zinc-600 dark:text-zinc-300">
                {featuredDeals.map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-full bg-white/60 px-3 py-2 dark:bg-zinc-800/60">
                    <ShieldCheck className="h-4 w-4 text-cyan-500" /> {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative rounded-[28px] border border-white/60 bg-white/60 p-4 shadow-2xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
              <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.25),_transparent_30%)]" />
              <div className="relative space-y-4">
                <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80" alt="Premium electronics showcase" className="h-72 w-full rounded-[24px] object-cover" />
                <div className="grid gap-3 sm:grid-cols-3">
                  {['AI-powered performance', 'Studio-grade sound', 'Ultra-slim design'].map((text) => (
                    <div key={text} className="rounded-2xl border border-zinc-200 bg-white/80 p-3 text-sm font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-200">
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-600">Categories</p>
              <h2 className="text-2xl font-semibold">Shop by category</h2>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((categoryItem) => {
              const Icon = categoryItem.icon
              return (
                <motion.button
                  key={categoryItem.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => setCategory(categoryItem.name)}
                  className="rounded-[24px] border border-zinc-200 bg-white/80 p-4 text-left shadow-sm transition hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/80"
                >
                  <div className="mb-3 inline-flex rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-3 text-cyan-600 dark:text-cyan-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium">{categoryItem.name}</h3>
                  <p className="mt-1 text-sm text-zinc-500">Premium picks</p>
                </motion.button>
              )
            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-[28px] border border-zinc-200 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button type="button" onClick={() => { setCategory('All'); setPriceRange(1000); setRating(0); setAvailability('all'); setSortBy('featured') }} className="text-sm text-cyan-600">Reset</button>
            </div>

            <div className="mt-4 space-y-4">
              <label className="block text-sm font-medium">
                Category
                <select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 w-full rounded-2xl border border-zinc-200 bg-transparent p-2.5 dark:border-zinc-700">
                  <option value="All">All</option>
                  <option value="Smartphones">Smartphones</option>
                  <option value="Laptop">Laptops</option>
                  <option value="Tablet">Tablets</option>
                  <option value="Watch">Smart Watches</option>
                  <option value="TV">Smart TVs</option>
                  <option value="Headphone">Headphones</option>
                  <option value="Camera">Cameras</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Accessory">Accessories</option>
                </select>
              </label>

              <label className="block text-sm font-medium">
                Price range
                <input type="range" min="20" max="1000" value={priceRange} onChange={(event) => setPriceRange(Number(event.target.value))} className="mt-2 w-full accent-cyan-500" />
                <span className="text-xs text-zinc-500">Up to ${priceRange}</span>
              </label>

              <label className="block text-sm font-medium">
                Minimum rating
                <select value={rating} onChange={(event) => setRating(Number(event.target.value))} className="mt-2 w-full rounded-2xl border border-zinc-200 bg-transparent p-2.5 dark:border-zinc-700">
                  <option value={0}>Any</option>
                  <option value={3}>3★ +</option>
                  <option value={4}>4★ +</option>
                  <option value={4.5}>4.5★ +</option>
                </select>
              </label>

              <label className="block text-sm font-medium">
                Availability
                <select value={availability} onChange={(event) => setAvailability(event.target.value)} className="mt-2 w-full rounded-2xl border border-zinc-200 bg-transparent p-2.5 dark:border-zinc-700">
                  <option value="all">All</option>
                  <option value="in-stock">In stock</option>
                  <option value="out">Out of stock</option>
                </select>
              </label>

              <label className="block text-sm font-medium">
                Sort by
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="mt-2 w-full rounded-2xl border border-zinc-200 bg-transparent p-2.5 dark:border-zinc-700">
                  <option value="featured">Featured</option>
                  <option value="price-low">Price Low → High</option>
                  <option value="price-high">Price High → Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </label>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-[28px] border border-zinc-200 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-4 shadow-sm dark:border-zinc-800">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-600">Featured deals</p>
                  <h3 className="text-xl font-semibold">Save on premium electronics this week</h3>
                </div>
                <div className="rounded-full border border-cyan-400/50 bg-white/70 px-3 py-2 text-sm font-medium text-cyan-700 dark:bg-zinc-900/70 dark:text-cyan-300">Ends in 04:21:09</div>
              </div>
            </div>

            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="animate-pulse rounded-[24px] border border-zinc-200 bg-white/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/70">
                    <div className="h-40 rounded-[20px] bg-zinc-200 dark:bg-zinc-800" />
                    <div className="mt-4 h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-8 text-center text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">Unable to load products right now. Please try again later.</div>
            ) : products.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-zinc-300 p-10 text-center text-zinc-500 dark:border-zinc-700">No products match your filters. Try broadening the search.</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} onQuickView={setSelectedProduct} />
                ))}
              </div>
            )}
          </section>
        </section>
      </main>

      <footer className="border-t border-zinc-200 bg-white/70 px-4 py-10 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">TechHub</p>
                <p className="text-sm text-zinc-500">Premium electronics</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">Elevated devices and accessories for work, play, and every day.</p>
          </div>
          <div>
            <h4 className="font-semibold">Categories</h4>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
              {['Smartphones', 'Laptops', 'Audio', 'Gaming', 'Displays'].map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
              <li>hello@techhub.com</li>
              <li>+1 (800) 555-0142</li>
              <li>Mon — Fri • 8am — 8pm</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Follow</h4>
            <div className="mt-3 flex gap-3 text-zinc-600 dark:text-zinc-300">
              <span className="rounded-full border border-zinc-200 p-2 dark:border-zinc-800">IG</span>
              <span className="rounded-full border border-zinc-200 p-2 dark:border-zinc-800">X</span>
              <span className="rounded-full border border-zinc-200 p-2 dark:border-zinc-800">YT</span>
            </div>
          </div>
        </div>
      </footer>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <Dialog open={Boolean(selectedProduct)} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        {selectedProduct ? (
          <DialogContent className="max-w-4xl overflow-hidden p-0">
            <div className="grid gap-0 lg:grid-cols-[1fr_0.9fr]">
              <img src={selectedProduct.images[0] ?? selectedProduct.thumbnail} alt={selectedProduct.title} className="h-full max-h-[480px] w-full object-cover" />
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-cyan-600">{selectedProduct.category}</p>
                    <h3 className="text-2xl font-semibold">{selectedProduct.title}</h3>
                  </div>
                  <div className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-semibold text-cyan-700 dark:text-cyan-300">{selectedProduct.discountPercentage.toFixed(0)}% off</div>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">{selectedProduct.description}</p>
                <div className="flex flex-wrap gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                  <span className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-800">Brand: {selectedProduct.brand}</span>
                  <span className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-800">Rating: {selectedProduct.rating.toFixed(1)} ★</span>
                  <span className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-800">Stock: {selectedProduct.stock}</span>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-3xl font-semibold">${selectedProduct.price.toFixed(2)}</p>
                  <p className="text-sm text-zinc-500">Save ${(selectedProduct.price * (selectedProduct.discountPercentage / 100)).toFixed(2)}</p>
                </div>
                <Button onClick={() => useCartStore.getState().addToCart(selectedProduct)} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white">Add to cart</Button>
              </div>
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
    </div>
  )
}

export default App
