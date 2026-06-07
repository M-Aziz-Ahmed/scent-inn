import { connectDB } from '@/lib/db'
import Product from '@/models/Product'
import ProductView from '@/models/ProductView'

export async function POST(request) {
  try {
    const body = await request.json()
    const { productId, slug, referrer } = body || {}

    await connectDB()

    const product = productId ? await Product.findById(productId) : await Product.findOne({ slug })
    if (!product) return Response.json({ error: 'Product not found' }, { status: 404 })

    const headers = Object.fromEntries(request.headers.entries())
    const ip = headers['x-forwarded-for'] || headers['x-real-ip'] || ''
    const country = headers['x-vercel-ip-country'] || ''
    const userAgent = headers['user-agent'] || ''
    const ref = referrer || headers['referer'] || ''

    await ProductView.create({ product: product._id, slug: product.slug, referrer: ref, userAgent, ip, country })
    await Product.updateOne({ _id: product._id }, { $inc: { viewsCount: 1 } })

    return Response.json({ ok: true })
  } catch (err) {
    return Response.json({ error: 'Unable to record view' }, { status: 500 })
  }
}
