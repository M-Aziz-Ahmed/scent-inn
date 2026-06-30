'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const FALLBACK_SLIDES = [
  { _id: '1', name: 'The Ease Edit', heroSlideTagline: '', images: [], slug: 'ease-edit', price: 2500, category: 'women' },
  { _id: '2', name: 'Summer Kurta', heroSlideTagline: '', images: [], slug: 'summer-kurta', price: 2200, category: 'men' },
  { _id: '3', name: 'Kids Festive Wear', heroSlideTagline: '', images: [], slug: 'kids-festive', price: 1800, category: 'kids' },
]

export default function HeroSlider({ slides: propSlides }) {
  const slides = propSlides?.length ? propSlides : FALLBACK_SLIDES
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const goTo = useCallback((i) => setCurrent((i + slides.length) % slides.length), [slides.length])
  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    if (paused) return
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [next, paused])

  const slide = slides[current]

  return (
    <div
      className="relative w-full overflow-hidden bg-[#f5f5f5]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Full-width image */}
      <div className="relative w-full h-[55vw] min-h-72 max-h-150">
        {slide.images?.[0] ? (
          <img
            key={slide._id}
            src={slide.images[0]}
            alt={slide.name}
            className="w-full h-full object-cover animate-slide-in"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#efefef]">
            <span className="text-8xl opacity-20">👗</span>
          </div>
        )}

        {/* Text overlay — right side on desktop, bottom on mobile */}
        <div className="absolute inset-0 flex items-center justify-end">
          <div className="mr-[8%] text-right max-w-xs">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1a1a1a] leading-tight mb-5 drop-shadow-sm">
              {slide.name}
            </h2>
            <Link
              href={`/shop${slide.slug ? `/${slide.slug}` : ''}`}
              className="inline-block bg-[#1a1a1a] text-white text-sm font-medium px-6 py-3 hover:bg-[#333] transition"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Controls bar — below image like Yasra */}
      <div className="flex items-center justify-center gap-4 py-3 bg-white border-b border-[#e5e5e5]">
        <button onClick={prev} aria-label="Previous" className="text-[#1a1a1a] hover:text-[#555] transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-5 h-1.5 bg-[#1a1a1a]' : 'w-1.5 h-1.5 bg-[#ccc]'
              }`}
            />
          ))}
        </div>

        <button onClick={next} aria-label="Next" className="text-[#1a1a1a] hover:text-[#555] transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button
          onClick={() => setPaused(!paused)}
          aria-label={paused ? 'Play' : 'Pause'}
          className="text-[#aaa] hover:text-[#555] transition ml-2"
        >
          {paused ? (
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
