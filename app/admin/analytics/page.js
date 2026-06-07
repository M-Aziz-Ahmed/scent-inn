import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/db'
import Order from '@/models/Order'
import Product from '@/models/Product'

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

  const totalRevenue = revenueResult[0]?.total || 0
  const monthRevenue = monthRevenueResult[0]?.total || 0

  return (
    <div className="admin-analytics container">
      <h1>Analytics</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        <div style={{ padding: 12, border: '1px solid #ddd' }}>
          <strong>Total Orders</strong>
          <div>{totalOrders}</div>
        </div>
        <div style={{ padding: 12, border: '1px solid #ddd' }}>
          <strong>Pending Orders</strong>
          <div>{pendingOrders}</div>
        </div>
        <div style={{ padding: 12, border: '1px solid #ddd' }}>
          <strong>Orders This Month</strong>
          <div>{monthOrders}</div>
        </div>
        <div style={{ padding: 12, border: '1px solid #ddd' }}>
          <strong>Orders Last Month</strong>
          <div>{lastMonthOrders}</div>
        </div>
        <div style={{ padding: 12, border: '1px solid #ddd' }}>
          <strong>Total Products</strong>
          <div>{totalProducts}</div>
        </div>
        <div style={{ padding: 12, border: '1px solid #ddd' }}>
          <strong>Featured Products</strong>
          <div>{featuredProducts}</div>
        </div>
        <div style={{ padding: 12, border: '1px solid #ddd' }}>
          <strong>Total Revenue</strong>
          <div>${totalRevenue.toFixed(2)}</div>
        </div>
        <div style={{ padding: 12, border: '1px solid #ddd' }}>
          <strong>Revenue This Month</strong>
          <div>${monthRevenue.toFixed(2)}</div>
        </div>
      </div>

      <section style={{ marginTop: 24 }}>
        <h2>Top Products</h2>
        <ul>
          {topProducts.map((p) => (
            <li key={p._id || p.name}>
              {p.name} — sold {p.salesCount || 0} — ${p.price?.toFixed(2) || '0.00'}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Recent Orders</h2>
        <ul>
          {recentOrders.map((o) => (
            <li key={o._id}>{o._id} — {o.status} — ${o.total?.toFixed(2) || '0.00'}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
