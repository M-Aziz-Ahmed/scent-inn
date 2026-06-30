import { connectDB } from '@/lib/db'
import Product from '@/models/Product'
import Settings from '@/models/Settings'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import ShopFilters from './ShopFilters'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getProducts(searchParams) {
  try {
    await connectDB()
    const params = await searchParams
    const category = params?.category || ''
    const gender = params?.gender || ''
    const sort = params?.sort || 'newest'
    const page = parseInt(params?.page || '1')
    const search = params?.search || ''
    const limit = 12

    const query = { isActive: true }
    if (category) query.category = { $regex: new RegExp(`^${category}$`, 'i') }
    if (gender) query.gender = gender
    if (search) query.name = { $regex: search, $options: 'i' }

    let sortObj = { createdAt: -1 }
    if (sort === 'bestselling') sortObj = { salesCount: -1 }
    else if (sort === 'price_asc') sortObj = { price: 1 }
    else if (sort === 'price_desc') sortObj = { price: -1 }

    // Fetch categories from settings for filter UI
    const [products, total, categoriesSetting] = await Promise.all([
      Product.find(query).sort(sortObj).skip((page - 1) * limit).limit(limit).lean(),
      Product.countDocuments(query),
      Settings.findOne({ key: 'categories' }).lean(),
    ])

    return {
      products: JSON.parse(JSON.stringify(products)),
      total,
      pages: Math.ceil(total / limit),
      page,
      categories: categoriesSetting?.value || [],
    }
  } catch {
    return { products: [], total: 0, pages: 0, page: 1, categories: [] }
  }
}

function buildUrl(params, overrides) {
  const p = { ...params, page: '1', ...overrides }
  const qs = Object.entries(p)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')
  return `/shop${qs ? '?' + qs : ''}`
}

export default async function ShopPage({ searchParams }) {
  const { products, total, pages, page, categories } = await getProducts(searchParams)
  const params = await searchParams
  const currentCategory = params?.category || ''
  const currentGender = params?.gender || ''
  const currentSort = params?.sort || 'newest'

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="bg-white border-b border-[#e5e5e5] py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-1">Our Collection</h1>
            <p className="text-xs text-[#999]">
              {total} piece{total !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ShopFilters
            currentCategory={currentCategory}
            currentGender={currentGender}
            currentSort={currentSort}
            categories={categories}
          />

          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-10 flex-wrap">
                  {page > 1 && (
                    <Link href={buildUrl({ category: currentCategory, gender: currentGender, sort: currentSort }, { page: String(page - 1) })} className="btn-outline-gold px-4 py-2 rounded-lg text-sm">
                      Previous
                    </Link>
                  )}
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={buildUrl({ category: currentCategory, gender: currentGender, sort: currentSort }, { page: String(p) })}
                      className={`px-4 py-2 rounded-lg text-sm ${p === page ? 'btn-gold' : 'btn-outline-gold'}`}
                    >
                      {p}
                    </Link>
                  ))}
                  {page < pages && (
                    <Link href={buildUrl({ category: currentCategory, gender: currentGender, sort: currentSort }, { page: String(page + 1) })} className="btn-outline-gold px-4 py-2 rounded-lg text-sm">
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-24">
              <div className="text-5xl mb-4 opacity-20">👗</div>
              <h3 className="text-base font-medium text-[#1a1a1a] mb-2">No products found</h3>
              <p className="text-xs text-[#999] mb-6">Try a different filter or check back later.</p>
              <Link href="/shop" className="text-xs underline text-[#555]">View All</Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
