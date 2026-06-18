'use client'
import { useState } from 'react'

export default function ProductImageGallery({ images, name }) {
  const [active, setActive] = useState(0)

  const hasImages = images?.length > 0

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl bg-linear-to-b from-[#1a1a1a] to-[#111] border border-[#c9a84c]/20 overflow-hidden group">
        {hasImages ? (
          <>
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${name} ${i + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  i === active ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              />
            ))}
            {/* Arrow buttons — only show if more than 1 image */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActive((a) => (a - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/50 border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] hover:bg-[#c9a84c]/20 transition opacity-0 group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  onClick={() => setActive((a) => (a + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/50 border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] hover:bg-[#c9a84c]/20 transition opacity-0 group-hover:opacity-100"
                  aria-label="Next image"
                >
                  ›
                </button>
                {/* Dot indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`rounded-full transition-all duration-200 ${
                        i === active
                          ? 'w-5 h-1.5 bg-[#c9a84c]'
                          : 'w-1.5 h-1.5 bg-[#c9a84c]/40'
                      }`}
                      aria-label={`View image ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-9xl">🌹</span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images?.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                i === active
                  ? 'border-[#c9a84c] shadow-[0_0_12px_rgba(201,168,76,0.4)]'
                  : 'border-[#c9a84c]/20 hover:border-[#c9a84c]/50'
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <img src={img} alt={`${name} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
