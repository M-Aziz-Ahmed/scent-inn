import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata = {
  title: 'Scent Inn — Luxury Perfumes',
  description:
    'Discover our exclusive collection of luxury perfumes. Handcrafted fragrances for the discerning individual.',
  keywords: 'perfume, fragrance, luxury, oud, attar, scent, cologne',
  openGraph: {
    title: 'Scent Inn — Luxury Perfumes',
    description: 'Discover our exclusive collection of luxury perfumes.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white antialiased">
        {children}
      </body>
    </html>
  )
}
