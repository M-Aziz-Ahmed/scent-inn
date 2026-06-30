'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/lib/cartContext'
import CartDrawer from './CartDrawer'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { totalItems, hydrated } = useCart()

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-[#1a1a1a] text-white text-xs text-center py-2.5 px-4 tracking-wide">
        Free Delivery On All Orders Above PKR 3,000
      </div>

      <nav className="sticky top-0 z-50 bg-white border-b border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">

            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-[#1a1a1a] tracking-widest italic">
              Gullkar
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8 text-sm text-[#1a1a1a]">
              <Link href="/"        className="hover:text-[#555] transition">Home</Link>
              <Link href="/shop"    className="hover:text-[#555] transition">Catalog</Link>
              <Link href="/about"   className="hover:text-[#555] transition">About</Link>
              <Link href="/contact" className="hover:text-[#555] transition">Contact</Link>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <Link href="/shop" aria-label="Search" className="hidden md:flex text-[#1a1a1a] hover:text-[#555] transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </Link>

              {/* Cart button */}
              <button
                onClick={() => setCartOpen(true)}
                aria-label={`Open cart${totalItems > 0 ? `, ${totalItems} items` : ''}`}
                className="relative text-[#1a1a1a] hover:text-[#555] transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {hydrated && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#1a1a1a] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>

              {/* Mobile hamburger */}
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-[#1a1a1a]" aria-label="Menu">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#e5e5e5] bg-white px-4 py-4 space-y-3 text-sm text-[#1a1a1a]">
            <Link href="/"        onClick={() => setMenuOpen(false)} className="block py-1 hover:text-[#555]">Home</Link>
            <Link href="/shop"    onClick={() => setMenuOpen(false)} className="block py-1 hover:text-[#555]">Catalog</Link>
            <Link href="/about"   onClick={() => setMenuOpen(false)} className="block py-1 hover:text-[#555]">About</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="block py-1 hover:text-[#555]">Contact</Link>
          </div>
        )}
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
