import { connectDB } from '@/lib/db'
import Product from '@/models/Product'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET(request, { params }) {
  await connectDB()
  const { id } = await params

  // Support lookup by slug or id
  const product = id.match(/^[0-9a-fA-F]{24}$/)
    ? await Product.findById(id).lean()
    : await Product.findOne({ slug: id, isActive: true }).lean()

  if (!product) return Response.json({ error: 'Product not found' }, { status: 404 })
  return Response.json({ product })
}

async function getNextOrder(field, excludeId) {
  const filters = { [field]: { $gt: 0 }, isActive: true }
  if (excludeId) filters._id = { $ne: excludeId }
  const maxProduct = await Product.findOne(filters).sort({ [field]: -1 }).lean()
  return maxProduct ? (maxProduct[field] || 0) + 1 : 1
}

export async function PUT(request, { params }) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const { id } = await params
  const body = await request.json()

  if (body.isFeatured === true) {
    if (!body.featuredOrder || body.featuredOrder <= 0) {
      body.featuredOrder = await getNextOrder('featuredOrder', id)
    }
  } else if (body.isFeatured === false) {
    body.featuredOrder = 0
  }

  if (body.isHeroSlide === true) {
    if (!body.heroSlideOrder || body.heroSlideOrder <= 0) {
      body.heroSlideOrder = await getNextOrder('heroSlideOrder', id)
    }
  } else if (body.isHeroSlide === false) {
    body.heroSlideOrder = 0
  }

  const product = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true })
  if (!product) return Response.json({ error: 'Product not found' }, { status: 404 })
  return Response.json({ product })
}

export async function DELETE(request, { params }) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const { id } = await params
  await Product.findByIdAndUpdate(id, { isActive: false })
  return Response.json({ message: 'Product deleted' })
}
