import { connectDB } from '@/lib/db'
import Order from '@/models/Order'
import Product from '@/models/Product'
import ProductView from '@/models/ProductView'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET(request) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()

  try {
    const [totalOrders, totalRevenueAgg, recentOrders, topProducts, totalViews, topReferrers] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(10).lean(),
      Product.find({ isActive: true }).sort({ salesCount: -1 }).limit(10).select('name salesCount price').lean(),
      ProductView.countDocuments(),
      ProductView.aggregate([
        { $group: { _id: { $ifNull: ['$referrer', 'direct'] }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ])

    const totalRevenue = totalRevenueAgg[0]?.total || 0

    return Response.json({
      totalOrders,
      totalRevenue,
      recentOrders,
      topProducts,
      totalViews,
      topReferrers,
    })
  } catch (err) {
    return Response.json({ error: err.message || 'Query failed' }, { status: 500 })
  }
}
