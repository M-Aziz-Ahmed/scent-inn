import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'About Us — Gullkar',
  description: 'Learn about Gullkar — our story, craftsmanship, and commitment to quality clothing.',
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-linear-to-b from-[#0f2318] to-[#0a0f0d] py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              Our <span className="gold-text">Story</span>
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Born from a love of craftsmanship and culture, Gullkar brings you clothing that speaks before you do.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  The Art of <span className="gold-text">Crafted Clothing</span>
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  At Gullkar, we believe clothing is more than fabric — it's identity, heritage, and confidence woven together. Every piece in our collection is thoughtfully designed to be worn and felt.
                </p>
                <p className="text-gray-400 leading-relaxed mb-4">
                  We source premium fabrics and work with skilled artisans to create pieces that balance modern style with timeless quality — from crisp kurtas to comfortable casuals.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  Our commitment is simple: deliver quality clothing at honest prices, straight to your door across Pakistan.
                </p>
              </div>
              <div className="card-dark rounded-2xl p-8 text-center">
                <div className="text-7xl mb-4">🧵</div>
                <h3 className="text-xl font-semibold text-[#c9a84c] mb-2">Crafted with Care</h3>
                <p className="text-gray-400 text-sm">Every stitch, every cut — made to last and made to impress.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-[#0d1510]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-10">
              Why Choose <span className="gold-text">Gullkar</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: '✅', title: '100% Original', desc: 'Every piece is genuine — sourced from quality-verified suppliers.' },
                { icon: '🚚', title: 'Fast Delivery', desc: 'We deliver across Pakistan within 3-5 business days with safe packaging.' },
                { icon: '💳', title: 'Cash on Delivery', desc: 'Pay when you receive your order. No advance payment required.' },
                { icon: '🔄', title: 'Easy Returns', desc: '7-day hassle-free return policy if you\'re not satisfied.' },
                { icon: '📏', title: 'Size Guide', desc: 'Detailed size charts to help you find your perfect fit every time.' },
                { icon: '📞', title: '24/7 Support', desc: 'Our team is always ready to help you with your order.' },
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
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Wear Gullkar?</h2>
            <p className="text-gray-400 mb-6">Explore our collection and find your perfect fit.</p>
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
