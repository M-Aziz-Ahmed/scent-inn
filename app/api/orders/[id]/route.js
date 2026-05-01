import { connectDB } from '@/lib/db'
import Order from '@/models/Order'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET(request, { params }) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const { id } = await params
  const order = await Order.findById(id).lean()
  if (!order) return Response.json({ error: 'Order not found' }, { status: 404 })
  return Response.json({ order })
}

export async function PUT(request, { params }) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const { id } = await params
  const body = await request.json()

  const order = await Order.findByIdAndUpdate(id, body, { new: true })
  if (!order) return Response.json({ error: 'Order not found' }, { status: 404 })
  return Response.json({ order })
}
