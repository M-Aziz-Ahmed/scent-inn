import { connectDB } from '@/lib/db'
import Order from '@/models/Order'
import Product from '@/models/Product'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET(request) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  const [
    totalOrders,
    pendingOrders,
    monthOrders,
    lastMonthOrders,
    totalProducts,
    featuredProducts,
    revenueResult,
    monthRevenueResult,
    topProducts,
    recentOrders,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: 'pending' }),
    Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Order.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
    Product.countDocuments({ isActive: true }),
    Product.countDocuments({ isFeatured: true, isActive: true }),
    Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfMonth }, status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Product.find({ isActive: true }).sort({ salesCount: -1 }).limit(5).select('name salesCount price images').lean(),
    Order.find().sort({ createdAt: -1 }).limit(5).lean(),
  ])

  return Response.json({
    totalOrders,
    pendingOrders,
    monthOrders,
    lastMonthOrders,
    totalProducts,
    featuredProducts,
    totalRevenue: revenueResult[0]?.total || 0,
    monthRevenue: monthRevenueResult[0]?.total || 0,
    topProducts,
    recentOrders,
  })
}
