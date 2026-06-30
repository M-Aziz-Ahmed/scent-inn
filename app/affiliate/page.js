import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AffiliatePortal from './AffiliatePortal'

export const metadata = {
  title: 'Affiliate Portal — Gullkar',
  description: 'Gullkar affiliate partner dashboard',
  robots: 'noindex',
}

export default function AffiliatePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AffiliatePortal />
        </div>
      </main>
      <Footer />
    </>
  )
}
