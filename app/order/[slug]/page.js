import { connectDB } from '@/lib/db'
import Product from '@/models/Product'
import OrderForm from './OrderForm'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { notFound } from 'next/navigation'

async function getProduct(slug) {
  try {
    await connectDB()
    const product = await Product.findOne({ slug, isActive: true, inStock: true }).lean()
    return product ? JSON.parse(JSON.stringify(product)) : null
  } catch { return null }
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Order — Gullkar' }
  return { title: `Order ${product.name} — Gullkar` }
}

export default async function OrderPage({ params }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold text-[#1a1a1a] mb-8">Complete Your Order</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Product Summary */}
            <div className="border border-[#e5e5e5] p-6 h-fit">
              <h2 className="text-sm font-semibold text-[#1a1a1a] mb-4 uppercase tracking-wider">Order Summary</h2>
              <div className="flex gap-4 mb-6">
                <div className="w-20 h-24 bg-[#f5f5f5] shrink-0 overflow-hidden">
                  {product.images?.[0]
                    ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-3xl opacity-20">👗</div>}
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-[#999] mb-0.5">{product.category}</p>
                  <h3 className="font-medium text-[#1a1a1a] text-sm mb-2">{product.name}</h3>
                  <p className="text-base font-semibold text-[#1a1a1a]">PKR {product.price?.toLocaleString()}</p>
                  {product.comparePrice && (
                    <p className="text-xs text-[#999] line-through">PKR {product.comparePrice?.toLocaleString()}</p>
                  )}
                </div>
              </div>

              <div className="border-t border-[#e5e5e5] pt-4 space-y-2 text-xs text-[#555]">
                <div className="flex justify-between"><span>Subtotal</span><span>PKR {product.price?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span className="text-[#999]">Calculated below</span></div>
                <div className="flex justify-between font-semibold text-[#1a1a1a] pt-2 border-t border-[#e5e5e5] text-sm">
                  <span>Total</span><span>PKR {product.price?.toLocaleString()}+</span>
                </div>
              </div>

              <div className="mt-5 space-y-1.5 text-xs text-[#999]">
                <p>✓ Cash on Delivery available</p>
                <p>✓ Delivery within 3–5 business days</p>
                <p>✓ 7-day easy returns</p>
              </div>
            </div>

            <OrderForm product={product} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
