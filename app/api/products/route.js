import { connectDB } from '@/lib/db'
import Product from '@/models/Product'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET(request) {
  await connectDB()
  const { searchParams } = request.nextUrl

  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  const heroSlide = searchParams.get('heroSlide')
  const bestSelling = searchParams.get('bestSelling')
  const search = searchParams.get('search')
  const sort = searchParams.get('sort') || 'createdAt'

  const query = { isActive: true }
  if (category) query.category = category
  if (featured === 'true') query.isFeatured = true
  if (heroSlide === 'true') query.isHeroSlide = true
  if (search) query.name = { $regex: search, $options: 'i' }

  let sortObj = {}
  if (bestSelling === 'true') sortObj = { salesCount: -1 }
  else if (sort === 'price_asc') sortObj = { price: 1 }
  else if (sort === 'price_desc') sortObj = { price: -1 }
  else if (sort === 'newest') sortObj = { createdAt: -1 }
  else if (sort === 'featured') sortObj = { featuredOrder: 1 }
  else sortObj = { createdAt: -1 }

  const skip = (page - 1) * limit
  const [products, total] = await Promise.all([
    Product.find(query).sort(sortObj).skip(skip).limit(limit).lean(),
    Product.countDocuments(query),
  ])

  return Response.json({
    products,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  })
}

async function getNextOrder(field) {
  const maxProduct = await Product.findOne({ [field]: { $gt: 0 }, isActive: true }).sort({ [field]: -1 }).lean()
  return maxProduct ? (maxProduct[field] || 0) + 1 : 1
}

export async function POST(request) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const body = await request.json()

  if (body.isFeatured === true) {
    if (!body.featuredOrder || body.featuredOrder <= 0) {
      body.featuredOrder = await getNextOrder('featuredOrder')
    }
  } else {
    body.featuredOrder = 0
  }

  if (body.isHeroSlide === true) {
    if (!body.heroSlideOrder || body.heroSlideOrder <= 0) {
      body.heroSlideOrder = await getNextOrder('heroSlideOrder')
    }
  } else {
    body.heroSlideOrder = 0
  }

  try {
    const product = await Product.create(body)
    return Response.json({ product }, { status: 201 })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 })
  }
}
