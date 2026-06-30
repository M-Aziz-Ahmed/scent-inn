import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default async function OrderSuccessPage({ searchParams }) {
  const params = await searchParams
  const orderNumber = params?.order || ''

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white flex items-center justify-center py-20">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="border border-[#e5e5e5] p-10">
            <div className="text-5xl mb-6">✓</div>
            <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-2">Order Placed!</h1>
            {orderNumber && (
              <p className="text-sm text-[#555] mb-3">Order {orderNumber}</p>
            )}
            <p className="text-sm text-[#777] mb-8 leading-relaxed">
              Thank you! We&apos;ll confirm your order shortly and deliver within 3–5 business days.
            </p>

            <div className="space-y-2 text-xs text-[#999] mb-8 text-left border-t border-[#e5e5e5] pt-6">
              <p>📞 We&apos;ll call to confirm</p>
              <p>📦 Dispatched within 24 hours</p>
              <p>🚚 Delivered in 3–5 business days</p>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/shop" className="block bg-[#1a1a1a] text-white text-sm py-3 hover:bg-[#333] transition">
                Continue Shopping
              </Link>
              <Link href="/" className="block border border-[#e5e5e5] text-[#555] text-sm py-3 hover:border-[#1a1a1a] transition">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
