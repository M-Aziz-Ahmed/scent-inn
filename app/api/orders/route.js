import { connectDB } from '@/lib/db'
import Order from '@/models/Order'
import Product from '@/models/Product'
import Settings from '@/models/Settings'
import { getShippingCost, FREE_SHIPPING_THRESHOLD } from '@/lib/shipping'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET(request) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const { searchParams } = request.nextUrl
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const status = searchParams.get('status')

  const query = {}
  if (status) query.status = status

  const skip = (page - 1) * limit
  const [orders, total] = await Promise.all([
    Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments(query),
  ])

  return Response.json({
    orders,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  })
}

export async function POST(request) {
  await connectDB()
  const body = await request.json()

  // Validate products exist and get current prices
  const items = []
  let subtotal = 0

  for (const item of body.items) {
    const product = await Product.findById(item.product)
    if (!product || !product.isActive) {
      return Response.json({ error: `Product not found: ${item.product}` }, { status: 400 })
    }
    const lineTotal = product.price * item.quantity
    subtotal += lineTotal
    items.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.images?.[0] || '',
    })
  }

  const shippingSettings = await Settings.findOne({ key: 'shippingRates' }).lean()
  const shippingRates = shippingSettings?.value
  let shippingCost = getShippingCost(body.shippingAddress?.city, shippingRates)
  if (subtotal >= FREE_SHIPPING_THRESHOLD) shippingCost = 0

  const discount = body.discount || 0
  const total = subtotal + shippingCost - discount

  const order = await Order.create({
    ...body,
    items,
    subtotal,
    shippingCost,
    discount,
    total,
  })

  return Response.json({ order, orderNumber: order.orderNumber }, { status: 201 })
}
