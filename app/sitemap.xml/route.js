import { connectDB } from '@/lib/db'
import Product from '@/models/Product'

export async function GET() {
  await connectDB()
  const base = process.env.SITE_URL || 'https://scent-inn.vercel.app'

  const products = await Product.find({ isActive: true }).select('slug updatedAt').lean()

  const urls = [
    { loc: `${base}/`, priority: 1.0 },
    { loc: `${base}/shop`, priority: 0.9 },
    { loc: `${base}/contact`, priority: 0.6 },
    { loc: `${base}/about`, priority: 0.6 },
  ]

  for (const p of products) {
    urls.push({ loc: `${base}/shop/${p.slug}`, lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString() : undefined, priority: 0.7 })
  }

  const xmlParts = []
  xmlParts.push('<?xml version="1.0" encoding="UTF-8"?>')
  xmlParts.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

  for (const u of urls) {
    xmlParts.push('  <url>')
    xmlParts.push(`    <loc>${u.loc}</loc>`)
    if (u.lastmod) xmlParts.push(`    <lastmod>${u.lastmod}</lastmod>`)
    if (u.changefreq) xmlParts.push(`    <changefreq>${u.changefreq}</changefreq>`)
    if (u.priority) xmlParts.push(`    <priority>${u.priority}</priority>`)
    xmlParts.push('  </url>')
  }

  xmlParts.push('</urlset>')

  const xml = xmlParts.join('\n')
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } })
}
