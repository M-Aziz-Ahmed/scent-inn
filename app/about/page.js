import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'About Us — Scent Inn',
  description: 'Learn about Scent Inn, our story, and our passion for luxury fragrances.',
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-[#1a0e00] to-[#0a0a0a] py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              Our <span className="gold-text">Story</span>
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Born from a passion for the art of fragrance, Scent Inn brings you the finest luxury perfumes crafted for those who appreciate the extraordinary.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  The Art of <span className="gold-text">Fragrance</span>
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  At Scent Inn, we believe that a fragrance is more than just a scent — it's an expression of identity, a memory, an emotion. Each bottle in our collection is carefully curated to tell a unique story.
                </p>
                <p className="text-gray-400 leading-relaxed mb-4">
                  We source the finest ingredients from around the world — rare oud from the Middle East, delicate florals from France, exotic spices from the Orient — to create fragrances that are truly exceptional.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  Our commitment is simple: to bring you authentic, luxury fragrances at accessible prices, delivered right to your door across Pakistan.
                </p>
              </div>
              <div className="card-dark rounded-2xl p-8 text-center">
                <div className="text-7xl mb-4">🌹</div>
                <h3 className="text-xl font-semibold text-[#c9a84c] mb-2">Premium Quality</h3>
                <p className="text-gray-400 text-sm">Every fragrance is tested and verified for authenticity before reaching you.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-[#0d0d0d]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-10">
              Why Choose <span className="gold-text">Scent Inn</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: '✅', title: '100% Authentic', desc: 'Every product is genuine and sourced directly from trusted suppliers.' },
                { icon: '🚚', title: 'Fast Delivery', desc: 'We deliver across Pakistan within 3-5 business days with careful packaging.' },
                { icon: '💳', title: 'Cash on Delivery', desc: 'Pay when you receive your order. No advance payment required.' },
                { icon: '🔄', title: 'Easy Returns', desc: '7-day hassle-free return policy if you\'re not satisfied.' },
                { icon: '🎁', title: 'Gift Packaging', desc: 'Beautiful gift packaging available for all orders.' },
                { icon: '📞', title: '24/7 Support', desc: 'Our team is always ready to help you find your perfect scent.' },
              ].map((item) => (
                <div key={item.title} className="card-dark rounded-xl p-6">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 text-center">
          <div className="max-w-md mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Scent?</h2>
            <p className="text-gray-400 mb-6">Explore our collection and discover your signature fragrance.</p>
            <Link href="/shop" className="btn-gold px-8 py-4 rounded-full text-lg inline-block">
              Shop Now
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
