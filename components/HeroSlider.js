'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const FALLBACK_SLIDES = [
  {
    _id: '1',
    name: 'Royal Oud Collection',
    heroSlideTagline: 'The Essence of Royalty',
    images: [],
    slug: 'royal-oud',
    price: 4500,
    category: 'oud',
  },
  {
    _id: '2',
    name: 'Floral Bloom',
    heroSlideTagline: 'Bloom Into Elegance',
    images: [],
    slug: 'floral-bloom',
    price: 3200,
    category: 'women',
  },
  {
    _id: '3',
    name: 'Midnight Noir',
    heroSlideTagline: 'Darkness Never Smelled So Good',
    images: [],
    slug: 'midnight-noir',
    price: 3800,
    category: 'men',
  },
]

const GRADIENT_BKGS = [
  'from-[#1a0a00] via-[#2d1a00] to-[#0a0a0a]',
  'from-[#0a001a] via-[#1a0030] to-[#0a0a0a]',
  'from-[#001a0a] via-[#002d1a] to-[#0a0a0a]',
  'from-[#1a000a] via-[#2d0015] to-[#0a0a0a]',
]

export default function HeroSlider({ slides: propSlides }) {
  const slides = propSlides?.length ? propSlides : FALLBACK_SLIDES
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const goTo = useCallback(
    (index) => {
      if (isAnimating) return
      setIsAnimating(true)
      setCurrent(index)
      setTimeout(() => setIsAnimating(false), 800)
    },
    [isAnimating]
  )

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, slides.length, goTo])
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, slides.length, goTo])

  useEffect(() => {
    if (current >= slides.length) {
      setCurrent(0)
    }
  }, [current, slides.length])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  const slide = slides[current]

  return (
    <div className="relative w-full h-[85vh] min-h-[500px] overflow-hidden">
      {/* Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${GRADIENT_BKGS[current % GRADIENT_BKGS.length]} transition-all duration-1000`}
      />

      {/* Decorative circles */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[#c9a84c]/5 blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-[#c9a84c]/8 blur-2xl" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
              key={current}
              className="animate-slide-in"
            >
              <span className="inline-block text-[#c9a84c] text-sm font-semibold tracking-[0.3em] uppercase mb-4">
                {slide.category?.replace('-', ' ')} Collection
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-4">
                {slide.name}
              </h1>
              <p className="text-xl text-gray-300 mb-2 italic">
                "{slide.heroSlideTagline || 'Discover the art of fragrance'}"
              </p>
              <p className="text-3xl font-bold text-[#c9a84c] mb-8">
                PKR {slide.price?.toLocaleString()}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/order/${slide.slug}`}
                  className="btn-gold px-8 py-4 rounded-full text-lg inline-block"
                >
                  Order Now
                </Link>
                <Link
                  href={`/shop/${slide.slug}`}
                  className="btn-outline-gold px-8 py-4 rounded-full text-lg inline-block"
                >
                  View Details
                </Link>
              </div>
            </div>

            {/* Product image placeholder / image */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative">
                <div className="w-72 h-96 rounded-2xl bg-gradient-to-b from-[#c9a84c]/20 to-[#c9a84c]/5 border border-[#c9a84c]/30 flex items-center justify-center">
                  {slide.images?.[0] ? (
                    <img
                      src={slide.images[0]}
                      alt={slide.name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="text-center p-8">
                      <div className="text-8xl mb-4">🌹</div>
                      <p className="text-[#c9a84c] font-semibold">{slide.name}</p>
                    </div>
                  )}
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center">
                  <span className="text-[#c9a84c] text-xs font-bold text-center leading-tight">
                    LUXURY<br />SCENT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/40 border border-[#c9a84c]/40 flex items-center justify-center hover:bg-[#c9a84c]/20 transition"
      >
        <svg className="w-5 h-5 text-[#c9a84c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/40 border border-[#c9a84c]/40 flex items-center justify-center hover:bg-[#c9a84c]/20 transition"
      >
        <svg className="w-5 h-5 text-[#c9a84c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current ? 'w-8 h-2 bg-[#c9a84c]' : 'w-2 h-2 bg-[#c9a84c]/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
