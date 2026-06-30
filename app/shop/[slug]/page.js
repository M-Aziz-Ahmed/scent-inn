import { connectDB } from '@/lib/db'
import Product from '@/models/Product'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProductViewTracker from './ProductViewTracker'
import GenerateRefLink from '@/components/GenerateRefLink'
import ProductImageGallery from './ProductImageGallery'
import AddToCart from '@/components/AddToCart'

async function getProduct(slug) {
  try {
    await connectDB()
    const product = await Product.findOne({ slug, isActive: true }).lean()
    return product ? JSON.parse(JSON.stringify(product)) : null
  } catch { return null }
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Product Not Found' }
  return { title: `${product.name} — Gullkar`, description: product.shortDescription || product.description }
}

export default async function ProductPage({ params }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <>
      <Navbar />
      <ProductViewTracker productId={product._id} slug={product.slug} />
      <main className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Breadcrumb */}
          <nav className="flex gap-2 text-xs text-[#999] mb-8 flex-wrap">
            <Link href="/" className="hover:text-[#1a1a1a] transition">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#1a1a1a] transition">Shop</Link>
            <span>/</span>
            <span className="text-[#1a1a1a]">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ProductImageGallery images={product.images} name={product.name} />

            {/* Details */}
            <div>
              <p className="text-[11px] uppercase tracking-widest text-[#999] mb-1">{product.category}</p>
              <h1 className="text-2xl sm:text-3xl font-semibold text-[#1a1a1a] mb-3">{product.name}</h1>

              {/* Rating */}
              {product.rating > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {[1,2,3,4,5].map((s) => (
                      <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(product.rating) ? 'text-[#1a1a1a]' : 'text-[#ccc]'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-[#999]">({product.reviewCount} reviews)</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xl font-semibold text-[#1a1a1a]">PKR {product.price?.toLocaleString()}</span>
                {product.comparePrice && (
                  <span className="text-sm text-[#999] line-through">PKR {product.comparePrice?.toLocaleString()}</span>
                )}
                {discount > 0 && (
                  <span className="text-xs bg-[#1a1a1a] text-white px-2 py-0.5">-{discount}%</span>
                )}
              </div>

              <p className="text-sm text-[#555] leading-relaxed mb-6">{product.description}</p>

              {/* Sizes */}
              {product.sizes?.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs uppercase tracking-widest text-[#999] mb-2">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <span key={size} className="border border-[#e5e5e5] text-[#1a1a1a] text-xs px-3 py-1.5 hover:border-[#1a1a1a] cursor-default transition">
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors?.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs uppercase tracking-widest text-[#999] mb-2">Color</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <span key={color} className="border border-[#e5e5e5] text-[#555] text-xs px-3 py-1.5 capitalize">{color}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Material */}
              {product.material && (
                <p className="text-xs text-[#999] mb-5">Material: <span className="text-[#1a1a1a]">{product.material}</span></p>
              )}

              {/* SKU */}
              {product.sku && <p className="text-xs text-[#ccc] mb-5">SKU: {product.sku}</p>}

              {/* CTA */}
              <div className="space-y-3 mb-6">
                {product.inStock ? (
                  <>
                    <AddToCart product={product} variant="full" />
                    <Link href={`/order/${product.slug}`}
                      className="block w-full border border-[#1a1a1a] text-[#1a1a1a] text-sm font-medium text-center py-3.5 hover:bg-[#1a1a1a] hover:text-white transition">
                      Order Now (Single Item)
                    </Link>
                  </>
                ) : (
                  <button disabled className="block w-full bg-[#f5f5f5] text-[#aaa] text-sm py-3.5 cursor-not-allowed">
                    Sold Out
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-[#999] border-t border-[#e5e5e5] pt-4">
                <span>✓ Free delivery above PKR 3,000</span>
                <span>✓ Cash on Delivery</span>
                <span>✓ 7-day returns</span>
              </div>

              <GenerateRefLink productSlug={product.slug} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
