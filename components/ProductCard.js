import Link from 'next/link'

export default function ProductCard({ product }) {
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <div className="card-dark rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.15)]">
      {/* Image */}
      <div className="relative aspect-[3/4] bg-gradient-to-b from-[#1a1a1a] to-[#111] overflow-hidden">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl">🌹</span>
          </div>
        )}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}
        {product.isFeatured && (
          <span className="absolute top-3 right-3 bg-[#c9a84c] text-black text-xs font-bold px-2 py-1 rounded-full">
            Featured
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-[#c9a84c] uppercase tracking-wider mb-1">
          {product.category?.replace('-', ' ')}
        </p>
        <h3 className="font-semibold text-white mb-1 line-clamp-1">{product.name}</h3>
        {product.volume && (
          <p className="text-xs text-gray-500 mb-2">{product.volume}</p>
        )}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-[#c9a84c]">
            PKR {product.price?.toLocaleString()}
          </span>
          {product.comparePrice && (
            <span className="text-sm text-gray-500 line-through">
              PKR {product.comparePrice?.toLocaleString()}
            </span>
          )}
        </div>

        {/* Stars */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-3 h-3 ${star <= Math.round(product.rating) ? 'text-[#c9a84c]' : 'text-gray-600'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-gray-500">({product.reviewCount})</span>
          </div>
        )}

        <div className="flex gap-2">
          <Link
            href={`/order/${product.slug}`}
            className="flex-1 btn-gold py-2 rounded-lg text-sm text-center"
          >
            Order Now
          </Link>
          <Link
            href={`/shop/${product.slug}`}
            className="px-3 py-2 btn-outline-gold rounded-lg text-sm"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  )
}
