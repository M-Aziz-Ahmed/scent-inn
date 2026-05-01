import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default async function OrderSuccessPage({ searchParams }) {
  const params = await searchParams
  const orderNumber = params?.order || ''

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center py-20">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="card-dark rounded-3xl p-10">
            <div className="text-7xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold text-white mb-3">Order Placed!</h1>
            {orderNumber && (
              <p className="text-[#c9a84c] font-semibold text-lg mb-3">
                Order #{orderNumber}
              </p>
            )}
            <p className="text-gray-400 mb-8 leading-relaxed">
              Thank you for your order! We'll confirm it shortly and deliver within 3-5 business days.
              Our team will contact you on the provided phone number.
            </p>

            <div className="space-y-3 text-sm text-gray-400 mb-8 text-left">
              <div className="flex items-center gap-3">
                <span className="text-[#c9a84c] text-lg">📞</span>
                <span>We'll call to confirm your order</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#c9a84c] text-lg">📦</span>
                <span>Packed and dispatched within 24 hours</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#c9a84c] text-lg">🚚</span>
                <span>Delivered in 3-5 business days</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/shop" className="btn-gold py-3 rounded-full font-semibold">
                Continue Shopping
              </Link>
              <Link href="/" className="btn-outline-gold py-3 rounded-full">
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
