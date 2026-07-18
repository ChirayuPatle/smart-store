import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2 } from 'lucide-react'
import { useCartStore } from '../stores/cartStore'
import { Button } from './ui/button'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const items = useCartStore((state) => state.items)
  const increaseQuantity = useCartStore((state) => state.increaseQuantity)
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity)
  const removeFromCart = useCartStore((state) => state.removeFromCart)

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + 49

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 140, damping: 24 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
              <div>
                <p className="text-sm text-zinc-500">Your cart</p>
                <h2 className="text-xl font-semibold">{items.length} items</h2>
              </div>
              <button type="button" aria-label="Close cart" onClick={onClose} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-zinc-500 dark:border-zinc-700">
                  Your cart is empty. Add premium gear to get started.
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-zinc-200 p-3 dark:border-zinc-800">
                    <div className="flex gap-3">
                      <img src={item.thumbnail} alt={item.title} className="h-20 w-20 rounded-xl object-cover" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold">{item.title}</p>
                            <p className="text-sm text-zinc-500">${item.price.toFixed(2)}</p>
                          </div>
                          <button type="button" onClick={() => removeFromCart(item.id)} className="rounded-full p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-full border border-zinc-200 p-1 dark:border-zinc-700">
                            <button type="button" onClick={() => decreaseQuantity(item.id)} className="rounded-full p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                            <button type="button" onClick={() => increaseQuantity(item.id)} className="rounded-full p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-zinc-200 p-5 dark:border-zinc-800">
              <div className="flex items-center justify-between text-sm text-zinc-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-zinc-500">
                <span>Shipping</span>
                <span>$49.00</span>
              </div>
              <div className="mt-4 flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button className="mt-4 w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90">Checkout</Button>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}
