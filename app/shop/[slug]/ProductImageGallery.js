'use client'
import { useState } from 'react'

export default function ProductImageGallery({ images, name }) {
  const [active, setActive] = useState(0)
  const hasImages = images?.length > 0

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square bg-[#f5f5f5] overflow-hidden group">
        {hasImages ? (
          <>
            {images.map((img, i) => (
              <img key={i} src={img} alt={`${name} ${i + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${i === active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              />
            ))}
            {images.length > 1 && (
              <>
                <button onClick={() => setActive((a) => (a - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-[#e5e5e5] flex items-center justify-center text-[#1a1a1a] hover:border-[#1a1a1a] transition opacity-0 group-hover:opacity-100"
                  aria-label="Previous">‹</button>
                <button onClick={() => setActive((a) => (a + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-[#e5e5e5] flex items-center justify-center text-[#1a1a1a] hover:border-[#1a1a1a] transition opacity-0 group-hover:opacity-100"
                  aria-label="Next">›</button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                  {images.map((_, i) => (
                    <button key={i} onClick={() => setActive(i)} aria-label={`View image ${i + 1}`}
                      className={`rounded-full transition-all duration-200 ${i === active ? 'w-5 h-1.5 bg-[#1a1a1a]' : 'w-1.5 h-1.5 bg-[#ccc]'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-8xl opacity-10">👗</span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images?.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button key={i} onClick={() => setActive(i)} aria-label={`View image ${i + 1}`}
              className={`shrink-0 w-16 h-16 overflow-hidden border transition-all duration-200 ${i === active ? 'border-[#1a1a1a]' : 'border-[#e5e5e5] hover:border-[#aaa]'}`}
            >
              <img src={img} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
