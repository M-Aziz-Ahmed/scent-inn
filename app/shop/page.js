import { connectDB } from '@/lib/db'
import Product from '@/models/Product'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'

export const dynamic = 'force-dynamic'
import ShopFilters from './ShopFilters'
import Link from 'next/link'

async function getProducts(searchParams) {
  try {
    await connectDB()
    const params = await searchParams
    const category = params?.category || ''
    const sort = params?.sort || 'newest'
    const page = parseInt(params?.page || '1')
    const search = params?.search || ''
    const limit = 12

    const query = { isActive: true }
    if (category) query.category = category
    if (search) query.name = { $regex: search, $options: 'i' }

    let sortObj = { createdAt: -1 }
    if (sort === 'bestselling') sortObj = { salesCount: -1 }
    else if (sort === 'price_asc') sortObj = { price: 1 }
    else if (sort === 'price_desc') sortObj = { price: -1 }

    const skip = (page - 1) * limit
    const [products, total] = await Promise.all([
      Product.find(query).sort(sortObj).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ])

    return {
      products: JSON.parse(JSON.stringify(products)),
      total,
      pages: Math.ceil(total / limit),
      page,
    }
  } catch {
    return { products: [], total: 0, pages: 0, page: 1 }
  }
}

function buildUrl(category, sort, overrides) {
  const p = { category, sort, page: '1', ...overrides }
  const qs = Object.entries(p)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')
  return `/shop${qs ? '?' + qs : ''}`
}

export default async function ShopPage({ searchParams }) {
  const { products, total, pages, page } = await getProducts(searchParams)
  const params = await searchParams
  const currentCategory = params?.category || ''
  const currentSort = params?.sort || 'newest'

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="bg-[#111111] border-b border-[#c9a84c]/20 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-white mb-2">Our Collection</h1>
            <p className="text-gray-400">
              {total} fragrance{total !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Only plain serializable props passed to client component */}
          <ShopFilters currentCategory={currentCategory} currentSort={currentSort} />

          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {page > 1 && (
                    <Link href={buildUrl(currentCategory, currentSort, { page: String(page - 1) })} className="btn-outline-gold px-4 py-2 rounded-lg text-sm">
                      Previous
                    </Link>
                  )}
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={buildUrl(currentCategory, currentSort, { page: String(p) })}
                      className={`px-4 py-2 rounded-lg text-sm ${p === page ? 'btn-gold' : 'btn-outline-gold'}`}
                    >
                      {p}
                    </Link>
                  ))}
                  {page < pages && (
                    <Link href={buildUrl(currentCategory, currentSort, { page: String(page + 1) })} className="btn-outline-gold px-4 py-2 rounded-lg text-sm">
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
              <p className="text-gray-400 mb-6">Try a different category or check back later.</p>
              <Link href="/shop" className="btn-gold px-6 py-3 rounded-full inline-block">
                View All Products
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
