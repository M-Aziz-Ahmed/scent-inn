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
  description: 'Shop Gullkar — premium clothing for men, women and kids. Fast delivery across Pakistan. Cash on delivery available.',
  keywords: 'clothing, fashion, kurta, shalwar kameez, men clothing, women clothing, Pakistani fashion, Gullkar',
  openGraph: {
    title: 'Gullkar — Crafted Clothing',
    description: 'Shop Gullkar — premium clothing with fast delivery across Pakistan.',
    type: 'website',
    url: 'https://yourdomain.com',
  },
}

async function getData() {
  try {
    await connectDB()
    const [heroSlides, featuredProducts, bestSellers, newArrivals, categoriesSetting] = await Promise.all([
      Product.find({ isHeroSlide: true, isActive: true }).sort({ heroSlideOrder: 1 }).limit(5).lean(),
      Product.find({ isFeatured: true, isActive: true }).sort({ featuredOrder: 1 }).limit(10).lean(),
      Product.find({ isActive: true }).sort({ salesCount: -1 }).limit(8).lean(),
      Product.find({ isActive: true }).sort({ createdAt: -1 }).limit(6).lean(),
      Settings.findOne({ key: 'categories' }).lean(),
    ])
    const categories = categoriesSetting?.value || []
    return {
      heroSlides: JSON.parse(JSON.stringify(heroSlides)),
      featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
      bestSellers: JSON.parse(JSON.stringify(bestSellers)),
      newArrivals: JSON.parse(JSON.stringify(newArrivals)),
      categories,
    }
  } catch {
    return { heroSlides: [], featuredProducts: [], bestSellers: [], newArrivals: [], categories: [] }
  }
}

const GENDER_TILES = [
  { label: "Men's", value: 'men', emoji: '🧥', desc: 'Sharp & Structured' },
  { label: "Women's", value: 'women', emoji: '👗', desc: 'Elegant & Graceful' },
  { label: 'Kids', value: 'kids', emoji: '🧒', desc: 'Playful & Comfy' },
  { label: 'Unisex', value: 'unisex', emoji: '✨', desc: 'For Everyone' },
]

export default async function HomePage() {
  const { heroSlides, featuredProducts, bestSellers, newArrivals, categories } = await getData()

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Slider */}
        <HeroSlider slides={heroSlides} />

        {/* Trust Badges */}
        <section className="bg-[#101a14] border-y border-[#c9a84c]/20 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { icon: '🚚', title: 'Fast Delivery', desc: 'Across all Pakistan' },
                { icon: '✅', title: '100% Original', desc: 'Genuine quality only' },
                { icon: '🔄', title: 'Easy Returns', desc: '7-day return policy' },
                { icon: '💳', title: 'Cash on Delivery', desc: 'Pay when you receive' },
              ].map((badge) => (
                <div key={badge.title} className="flex flex-col items-center gap-2">
                  <span className="text-3xl">{badge.icon}</span>
                  <p className="font-semibold text-white text-sm">{badge.title}</p>
                  <p className="text-xs text-gray-400">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Slider */}
        {featuredProducts.length > 0 && (
          <FeaturedSlider products={featuredProducts} title="Featured Pieces" />
        )}

        {/* Shop by Gender */}
        <section className="py-16 bg-[#0d1510]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white">Shop by Gender</h2>
              <div className="w-16 h-1 bg-[#c9a84c] mx-auto mt-2 rounded-full" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {GENDER_TILES.map((g) => (
                <Link
                  key={g.value}
                  href={`/shop?gender=${g.value}`}
                  className="card-dark rounded-2xl p-6 text-center hover:border-[#c9a84c]/60 transition-all duration-300 group"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{g.emoji}</div>
                  <p className="font-semibold text-white text-sm">{g.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{g.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Shop by Category — dynamic */}
        {categories.length > 0 && (
          <section className="py-12 bg-[#0a0f0d]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white">Shop by Category</h2>
                <div className="w-16 h-1 bg-[#c9a84c] mx-auto mt-2 rounded-full" />
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/shop?category=${encodeURIComponent(cat)}`}
                    className="btn-outline-gold px-5 py-2.5 rounded-full text-sm capitalize hover:scale-105 transition-transform"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* New Arrivals */}
        {newArrivals.length > 0 && (
          <section className="py-16 bg-[#0d1510]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white">New Arrivals</h2>
                  <div className="w-16 h-1 bg-[#c9a84c] mt-2 rounded-full" />
                </div>
                <Link href="/shop?sort=newest" className="btn-outline-gold px-4 py-2 rounded-lg text-sm">
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {newArrivals.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Best Sellers */}
        {bestSellers.length > 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white">Best Sellers</h2>
                  <div className="w-16 h-1 bg-[#c9a84c] mt-2 rounded-full" />
                </div>
                <Link href="/shop?sort=bestselling" className="btn-outline-gold px-4 py-2 rounded-lg text-sm">
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {bestSellers.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Empty state */}
        {bestSellers.length === 0 && featuredProducts.length === 0 && (
          <section className="py-24 text-center">
            <div className="max-w-md mx-auto px-4">
              <div className="text-6xl mb-6">👗</div>
              <h2 className="text-2xl font-bold text-white mb-3">Collection Coming Soon</h2>
              <p className="text-gray-400 mb-6">
                Our new collection is being curated. Check back soon or visit the admin panel to add products.
              </p>
              <Link href="/admin" className="btn-gold px-6 py-3 rounded-full inline-block">
                Admin Panel
              </Link>
            </div>
          </section>
        )}

        {/* CTA Banner */}
        <section className="py-20 bg-linear-to-r from-[#0f2318] via-[#1a3c2e] to-[#0f2318] border-y border-[#c9a84c]/20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Wear Your <span className="gold-text">Identity</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Explore the full Gullkar collection. Free delivery on orders above PKR 3,000.
            </p>
            <Link href="/shop" className="btn-gold px-10 py-4 rounded-full text-lg inline-block">
              Shop Now
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
