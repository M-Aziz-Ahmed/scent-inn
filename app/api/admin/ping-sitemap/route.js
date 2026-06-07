import { getAdminFromRequest } from '@/lib/auth'

export async function POST(request) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const site = process.env.SITE_URL || 'https://scent-inn.vercel.app'
  const sitemapUrl = `${site.replace(/\/$/, '')}/sitemap.xml`

  try {
    const googleRes = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`)
    const bingRes = await fetch(`https://www.bing.com/webmaster/ping.aspx?siteMap=${encodeURIComponent(sitemapUrl)}`)

    const googleText = await googleRes.text().catch(() => '')
    const bingText = await bingRes.text().catch(() => '')

    return Response.json({
      sitemap: sitemapUrl,
      google: { status: googleRes.status, body: googleText },
      bing: { status: bingRes.status, body: bingText },
    })
  } catch (err) {
    return Response.json({ error: err.message || 'Ping failed' }, { status: 500 })
  }
}
