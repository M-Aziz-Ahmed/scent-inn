import { Geist } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from 'react'
import Script from 'next/script'
import AffiliateTracker from '@/components/AffiliateTracker'
import AdBanner from '@/components/AdBanner'
import { CartProvider } from '@/lib/cartContext'
import './globals.css'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata = {
  title: 'Gullkar — Crafted Clothing',
  description: 'Shop Gullkar — premium clothing for men, women and kids. Fast delivery across Pakistan. Cash on delivery available.',
  keywords: 'clothing, fashion, kurta, shalwar kameez, men clothing, women clothing, Pakistani fashion, Gullkar',
  openGraph: {
    title: 'Gullkar — Crafted Clothing',
    description: 'Shop Gullkar — premium clothing with fast delivery across Pakistan.',
    type: 'website',
    siteName: 'Gullkar',
    url: 'https://yourdomain.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gullkar — Crafted Clothing',
    description: 'Shop Gullkar — premium clothing with fast delivery across Pakistan.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <head>
        <meta name="google-site-verification" content="OxJnDlxKld6R8V8RXE_SqynIk0LcRgZlRtpsCXOIGKc" />
        {/* <meta name="monetag" content="8ea358354096dee6399a550453c22ee8" /> */}
        <meta name="google-adsense-account" content="ca-pub-8760416573005949" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#1a1a1a] antialiased">
        <CartProvider>
          {children}
          {/* <AdBanner /> */}
          <Suspense fallback={null}>
            <AffiliateTracker />
          </Suspense>
        </CartProvider>
        <Analytics />
        {/* Monetag — zone 252100 */}
        {/* <Script
          id="monetag-252100"
          src="https://quge5.com/88/tag.min.js"
          data-zone="252100"
          data-cfasync="false"
          strategy="beforeInteractive"
        /> */}
        {/* Monetag — zone 11180994 */}
        {/* <Script
          id="monetag-11180994"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(s){s.dataset.zone='11180994',s.src='https://nap5k.com/tag.min.js'})([document.documentElement,document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`,
          }}
        /> */}
        {/* EffectiveCPM — pop/push unit */}
        {/* <Script
          id="effectivecpm-push"
          src="https://pl29826218.effectivecpmnetwork.com/52/9e/53/529e53ade9ff1f6bfc06c02a370f7135.js"
          strategy="afterInteractive"
        /> */}
      </body>
    </html>
  )
}
  