import Link from 'next/link'
import { connectDB } from '@/lib/db'
import Settings from '@/models/Settings'

async function getSocialLinks() {
  try {
    await connectDB()
    const s = await Settings.findOne({ key: 'socialLinks' }).lean()
    return s?.value || {}
  } catch { return {} }
}

export default async function Footer() {
  const social = await getSocialLinks()

  return (
    <footer className="bg-white border-t border-[#e5e5e5] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-xl font-bold italic text-[#1a1a1a] tracking-widest mb-3">Gullkar</p>
            <p className="text-xs text-[#999] leading-relaxed max-w-50">
              Crafted clothing for those who wear their identity.
            </p>
            {/* Social icons */}
            <div className="flex gap-3 mt-4">
              {['facebook', 'instagram', 'tiktok'].map((key) => {
                const url = social[key]
                return url ? (
                  <a key={key} href={url} target="_blank" rel="noreferrer"
                    className="text-[#999] hover:text-[#1a1a1a] transition text-xs capitalize">
                    {key}
                  </a>
                ) : null
              })}
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1a1a1a] mb-4">Shop</p>
            <ul className="space-y-2 text-xs text-[#777]">
              <li><Link href="/shop"              className="hover:text-[#1a1a1a] transition">All Products</Link></li>
              <li><Link href="/shop?gender=men"   className="hover:text-[#1a1a1a] transition">Men</Link></li>
              <li><Link href="/shop?gender=women" className="hover:text-[#1a1a1a] transition">Women</Link></li>
              <li><Link href="/shop?gender=kids"  className="hover:text-[#1a1a1a] transition">Kids</Link></li>
              <li><Link href="/shop?sort=newest"  className="hover:text-[#1a1a1a] transition">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1a1a1a] mb-4">Info</p>
            <ul className="space-y-2 text-xs text-[#777]">
              <li><Link href="/about"   className="hover:text-[#1a1a1a] transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#1a1a1a] transition">Contact</Link></li>
              <li><a href="#" className="hover:text-[#1a1a1a] transition">Size Guide</a></li>
              <li><a href="#" className="hover:text-[#1a1a1a] transition">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-[#1a1a1a] transition">Return Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1a1a1a] mb-4">Contact</p>
            <ul className="space-y-2 text-xs text-[#777]">
              <li>Cash on Delivery</li>
              <li>Fast Delivery</li>
              <li>7-Day Returns</li>
              <li><Link href="/affiliate" className="hover:text-[#1a1a1a] transition">Affiliate Portal</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-[#e5e5e5] mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-[11px] text-[#bbb]">© {new Date().getFullYear()} Gullkar. All rights reserved.</p>
          <p className="text-[11px] text-[#bbb]">Pakistan</p>
        </div>
      </div>
    </footer>
  )
}
