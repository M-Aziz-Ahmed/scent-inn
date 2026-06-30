'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])   // [{ _id, name, price, image, slug, size, color, qty }]
  const [hydrated, setHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('gullkar_cart')
      if (stored) setItems(JSON.parse(stored))
    } catch {}
    setHydrated(true)
  }, [])

  // Persist on change
  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem('gullkar_cart', JSON.stringify(items))
  }, [items, hydrated])

  function addItem(product, qty = 1, size = '', color = '') {
    setItems((prev) => {
      const key = `${product._id}__${size}__${color}`
      const existing = prev.find((i) => i.key === key)
      if (existing) {
        return prev.map((i) => i.key === key ? { ...i, qty: i.qty + qty } : i)
      }
      return [
        ...prev,
        {
          key,
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || '',
          slug: product.slug,
          size,
          color,
          qty,
        },
      ]
    })
  }

  function updateQty(key, qty) {
    if (qty < 1) return removeItem(key)
    setItems((prev) => prev.map((i) => i.key === key ? { ...i, qty } : i))
  }

  function removeItem(key) {
    setItems((prev) => prev.filter((i) => i.key !== key))
  }

  function clearCart() {
    setItems([])
  }

  const totalItems = items.reduce((s, i) => s + i.qty, 0)
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clearCart, totalItems, subtotal, hydrated }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
