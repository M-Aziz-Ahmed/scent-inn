import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/db'
import Order from '@/models/Order'
import Product from '@/models/Product'
import ProductView from '@/models/ProductView'

export default async function AnalyticsPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin')

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

  const [totalViews, topViewedAgg, topReferrers] = await Promise.all([
    ProductView.countDocuments(),
    ProductView.aggregate([
      { $group: { _id: '$slug', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'slug',
          as: 'product',
        },
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      { $project: { slug: '$_id', views: 1, name: '$product.name' } },
    ]),
    ProductView.aggregate([
      { $group: { _id: { $ifNull: ['$referrer', 'direct'] }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
  ])

  const totalRevenue = revenueResult[0]?.total || 0
  const monthRevenue = monthRevenueResult[0]?.total || 0

  return (
    <div className="admin-analytics container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold gold-text">Analytics</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-[#0f0f0f] border border-[#c9a84c]/20 p-4 rounded">
          <div className="text-sm text-gray-400">Total Orders</div>
          <div className="text-xl font-semibold">{totalOrders}</div>
        </div>

        <div className="bg-[#0f0f0f] border border-[#c9a84c]/20 p-4 rounded">
          <div className="text-sm text-gray-400">Pending Orders</div>
          <div className="text-xl font-semibold">{pendingOrders}</div>
        </div>

        <div className="bg-[#0f0f0f] border border-[#c9a84c]/20 p-4 rounded">
          <div className="text-sm text-gray-400">Orders This Month</div>
          <div className="text-xl font-semibold">{monthOrders}</div>
        </div>

        <div className="bg-[#0f0f0f] border border-[#c9a84c]/20 p-4 rounded">
          <div className="text-sm text-gray-400">Orders Last Month</div>
          <div className="text-xl font-semibold">{lastMonthOrders}</div>
        </div>

        <div className="bg-[#0f0f0f] border border-[#c9a84c]/20 p-4 rounded">
          <div className="text-sm text-gray-400">Total Products</div>
          <div className="text-xl font-semibold">{totalProducts}</div>
        </div>

        <div className="bg-[#0f0f0f] border border-[#c9a84c]/20 p-4 rounded">
          <div className="text-sm text-gray-400">Featured Products</div>
          <div className="text-xl font-semibold">{featuredProducts}</div>
        </div>

        <div className="bg-[#0f0f0f] border border-[#c9a84c]/20 p-4 rounded">
          <div className="text-sm text-gray-400">Total Revenue</div>
          <div className="text-xl font-semibold">${totalRevenue.toFixed(2)}</div>
        </div>

        <div className="bg-[#0f0f0f] border border-[#c9a84c]/20 p-4 rounded">
          <div className="text-sm text-gray-400">Revenue This Month</div>
          <div className="text-xl font-semibold">${monthRevenue.toFixed(2)}</div>
        </div>

        <div className="bg-[#0f0f0f] border border-[#c9a84c]/20 p-4 rounded">
          <div className="text-sm text-gray-400">Total Views</div>
          <div className="text-xl font-semibold">{totalViews}</div>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Top Products</h2>
        <ul className="list-disc ml-6 text-sm text-gray-200">
          {topProducts.map((p) => (
            <li key={p._id || p.name} className="mb-1">
              {p.name} — sold {p.salesCount || 0} — ${p.price?.toFixed(2) || '0.00'}
            </li>
          ))}
        </ul>

        <h3 className="mt-6 text-sm font-medium text-gray-300">Top Viewed Products</h3>
        <ul className="list-disc ml-6 text-sm text-gray-200">
          {topViewedAgg.map((t) => (
            <li key={t.slug} className="mb-1">{t.name || t.slug} — {t.views} views</li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Recent Orders</h2>
        <ul className="list-disc ml-6 text-sm text-gray-200">
          {recentOrders.map((o) => (
            <li key={o._id} className="mb-1">{o._id} — {o.status} — ${o.total?.toFixed(2) || '0.00'}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Top Referrers</h2>
        <ul className="list-disc ml-6 text-sm text-gray-200">
          {topReferrers.map((r) => (
            <li key={r._id} className="mb-1">{r._id} — {r.count}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
