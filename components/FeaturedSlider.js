'use client'
import { useRef } from 'react'
import ProductCard from './ProductCard'
import Link from 'next/link'

export default function FeaturedSlider({ products, title, viewAllHref = '/shop' }) {
  const ref = useRef(null)
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })

  if (!products?.length) return null

  return (
    <section className="py-10 border-b border-[#e5e5e5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#1a1a1a]">{title}</h2>
          <div className="flex items-center gap-4">
            <Link href={viewAllHref} className="text-xs text-[#555] underline underline-offset-2 hover:text-[#1a1a1a] transition">
              View all
            </Link>
            <div className="flex gap-1">
              <button onClick={() => scroll(-1)} className="w-7 h-7 border border-[#e5e5e5] flex items-center justify-center hover:border-[#1a1a1a] transition">
                <svg className="w-3.5 h-3.5 text-[#1a1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button onClick={() => scroll(1)} className="w-7 h-7 border border-[#e5e5e5] flex items-center justify-center hover:border-[#1a1a1a] transition">
                <svg className="w-3.5 h-3.5 text-[#1a1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div
          ref={ref}
          className="flex gap-4 overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product._id} className="flex-none w-52 sm:w-60">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
