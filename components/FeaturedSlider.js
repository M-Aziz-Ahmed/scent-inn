'use client'
import { useRef } from 'react'
import ProductCard from './ProductCard'

export default function FeaturedSlider({ products, title }) {
  const sliderRef = useRef(null)

  const scroll = (dir) => {
    if (!sliderRef.current) return
    sliderRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  if (!products?.length) return null

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">{title}</h2>
            <div className="w-16 h-1 bg-[#c9a84c] mt-2 rounded-full" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll(-1)}
              className="w-10 h-10 rounded-full border border-[#c9a84c]/40 flex items-center justify-center hover:bg-[#c9a84c]/10 transition text-[#c9a84c]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-10 h-10 rounded-full border border-[#c9a84c]/40 flex items-center justify-center hover:bg-[#c9a84c]/10 transition text-[#c9a84c]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product._id} className="flex-none w-64">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
