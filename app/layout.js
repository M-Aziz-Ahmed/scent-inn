import { Geist } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from 'react'
import Script from 'next/script'
import AffiliateTracker from '@/components/AffiliateTracker'
import AdBanner from '@/components/AdBanner'
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
        <meta name="monetag" content="8ea358354096dee6399a550453c22ee8" />
        <meta name="google-adsense-account" content="ca-pub-8760416573005949"></meta>
      </head>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white antialiased">
        {children}
        <AdBanner />
        <Suspense fallback={null}>
          <AffiliateTracker />
        </Suspense>
        <Analytics />
        {/* Monetag tag.min.js */}
        <Script src="https://quge5.com/88/tag.min.js" data-zone="252100" async data-cfasync="false"></Script>
        {/* EffectiveCPM — pop/push unit */}
        <Script
          src="https://pl29826218.effectivecpmnetwork.com/52/9e/53/529e53ade9ff1f6bfc06c02a370f7135.js"
          strategy="afterInteractive"
        />
        <Script>
          {`(function(s){s.dataset.zone='11180994',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`}</Script>
      </body>
    </html>
  )
}
