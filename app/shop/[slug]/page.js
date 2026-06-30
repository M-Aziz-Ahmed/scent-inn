import { connectDB } from '@/lib/db'
import Product from '@/models/Product'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProductViewTracker from './ProductViewTracker'
import GenerateRefLink from '@/components/GenerateRefLink'
import ProductImageGallery from './ProductImageGallery'

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
    title: `${product.name} — Gullkar`,
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
          <nav className="flex gap-2 text-sm text-gray-400 mb-8 flex-wrap">
            <Link href="/" className="hover:text-[#c9a84c]">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#c9a84c]">Shop</Link>
            <span>/</span>
            <span className="text-white">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Gallery */}
            <div>
              <ProductImageGallery images={product.images} name={product.name} />
            </div>

            {/* Details */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#c9a84c] text-sm uppercase tracking-wider">
                  {product.category}
                </span>
                {product.gender && (
                  <span className="text-xs text-gray-500 capitalize border border-gray-700 px-2 py-0.5 rounded-full">
                    {product.gender}
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold text-white mt-1 mb-3">{product.name}</h1>

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

              <p className="text-gray-300 leading-relaxed mb-6">{product.description}</p>

              {/* Sizes */}
              {product.sizes?.length > 0 && (
                <div className="mb-5">
                  <p className="text-sm text-gray-400 mb-2">Available Sizes</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <span key={size} className="border border-[#c9a84c]/40 text-white text-sm px-3 py-1.5 rounded-lg font-mono">
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors?.length > 0 && (
                <div className="mb-5">
                  <p className="text-sm text-gray-400 mb-2">Colors Available</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <span key={color} className="border border-gray-700 text-gray-300 text-sm px-3 py-1.5 rounded-lg capitalize">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Material */}
              {product.material && (
                <p className="text-gray-400 mb-5 text-sm">
                  Material: <span className="text-white">{product.material}</span>
                </p>
              )}

              {/* SKU */}
              {product.sku && (
                <p className="text-gray-600 mb-5 text-xs">SKU: {product.sku}</p>
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

              <div className="flex gap-6 mt-6 text-sm text-gray-400 flex-wrap">
                <span>✅ 100% Original</span>
                <span>🚚 Fast Delivery</span>
                <span>💳 Cash on Delivery</span>
                <span>🔄 Easy Returns</span>
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
