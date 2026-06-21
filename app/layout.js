import { Geist } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from 'react'
import Script from 'next/script'
import AffiliateTracker from '@/components/AffiliateTracker'
import './globals.css'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata = {
  title: 'Scent Inn — Luxury Perfumes Brand',
  description:
    'Discover our exclusive collection of luxury perfumes. Handcrafted fragrances for the discerning individual.',
  keywords: 'perfume, fragrance, luxury, oud, attar, scent, cologne, online perfume store, best perfume',
  openGraph: {
    title: 'Scent Inn — Luxury Perfumes Brand',
    description:
      'Discover our exclusive collection of luxury perfumes. Handcrafted fragrances for the discerning individual.',
    type: 'website',
    siteName: 'Scent Inn',
    url: 'https://yourdomain.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scent Inn — Luxury Perfumes Brand',
    description:
      'Discover our exclusive collection of luxury perfumes. Handcrafted fragrances for the discerning individual.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <head>
        <meta name="google-site-verification" content="OxJnDlxKld6R8V8RXE_SqynIk0LcRgZlRtpsCXOIGKc" />
      </head>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white antialiased">
        {children}
        {/* Ad banner container — sits just before the footer across all pages */}
        <div id="container-e0150043b5296aa985aea3be5b687fc8" />
        <Suspense fallback={null}>
          <AffiliateTracker />
        </Suspense>
        <Analytics />
        {/* EffectiveCPM — banner unit */}
        <Script
          async
          data-cfasync="false"
          src="https://pl29826312.effectivecpmnetwork.com/e0150043b5296aa985aea3be5b687fc8/invoke.js"
          strategy="afterInteractive"
        />
        {/* EffectiveCPM — pop/push unit */}
        <Script
          src="https://pl29826218.effectivecpmnetwork.com/52/9e/53/529e53ade9ff1f6bfc06c02a370f7135.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
