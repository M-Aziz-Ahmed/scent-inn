'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cartContext'

export default function CartDrawer({ open, onClose }) {
  const { items, updateQty, removeItem, totalItems, subtotal } = useCart()

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e5e5]">
          <h2 className="text-sm font-semibold text-[#1a1a1a] uppercase tracking-wider">
            Cart {totalItems > 0 && <span className="text-[#999] font-normal">({totalItems})</span>}
          </h2>
          <button onClick={onClose} aria-label="Close cart" className="text-[#999] hover:text-[#1a1a1a] transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <svg className="w-12 h-12 text-[#e5e5e5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-sm text-[#999]">Your cart is empty</p>
              <button onClick={onClose} className="text-xs underline text-[#555] hover:text-[#1a1a1a]">
                Continue shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.key} className="flex gap-4">
                {/* Image */}
                <Link href={`/shop/${item.slug}`} onClick={onClose} className="shrink-0 w-20 h-24 bg-[#f5f5f5] overflow-hidden">
                  {item.image
                    ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl opacity-20">👗</div>}
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link href={`/shop/${item.slug}`} onClick={onClose}>
                    <p className="text-sm font-medium text-[#1a1a1a] hover:underline line-clamp-2 leading-snug">{item.name}</p>
                  </Link>
                  <div className="flex gap-2 mt-0.5">
                    {item.size && <p className="text-xs text-[#999]">Size: {item.size}</p>}
                    {item.color && <p className="text-xs text-[#999]">Color: {item.color}</p>}
                  </div>
                  <p className="text-sm font-semibold text-[#1a1a1a] mt-1">
                    PKR {(item.price * item.qty).toLocaleString()}
                  </p>

                  {/* Qty + remove */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-[#e5e5e5]">
                      <button
                        onClick={() => updateQty(item.key, item.qty - 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#555] hover:bg-[#f5f5f5] transition text-base"
                        aria-label="Decrease quantity"
                      >−</button>
                      <span className="w-7 text-center text-xs font-medium text-[#1a1a1a]">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.key, item.qty + 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#555] hover:bg-[#f5f5f5] transition text-base"
                        aria-label="Increase quantity"
                      >+</button>
                    </div>
                    <button
                      onClick={() => removeItem(item.key)}
                      className="text-xs text-[#bbb] hover:text-red-500 transition underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#e5e5e5] px-5 py-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#555]">Subtotal</span>
              <span className="font-semibold text-[#1a1a1a]">PKR {subtotal.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-[#bbb]">Shipping calculated at checkout</p>
            <Link
              href="/cart/checkout"
              onClick={onClose}
              className="block w-full bg-[#1a1a1a] text-white text-sm font-medium text-center py-3.5 hover:bg-[#333] transition"
            >
              Checkout — PKR {subtotal.toLocaleString()}
            </Link>
            <button
              onClick={onClose}
              className="block w-full border border-[#e5e5e5] text-[#555] text-sm py-3 hover:border-[#1a1a1a] transition"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
