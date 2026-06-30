import { connectDB } from '@/lib/db'
import Product from '@/models/Product'
import Settings from '@/models/Settings'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSlider from '@/components/HeroSlider'
import FeaturedSlider from '@/components/FeaturedSlider'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Gullkar — Crafted Clothing',
  description: 'Shop Gullkar — premium clothing for men, women and kids. Fast delivery across Pakistan.',
  keywords: 'clothing, fashion, kurta, shalwar kameez, men clothing, women clothing, Pakistani fashion, Gullkar',
}

async function getData() {
  try {
    await connectDB()
    const [heroSlides, featuredProducts, bestSellers, newArrivals, categoriesSetting] = await Promise.all([
      Product.find({ isHeroSlide: true, isActive: true }).sort({ heroSlideOrder: 1 }).limit(5).lean(),
      Product.find({ isFeatured: true, isActive: true }).sort({ featuredOrder: 1 }).limit(12).lean(),
      Product.find({ isActive: true }).sort({ salesCount: -1 }).limit(8).lean(),
      Product.find({ isActive: true }).sort({ createdAt: -1 }).limit(8).lean(),
      Settings.findOne({ key: 'categories' }).lean(),
    ])
    return {
      heroSlides: JSON.parse(JSON.stringify(heroSlides)),
      featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
      bestSellers: JSON.parse(JSON.stringify(bestSellers)),
      newArrivals: JSON.parse(JSON.stringify(newArrivals)),
      categories: categoriesSetting?.value || [],
    }
  } catch {
    return { heroSlides: [], featuredProducts: [], bestSellers: [], newArrivals: [], categories: [] }
  }
}

export default async function HomePage() {
  const { heroSlides, featuredProducts, bestSellers, newArrivals, categories } = await getData()

  return (
    <>
      <Navbar />
      <main className="bg-white">

        {/* Hero */}
        <HeroSlider slides={heroSlides} />

        {/* Featured products */}
        {featuredProducts.length > 0 && (
          <FeaturedSlider products={featuredProducts} title="Featured products" viewAllHref="/shop" />
        )}

        {/* New Arrivals grid */}
        {newArrivals.length > 0 && (
          <section className="py-10 border-b border-[#e5e5e5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[#1a1a1a]">New Arrivals</h2>
                <Link href="/shop?sort=newest" className="text-xs text-[#555] underline underline-offset-2 hover:text-[#1a1a1a] transition">
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {newArrivals.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>
          </section>
        )}

        {/* Best Sellers */}
        {bestSellers.length > 0 && (
          <section className="py-10 border-b border-[#e5e5e5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[#1a1a1a]">Best Sellers</h2>
                <Link href="/shop?sort=bestselling" className="text-xs text-[#555] underline underline-offset-2 hover:text-[#1a1a1a] transition">
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {bestSellers.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>
          </section>
        )}

        {/* Shop by Category */}
        {categories.length > 0 && (
          <section className="py-10 border-b border-[#e5e5e5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-5">Shop by Category</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/shop?category=${encodeURIComponent(cat)}`}
                    className="border border-[#e5e5e5] text-[#1a1a1a] text-xs px-4 py-2 hover:border-[#1a1a1a] transition capitalize"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Empty state */}
        {bestSellers.length === 0 && featuredProducts.length === 0 && (
          <section className="py-24 text-center">
            <p className="text-[#999] text-sm mb-4">No products yet.</p>
            <Link href="/admin" className="text-xs underline text-[#555]">Go to Admin</Link>
          </section>
        )}

        {/* CTA banner */}
        <section className="bg-[#f5f5f5] py-16 text-center">
          <p className="text-xs uppercase tracking-widest text-[#999] mb-3">New Collection</p>
          <h2 className="text-3xl font-semibold text-[#1a1a1a] mb-6">Wear Your Identity</h2>
          <Link href="/shop" className="inline-block bg-[#1a1a1a] text-white text-sm font-medium px-8 py-3 hover:bg-[#333] transition">
            Shop All
          </Link>
        </section>

      </main>
      <Footer />
    </>
  )
}
