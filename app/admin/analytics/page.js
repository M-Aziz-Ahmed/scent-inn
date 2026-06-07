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

  const metricCards = [
    { title: 'Total Orders', value: totalOrders },
    { title: 'Pending Orders', value: pendingOrders },
    { title: 'Orders This Month', value: monthOrders },
    { title: 'Orders Last Month', value: lastMonthOrders },
    { title: 'Total Products', value: totalProducts },
    { title: 'Featured Products', value: featuredProducts },
    { title: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}` },
    { title: 'Revenue This Month', value: `$${monthRevenue.toFixed(2)}` },
    { title: 'Total Views', value: totalViews },
  ]

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gold-text">Analytics</h1>
          <p className="text-gray-400 mt-2 max-w-2xl">
            A quick snapshot of orders, revenue, products, and visitor behavior. Use this page to track performance and choose top products for promotion.
          </p>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metricCards.map((card) => (
          <div key={card.title} className="bg-[#111111] border border-[#c9a84c]/20 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.25)]">
            <div className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-4">{card.title}</div>
            <div className="text-3xl font-semibold text-white">{card.value}</div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-6">
        <div className="space-y-6">
          <div className="bg-[#111111] border border-[#c9a84c]/20 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Top Products</h2>
              <span className="text-sm text-gray-500">Best selling and most viewed items</span>
            </div>
            <div className="space-y-3">
              {topProducts.map((p) => (
                <div key={p._id || p.name} className="flex items-center justify-between gap-4 bg-[#0f0f0f] rounded-2xl p-4">
                  <div>
                    <p className="font-medium text-white">{p.name}</p>
                    <p className="text-sm text-gray-500">Sales: {p.salesCount || 0}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#c9a84c]">${p.price?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111111] border border-[#c9a84c]/20 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
              <span className="text-sm text-gray-500">Latest sales activity</span>
            </div>
            <div className="space-y-3">
              {recentOrders.map((o) => (
                <div key={o._id} className="flex items-center justify-between gap-4 bg-[#0f0f0f] rounded-2xl p-4 text-sm">
                  <div>
                    <p className="font-medium text-white">Order {o._id.slice(-6)}</p>
                    <p className="text-gray-500">{o.status}</p>
                  </div>
                  <div className="text-right text-[#c9a84c]">${o.total?.toFixed(2) || '0.00'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#111111] border border-[#c9a84c]/20 rounded-3xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Top Viewed Products</h2>
            <div className="space-y-3">
              {topViewedAgg.map((t) => (
                <div key={t.slug} className="flex items-center justify-between gap-4 bg-[#0f0f0f] rounded-2xl p-4 text-sm">
                  <div>
                    <p className="font-medium text-white">{t.name || t.slug}</p>
                  </div>
                  <div className="text-[#c9a84c]">{t.views} views</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111111] border border-[#c9a84c]/20 rounded-3xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Top Referrers</h2>
            <ul className="space-y-3 text-sm text-gray-200">
              {topReferrers.map((r) => (
                <li key={r._id} className="flex items-center justify-between gap-4 bg-[#0f0f0f] rounded-2xl p-4">
                  <span>{r._id}</span>
                  <span className="text-[#c9a84c]">{r.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
