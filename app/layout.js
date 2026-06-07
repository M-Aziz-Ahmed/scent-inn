import { Geist } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
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
      <meta name="google-site-verification" content="OxJnDlxKld6R8V8RXE_SqynIk0LcRgZlRtpsCXOIGKc" />
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white antialiased">
        {children}
        <Analytics /> 
      </body>
    </html>
  )
}
