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
  } catch {
    return null
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Order — Gullkar' }
  return {
    title: `Order ${product.name} — Gullkar`,
    description: `Order ${product.name} now with Cash on Delivery. Fast shipping across Pakistan.`,
  }
}

export default async function OrderPage({ params }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white mb-2">Complete Your Order</h1>
            <p className="text-gray-400">Fill in your details and we'll deliver to your door</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Product Summary */}
            <div className="card-dark rounded-2xl p-6 h-fit">
              <h2 className="text-xl font-semibold text-[#c9a84c] mb-4">Order Summary</h2>
              <div className="flex gap-4 mb-6">
                <div className="w-24 h-32 rounded-xl bg-[#1a1a1a] flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <span className="text-4xl">👗</span>
                  )}
                </div>
                <div>
                  <p className="text-xs text-[#c9a84c] uppercase tracking-wider mb-1">
                    {product.category?.replace('-', ' ')}
                  </p>
                  <h3 className="font-bold text-white text-lg">{product.name}</h3>
                  {product.volume && <p className="text-gray-400 text-sm">{product.volume}</p>}
                  <p className="text-2xl font-bold text-[#c9a84c] mt-2">
                    PKR {product.price?.toLocaleString()}
                  </p>
                  {product.comparePrice && (
                    <p className="text-sm text-gray-500 line-through">
                      PKR {product.comparePrice?.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-[#c9a84c]/20 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>PKR {product.price?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-[#c9a84c]">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-[#c9a84c]/20">
                  <span>Total</span>
                  <span className="text-[#c9a84c]">PKR {product.price?.toLocaleString()}+</span>
                </div>
              </div>

              <div className="mt-6 space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Cash on Delivery available
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Delivery within 3-5 business days
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> 100% original product
                </div>
              </div>
            </div>

            {/* Order Form */}
            <OrderForm product={product} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
