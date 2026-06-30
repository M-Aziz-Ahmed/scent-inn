import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'About Us — Gullkar',
  description: 'Learn about Gullkar — our story and commitment to quality clothing.',
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        {/* Hero */}
        <section className="bg-[#f5f5f5] py-20 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <p className="text-[11px] uppercase tracking-widest text-[#999] mb-4">Our Story</p>
            <h1 className="text-4xl font-semibold text-[#1a1a1a] mb-4">Crafted Clothing, Honest Prices</h1>
            <p className="text-sm text-[#777] leading-relaxed">
              Born from a love of craftsmanship and culture, Gullkar brings you clothing that speaks before you do.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 border-b border-[#e5e5e5]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">The Art of Crafted Clothing</h2>
                <p className="text-sm text-[#777] leading-relaxed mb-4">
                  At Gullkar, we believe clothing is more than fabric — it&apos;s identity, heritage, and confidence woven together.
                </p>
                <p className="text-sm text-[#777] leading-relaxed mb-4">
                  We source premium fabrics and work with skilled artisans to create pieces that balance modern style with timeless quality.
                </p>
                <p className="text-sm text-[#777] leading-relaxed">
                  Our commitment: quality clothing at honest prices, straight to your door across Pakistan.
                </p>
              </div>
              <div className="bg-[#f5f5f5] p-8 text-center">
                <div className="text-6xl mb-4">🧵</div>
                <h3 className="text-sm font-semibold text-[#1a1a1a] mb-1">Crafted with Care</h3>
                <p className="text-xs text-[#999]">Every stitch, every cut — made to last.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 border-b border-[#e5e5e5]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg font-semibold text-[#1a1a1a] text-center mb-10">Why Choose Gullkar</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { icon: '✓', title: '100% Original', desc: 'Sourced from quality-verified suppliers.' },
                { icon: '🚚', title: 'Fast Delivery', desc: 'Across Pakistan in 3–5 business days.' },
                { icon: '💳', title: 'Cash on Delivery', desc: 'Pay when you receive your order.' },
                { icon: '↩', title: 'Easy Returns', desc: '7-day hassle-free return policy.' },
                { icon: '📏', title: 'Size Guide', desc: 'Detailed charts for your perfect fit.' },
                { icon: '📞', title: '24/7 Support', desc: 'Always here to help with your order.' },
              ].map((item) => (
                <div key={item.title} className="border border-[#e5e5e5] p-5">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h3 className="text-sm font-medium text-[#1a1a1a] mb-1">{item.title}</h3>
                  <p className="text-xs text-[#999]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 text-center bg-[#f5f5f5]">
          <p className="text-[11px] uppercase tracking-widest text-[#999] mb-4">Ready to shop?</p>
          <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6">Explore the Collection</h2>
          <Link href="/shop" className="inline-block bg-[#1a1a1a] text-white text-sm px-8 py-3 hover:bg-[#333] transition">
            Shop Now
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
