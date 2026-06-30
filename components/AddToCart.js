'use client'
import { useState } from 'react'
import { useCart } from '@/lib/cartContext'

/**
 * AddToCart button — can be minimal (just icon, for ProductCard)
 * or full (size/color pickers + qty, for product detail page).
 *
 * Props:
 *   product  — the product object
 *   variant  — 'minimal' | 'full'  (default: 'minimal')
 */
export default function AddToCart({ product, variant = 'minimal' }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '')
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '')
  const [qty, setQty] = useState(1)

  function handleAdd() {
    addItem(product, qty, selectedSize, selectedColor)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  if (variant === 'minimal') {
    return (
      <button
        onClick={(e) => { e.preventDefault(); handleAdd() }}
        disabled={!product.inStock}
        aria-label="Add to cart"
        className={`w-8 h-8 border flex items-center justify-center shrink-0 transition ${
          added
            ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
            : 'border-[#e5e5e5] text-[#1a1a1a] hover:border-[#1a1a1a]'
        } disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        {added ? (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
        )}
      </button>
    )
  }

  // Full variant — for product detail page
  return (
    <div className="space-y-4">
      {/* Size picker */}
      {product.sizes?.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest text-[#999] mb-2">Size</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button key={s} onClick={() => setSelectedSize(s)}
                className={`border text-xs px-3 py-1.5 transition ${
                  selectedSize === s ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white' : 'border-[#e5e5e5] text-[#1a1a1a] hover:border-[#1a1a1a]'
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color picker */}
      {product.colors?.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest text-[#999] mb-2">Color</p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button key={c} onClick={() => setSelectedColor(c)}
                className={`border text-xs px-3 py-1.5 transition capitalize ${
                  selectedColor === c ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white' : 'border-[#e5e5e5] text-[#555] hover:border-[#1a1a1a]'
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-[#e5e5e5]">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-9 h-9 flex items-center justify-center text-[#555] hover:bg-[#f5f5f5] transition">−</button>
          <span className="w-9 text-center text-sm text-[#1a1a1a] font-medium">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)}
            className="w-9 h-9 flex items-center justify-center text-[#555] hover:bg-[#f5f5f5] transition">+</button>
        </div>
        <span className="text-xs text-[#999]">{product.inStock ? 'In stock' : 'Sold out'}</span>
      </div>

      {/* Add button */}
      <button
        onClick={handleAdd}
        disabled={!product.inStock}
        className={`w-full text-sm font-medium py-3.5 transition ${
          added
            ? 'bg-green-600 text-white'
            : 'bg-[#1a1a1a] text-white hover:bg-[#333]'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {added ? '✓ Added to Cart' : product.inStock ? 'Add to Cart' : 'Sold Out'}
      </button>
    </div>
  )
}
