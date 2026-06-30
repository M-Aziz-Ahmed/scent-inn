import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CheckoutForm from './CheckoutForm'

export const metadata = { title: 'Checkout — Gullkar' }

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold text-[#1a1a1a] mb-8">Checkout</h1>
          <CheckoutForm />
        </div>
      </main>
      <Footer />
    </>
  )
}
