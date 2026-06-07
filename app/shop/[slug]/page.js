import { connectDB } from '@/lib/db'
import Product from '@/models/Product'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProductViewTracker from './ProductViewTracker'

async function getProduct(slug) {
  try {
    await connectDB()
    const product = await Product.findOne({ slug, isActive: true }).lean()
    return product ? JSON.parse(JSON.stringify(product)) : null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.name} — Scent Inn`,
    description: product.shortDescription || product.description,
  }
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
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="flex gap-2 text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-[#c9a84c]">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#c9a84c]">Shop</Link>
            <span>/</span>
            <span className="text-white">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="aspect-square rounded-2xl bg-gradient-to-b from-[#1a1a1a] to-[#111] border border-[#c9a84c]/20 overflow-hidden mb-4">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-9xl">🌹</span>
                  </div>
                )}
              </div>
              {product.images?.length > 1 && (
                <div className="flex gap-3">
                  {product.images.slice(1, 4).map((img, i) => (
                    <div key={i} className="w-20 h-20 rounded-lg overflow-hidden border border-[#c9a84c]/20">
                      <img src={img} alt={`${product.name} ${i + 2}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <span className="text-[#c9a84c] text-sm uppercase tracking-wider">
                {product.category?.replace('-', ' ')}
              </span>
              <h1 className="text-4xl font-bold text-white mt-2 mb-3">{product.name}</h1>

              {product.rating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'text-[#c9a84c]' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-400 text-sm">({product.reviewCount} reviews)</span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl font-bold text-[#c9a84c]">
                  PKR {product.price?.toLocaleString()}
                </span>
                {product.comparePrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      PKR {product.comparePrice?.toLocaleString()}
                    </span>
                    <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-full">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>

              {product.volume && (
                <p className="text-gray-400 mb-4">Volume: <span className="text-white">{product.volume}</span></p>
              )}

              <p className="text-gray-300 leading-relaxed mb-6">{product.description}</p>

              {/* Notes */}
              {(product.notes?.top?.length > 0 || product.notes?.middle?.length > 0 || product.notes?.base?.length > 0) && (
                <div className="card-dark rounded-xl p-4 mb-6">
                  <h3 className="font-semibold text-[#c9a84c] mb-3">Fragrance Notes</h3>
                  <div className="space-y-2 text-sm">
                    {product.notes?.top?.length > 0 && (
                      <div className="flex gap-2">
                        <span className="text-gray-500 w-16">Top:</span>
                        <span className="text-gray-300">{product.notes.top.join(', ')}</span>
                      </div>
                    )}
                    {product.notes?.middle?.length > 0 && (
                      <div className="flex gap-2">
                        <span className="text-gray-500 w-16">Heart:</span>
                        <span className="text-gray-300">{product.notes.middle.join(', ')}</span>
                      </div>
                    )}
                    {product.notes?.base?.length > 0 && (
                      <div className="flex gap-2">
                        <span className="text-gray-500 w-16">Base:</span>
                        <span className="text-gray-300">{product.notes.base.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                {product.inStock ? (
                  <Link
                    href={`/order/${product.slug}`}
                    className="flex-1 btn-gold py-4 rounded-full text-center text-lg font-semibold"
                  >
                    Order Now — PKR {product.price?.toLocaleString()}
                  </Link>
                ) : (
                  <button disabled className="flex-1 bg-gray-700 text-gray-400 py-4 rounded-full text-lg cursor-not-allowed">
                    Out of Stock
                  </button>
                )}
              </div>

              <div className="flex gap-6 mt-6 text-sm text-gray-400">
                <span>✅ Authentic</span>
                <span>🚚 Fast Delivery</span>
                <span>💳 Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
