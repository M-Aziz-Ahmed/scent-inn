'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const FALLBACK_SLIDES = [
  {
    _id: '1',
    name: 'Summer Kurta Collection',
    heroSlideTagline: 'Wear Your Identity',
    images: [],
    slug: 'summer-kurta',
    price: 2500,
    category: 'men',
  },
  {
    _id: '2',
    name: 'Lawn Embroidered',
    heroSlideTagline: 'Elegance in Every Thread',
    images: [],
    slug: 'lawn-embroidered',
    price: 3200,
    category: 'women',
  },
  {
    _id: '3',
    name: 'Kids Festive Wear',
    heroSlideTagline: 'Dressed for Every Occasion',
    images: [],
    slug: 'kids-festive',
    price: 1800,
    category: 'kids',
  },
]

const GRADIENT_BKGS = [
  'from-[#0f2318] via-[#1a3c2e] to-[#0a0f0d]',
  'from-[#1a1200] via-[#2d2000] to-[#0a0f0d]',
  'from-[#0f2318] via-[#0a2018] to-[#0a0f0d]',
  'from-[#1a0e00] via-[#1a3c2e] to-[#0a0f0d]',
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
    if (current >= slides.length) setCurrent(0)
  }, [current, slides.length])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  const slide = slides[current]

  return (
    <div className={`relative w-full overflow-hidden bg-linear-to-br ${GRADIENT_BKGS[current % GRADIENT_BKGS.length]} transition-colors duration-1000`}>

      {/* ── MOBILE layout (< lg) ── image on top, text below ─────── */}
      <div className="lg:hidden flex flex-col">

        {/* Image */}
        <div className="relative w-full h-[55vw] min-h-60 max-h-95 overflow-hidden">
          {slide.images?.[0] ? (
            <img
              src={slide.images[0]}
              alt={slide.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#111]">
              <span className="text-7xl">👗</span>
            </div>
          )}
          {/* subtle gradient fade into text area below */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-[#0a0a0a] to-transparent" />
        </div>

        {/* Text */}
        <div className="px-5 pt-4 pb-10 text-center">
          <span className="inline-block text-[#c9a84c] text-xs font-semibold tracking-[0.25em] uppercase mb-2">
            {slide.category?.replace('-', ' ')} Collection
          </span>
          <h1 className="text-3xl font-bold text-white leading-tight mb-2">
            {slide.name}
          </h1>
          <p className="text-sm text-gray-300 italic mb-2">
            &ldquo;{slide.heroSlideTagline || 'Wear Your Identity'}&rdquo;
          </p>
          <p className="text-2xl font-bold text-[#c9a84c] mb-5">
            PKR {slide.price?.toLocaleString()}
          </p>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <Link
              href={`/order/${slide.slug}`}
              className="btn-gold w-full py-3 rounded-full text-base font-semibold text-center"
            >
              Order Now
            </Link>
            <Link
              href={`/shop/${slide.slug}`}
              className="btn-outline-gold w-full py-3 rounded-full text-base text-center"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>

      {/* ── DESKTOP layout (lg+) ── two columns ──────────────────── */}
      <div className="hidden lg:flex items-center min-h-[85vh]">
        {/* Decorative blobs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[#c9a84c]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-[#c9a84c]/8 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid grid-cols-2 gap-10 items-center">
            {/* Text */}
            <div key={current} className="animate-slide-in">
              <span className="inline-block text-[#c9a84c] text-sm font-semibold tracking-[0.3em] uppercase mb-4">
                {slide.category?.replace('-', ' ')} Collection
              </span>
              <h1 className="text-5xl xl:text-7xl font-bold text-white leading-tight mb-4">
                {slide.name}
              </h1>
              <p className="text-xl text-gray-300 mb-3 italic">
                &ldquo;{slide.heroSlideTagline || 'Wear Your Identity'}&rdquo;
              </p>
              <p className="text-3xl font-bold text-[#c9a84c] mb-8">
                PKR {slide.price?.toLocaleString()}
              </p>
              <div className="flex gap-3">
                <Link
                  href={`/order/${slide.slug}`}
                  className="btn-gold px-8 py-3 rounded-full text-lg"
                >
                  Order Now
                </Link>
                <Link
                  href={`/shop/${slide.slug}`}
                  className="btn-outline-gold px-8 py-3 rounded-full text-lg"
                >
                  View Details
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="w-full h-130 rounded-4xl border border-[#c9a84c]/30 overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
                  {slide.images?.[0] ? (
                    <img
                      src={slide.images[0]}
                      alt={slide.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-4 bg-[#111] text-center px-6">
                      <div className="text-8xl">👗</div>
                      <p className="text-xl font-semibold text-[#c9a84c]">{slide.name}</p>
                    </div>
                  )}
                </div>
                {/* Badge */}
                <div className="absolute -top-4 right-4 w-20 h-20 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center">
                  <span className="text-[#c9a84c] text-[0.6rem] font-bold text-center leading-tight">
                    GULLKAR<br />STYLE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Prev / Next arrows ── hidden on very small screens ─────── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/40 border border-[#c9a84c]/40 flex items-center justify-center hover:bg-[#c9a84c]/20 transition"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#c9a84c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/40 border border-[#c9a84c]/40 flex items-center justify-center hover:bg-[#c9a84c]/20 transition"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#c9a84c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* ── Dots ──────────────────────────────────────────────────── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              i === current ? 'w-6 h-2 bg-[#c9a84c]' : 'w-2 h-2 bg-[#c9a84c]/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
