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

export async function PUT(request, { params }) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const { id } = await params
  const body = await request.json()

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
