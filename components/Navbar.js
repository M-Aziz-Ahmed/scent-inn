'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0f0d]/95 backdrop-blur-sm border-b border-[#c9a84c]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold gold-text tracking-widest">
            GULLKAR
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm">
            <Link href="/" className="hover:text-[#c9a84c] transition">Home</Link>
            <Link href="/shop" className="hover:text-[#c9a84c] transition">Shop</Link>
            <Link href="/about" className="hover:text-[#c9a84c] transition">About</Link>
            <Link href="/contact" className="hover:text-[#c9a84c] transition">Contact</Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#c9a84c]"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-[#c9a84c]/20 text-sm">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#c9a84c] transition">Home</Link>
            <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#c9a84c] transition">Shop</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#c9a84c] transition">About</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#c9a84c] transition">Contact</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
