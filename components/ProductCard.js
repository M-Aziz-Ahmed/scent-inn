import Link from 'next/link'
import AddToCart from './AddToCart'

export default function ProductCard({ product }) {
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <div className="group">
      {/* Image */}
      <div className="relative aspect-3/4 bg-[#f5f5f5] overflow-hidden mb-3">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-20">👗</span>
          </div>
        )}

        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-[#1a1a1a] text-white text-[10px] font-semibold px-2 py-0.5">
            -{discount}%
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-[#555] text-xs font-medium tracking-wider uppercase">Sold Out</span>
          </div>
        )}

        {/* Hover actions */}
        <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex">
          <Link
            href={`/order/${product.slug}`}
            className="flex-1 bg-[#1a1a1a] text-white text-xs font-semibold text-center py-2.5 hover:bg-[#333] transition"
          >
            Order Now
          </Link>
          <AddToCart product={product} variant="minimal" />
        </div>
      </div>

      {/* Info */}
      <div>
        <p className="text-[11px] text-[#999] uppercase tracking-wider mb-0.5">{product.category}</p>
        <Link href={`/shop/${product.slug}`}>
          <h3 className="text-sm font-medium text-[#1a1a1a] hover:text-[#555] transition line-clamp-1 mb-1">
            {product.name}
          </h3>
        </Link>

        {product.sizes?.length > 0 && (
          <div className="flex gap-1 mb-1.5 flex-wrap">
            {product.sizes.slice(0, 5).map((s) => (
              <span key={s} className="text-[10px] text-[#999] border border-[#e5e5e5] px-1.5 py-0.5">{s}</span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#1a1a1a]">PKR {product.price?.toLocaleString()}</span>
          {product.comparePrice && (
            <span className="text-xs text-[#999] line-through">PKR {product.comparePrice?.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  )
}
