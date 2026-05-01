import { connectDB } from '@/lib/db'
import Product from '@/models/Product'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSlider from '@/components/HeroSlider'
import FeaturedSlider from '@/components/FeaturedSlider'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

async function getData() {
  try {
    await connectDB()
    const [heroSlides, featuredProducts, bestSellers] = await Promise.all([
      Product.find({ isHeroSlide: true, isActive: true }).sort({ heroSlideOrder: 1 }).limit(5).lean(),
      Product.find({ isFeatured: true, isActive: true }).sort({ featuredOrder: 1 }).limit(10).lean(),
      Product.find({ isActive: true }).sort({ salesCount: -1 }).limit(8).lean(),
    ])
    return {
      heroSlides: JSON.parse(JSON.stringify(heroSlides)),
      featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
      bestSellers: JSON.parse(JSON.stringify(bestSellers)),
    }
  } catch {
    return { heroSlides: [], featuredProducts: [], bestSellers: [] }
  }
}

const CATEGORIES = [
  { name: "Men's", slug: 'men', emoji: '🕴️', desc: 'Bold & Masculine' },
  { name: "Women's", slug: 'women', emoji: '🌸', desc: 'Elegant & Floral' },
  { name: 'Oud', slug: 'oud', emoji: '🪵', desc: 'Rich & Woody' },
  { name: 'Unisex', slug: 'unisex', emoji: '✨', desc: 'For Everyone' },
  { name: 'Oriental', slug: 'oriental', emoji: '🌙', desc: 'Exotic & Warm' },
  { name: 'Gift Sets', slug: 'gift-sets', emoji: '🎁', desc: 'Perfect Gifts' },
]

export default async function HomePage() {
  const { heroSlides, featuredProducts, bestSellers } = await getData()

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Slider */}
        <HeroSlider slides={heroSlides} />

        {/* Trust Badges */}
        <section className="bg-[#111111] border-y border-[#c9a84c]/20 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { icon: '🚚', title: 'Free Delivery', desc: 'On orders above PKR 3000' },
                { icon: '✅', title: '100% Authentic', desc: 'Genuine fragrances only' },
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
          <FeaturedSlider products={featuredProducts} title="Featured Fragrances" />
        )}

        {/* Categories */}
        <section className="py-16 bg-[#0d0d0d]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white">Shop by Category</h2>
              <div className="w-16 h-1 bg-[#c9a84c] mx-auto mt-2 rounded-full" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/shop?category=${cat.slug}`}
                  className="card-dark rounded-2xl p-6 text-center hover:border-[#c9a84c]/60 transition-all duration-300 group"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.emoji}</div>
                  <p className="font-semibold text-white text-sm">{cat.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{cat.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

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

        {/* Empty state when no products */}
        {bestSellers.length === 0 && featuredProducts.length === 0 && (
          <section className="py-24 text-center">
            <div className="max-w-md mx-auto px-4">
              <div className="text-6xl mb-6">🌹</div>
              <h2 className="text-2xl font-bold text-white mb-3">Coming Soon</h2>
              <p className="text-gray-400 mb-6">
                Our luxury fragrance collection is being curated. Check back soon or visit the admin panel to add products.
              </p>
              <Link href="/admin" className="btn-gold px-6 py-3 rounded-full inline-block">
                Admin Panel
              </Link>
            </div>
          </section>
        )}

        {/* CTA Banner */}
        <section className="py-20 bg-gradient-to-r from-[#1a0e00] via-[#2d1a00] to-[#1a0e00] border-y border-[#c9a84c]/20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Find Your <span className="gold-text">Signature Scent</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Explore our full collection of handcrafted luxury fragrances. Free delivery on orders above PKR 3,000.
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
