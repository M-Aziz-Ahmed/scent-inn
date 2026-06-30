import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/db'
import Order from '@/models/Order'
import Product from '@/models/Product'
import ProductView from '@/models/ProductView'
import RefreshButton from './RefreshButton'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin')

  await connectDB()

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  const [
    totalOrders,
    pendingOrders,
    todayOrders,
    monthOrders,
    lastMonthOrders,
    totalProducts,
    featuredProducts,
    revenueResult,
    monthRevenueResult,
    todayRevenueResult,
    topProducts,
    recentOrders,
    totalViews,
    todayViews,
    topViewedAgg,
    topReferrers,
    ordersByStatus,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: 'pending' }),
    Order.countDocuments({ createdAt: { $gte: startOfToday } }),
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
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfToday }, status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Product.find({ isActive: true })
      .sort({ salesCount: -1 })
      .limit(5)
      .select('name salesCount price images slug')
      .lean(),
    Order.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .select('orderNumber customer total status createdAt')
      .lean(),
    ProductView.countDocuments(),
    ProductView.countDocuments({ createdAt: { $gte: startOfToday } }),
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
      {
        $project: {
          slug: '$_id',
          views: 1,
          name: '$product.name',
          image: { $arrayElemAt: ['$product.images', 0] },
        },
      },
    ]),
    ProductView.aggregate([
      { $group: { _id: { $ifNull: ['$referrer', 'direct'] }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ])

  const totalRevenue = revenueResult[0]?.total || 0
  const monthRevenue = monthRevenueResult[0]?.total || 0
  const todayRevenue = todayRevenueResult[0]?.total || 0

  const formattedReferrers = topReferrers.map((r) => {
    const id = r._id
    let label = id === 'direct' ? 'Direct / Unknown' : id
    if (id && id !== 'direct') {
      try {
        const u = new URL(id)
        label = u.hostname + (u.pathname && u.pathname !== '/' ? u.pathname.slice(0, 30) : '')
      } catch {
        if (typeof id === 'string' && id.length > 50) label = id.slice(0, 50) + '…'
      }
    }
    return { label, count: r.count }
  })

  const statusColors = {
    pending: 'text-yellow-400 bg-yellow-900/30',
    confirmed: 'text-blue-400 bg-blue-900/30',
    processing: 'text-purple-400 bg-purple-900/30',
    shipped: 'text-cyan-400 bg-cyan-900/30',
    delivered: 'text-green-400 bg-green-900/30',
    cancelled: 'text-red-400 bg-red-900/30',
  }

  const metricCards = [
    { title: 'Total Revenue', value: totalRevenue, type: 'currency', sub: `PKR ${Number(todayRevenue).toLocaleString()} today` },
    { title: 'This Month Revenue', value: monthRevenue, type: 'currency', sub: `vs last month's ${lastMonthOrders} orders` },
    { title: 'Total Orders', value: totalOrders, sub: `${pendingOrders} pending` },
    { title: 'Today\'s Orders', value: todayOrders, sub: `${monthOrders} this month` },
    { title: 'Total Products', value: totalProducts, sub: `${featuredProducts} featured` },
    { title: 'Total Page Views', value: totalViews, sub: `${todayViews} today` },
  ]

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gold-text">Analytics</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Last updated: {new Date().toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>
        <RefreshButton />
      </header>

      {/* Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricCards.map((card) => (
          <div key={card.title} className="bg-[#111111] border border-[#c9a84c]/15 rounded-2xl p-5 flex flex-col gap-2">
            <p className="text-xs uppercase tracking-widest text-gray-500">{card.title}</p>
            <p className="text-3xl font-semibold text-white">
              {card.type === 'currency'
                ? `PKR ${Number(card.value || 0).toLocaleString()}`
                : card.value}
            </p>
            {card.sub && <p className="text-xs text-gray-500">{card.sub}</p>}
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Order Status Breakdown */}
          <div className="bg-[#111111] border border-[#c9a84c]/20 rounded-3xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Orders by Status</h2>
            <div className="flex flex-wrap gap-3">
              {ordersByStatus.map((s) => (
                <div
                  key={s._id}
                  className={`px-4 py-2 rounded-xl text-sm font-medium ${statusColors[s._id] || 'text-gray-300 bg-gray-800'}`}
                >
                  {s._id} — {s.count}
                </div>
              ))}
              {ordersByStatus.length === 0 && (
                <p className="text-gray-500 text-sm">No orders yet</p>
              )}
            </div>
          </div>

          {/* Top Products by Sales */}
          <div className="bg-[#111111] border border-[#c9a84c]/20 rounded-3xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Top Products by Sales</h2>
            <div className="space-y-3">
              {topProducts.length > 0 ? topProducts.map((p, i) => (
                <div key={p._id || p.name} className="flex items-center gap-4 bg-[#0f0f0f] rounded-2xl p-3">
                  <span className="text-gray-600 text-sm w-4 shrink-0">{i + 1}</span>
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#1a1a1a] shrink-0">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">👗</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{p.name}</p>
                    <p className="text-gray-500 text-xs">{p.salesCount || 0} sold</p>
                  </div>
                  <p className="text-[#c9a84c] text-sm font-semibold shrink-0">
                    PKR {Number(p.price || 0).toLocaleString()}
                  </p>
                </div>
              )) : (
                <p className="text-gray-500 text-sm">No sales data yet</p>
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-[#111111] border border-[#c9a84c]/20 rounded-3xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Orders</h2>
            <div className="space-y-3">
              {recentOrders.length > 0 ? recentOrders.map((o) => (
                <div key={o._id} className="flex items-center justify-between gap-4 bg-[#0f0f0f] rounded-2xl p-3 text-sm">
                  <div className="min-w-0">
                    <p className="text-white font-medium">{o.orderNumber || `#${String(o._id).slice(-6).toUpperCase()}`}</p>
                    <p className="text-gray-500 text-xs truncate">{o.customer?.name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[#c9a84c] font-semibold">PKR {Number(o.total || 0).toLocaleString()}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[o.status] || 'text-gray-400 bg-gray-800'}`}>
                      {o.status}
                    </span>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-sm">No orders yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Top Viewed Products */}
          <div className="bg-[#111111] border border-[#c9a84c]/20 rounded-3xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Most Viewed Products</h2>
            <div className="space-y-3">
              {topViewedAgg.length > 0 ? topViewedAgg.map((t, i) => (
                <div key={t.slug} className="flex items-center gap-3 bg-[#0f0f0f] rounded-2xl p-3 text-sm">
                  <span className="text-gray-600 text-sm w-4 shrink-0">{i + 1}</span>
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-[#1a1a1a] shrink-0">
                    {t.image ? (
                      <img src={t.image} alt={t.name || t.slug} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-base">👗</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{t.name || t.slug}</p>
                  </div>
                  <p className="text-[#c9a84c] font-semibold shrink-0">{t.views} views</p>
                </div>
              )) : (
                <p className="text-gray-500 text-sm">No view data yet</p>
              )}
            </div>
          </div>

          {/* Top Referrers */}
          <div className="bg-[#111111] border border-[#c9a84c]/20 rounded-3xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Top Traffic Sources</h2>
            <div className="space-y-2">
              {formattedReferrers.length > 0 ? formattedReferrers.map((r, idx) => {
                const maxCount = formattedReferrers[0]?.count || 1
                const pct = Math.round((r.count / maxCount) * 100)
                return (
                  <div key={idx} className="text-sm">
                    <div className="flex justify-between text-gray-300 mb-1">
                      <span className="truncate max-w-55">{r.label}</span>
                      <span className="text-[#c9a84c] ml-2 shrink-0">{r.count}</span>
                    </div>
                    <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#c9a84c]/60 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              }) : (
                <p className="text-gray-500 text-sm">No referrer data yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
