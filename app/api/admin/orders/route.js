import { connectDB } from '@/lib/db'
import Order from '@/models/Order'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET(request) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const pendingCount = await Order.countDocuments({ status: 'pending' })
  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).lean()

  return Response.json({ pendingCount, recentOrders })
}
