'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminNav from '../AdminNav'

export default function AdminDashboardClient() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setStats(d))
      .finally(() => setLoading(false))
  }, [])

  const statCards = stats
    ? [
        { label: 'Total Orders', value: stats.totalOrders, sub: `${stats.pendingOrders} pending`, color: 'text-blue-400' },
        { label: 'This Month Orders', value: stats.monthOrders, sub: `vs ${stats.lastMonthOrders} last month`, color: 'text-green-400' },
        { label: 'Total Revenue', value: `PKR ${stats.totalRevenue?.toLocaleString()}`, sub: `PKR ${stats.monthRevenue?.toLocaleString()} this month`, color: 'text-[#c9a84c]' },
        { label: 'Products', value: stats.totalProducts, sub: `${stats.featuredProducts} featured`, color: 'text-purple-400' },
      ]
    : []

  return (
    <div className="flex min-h-screen">
      {/* <AdminNav /> */}
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

          {loading ? (
            <div className="text-gray-400">Loading stats...</div>
          ) : (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((card) => (
                  <div key={card.label} className="card-dark rounded-xl p-5">
                    <p className="text-gray-400 text-sm mb-1">{card.label}</p>
                    <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                    <p className="text-gray-500 text-xs mt-1">{card.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="card-dark rounded-xl p-5">
                  <h2 className="font-semibold text-[#c9a84c] mb-4">Top Selling Products</h2>
                  {stats?.topProducts?.length > 0 ? (
                    <div className="space-y-3">
                      {stats.topProducts.map((p, i) => (
                        <div key={p._id} className="flex items-center gap-3">
                          <span className="text-gray-500 text-sm w-5">{i + 1}.</span>
                          <div className="w-8 h-8 rounded bg-[#1a1a1a] flex items-center justify-center text-sm overflow-hidden">
                            {p.images?.[0] ? (
                              <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                            ) : '🌹'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm truncate">{p.name}</p>
                            <p className="text-gray-500 text-xs">{p.salesCount} sold</p>
                          </div>
                          <span className="text-[#c9a84c] text-sm">PKR {p.price?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No sales data yet</p>
                  )}
                </div>

                {/* Recent Orders */}
                <div className="card-dark rounded-xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-[#c9a84c]">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-xs text-gray-400 hover:text-[#c9a84c]">
                      View all →
                    </Link>
                  </div>
                  {stats?.recentOrders?.length > 0 ? (
                    <div className="space-y-3">
                      {stats.recentOrders.map((order) => (
                        <div key={order._id} className="flex items-center justify-between">
                          <div>
                            <p className="text-white text-sm">{order.orderNumber}</p>
                            <p className="text-gray-500 text-xs">{order.customer?.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[#c9a84c] text-sm">PKR {order.total?.toLocaleString()}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              order.status === 'pending' ? 'bg-yellow-900/40 text-yellow-400' :
                              order.status === 'delivered' ? 'bg-green-900/40 text-green-400' :
                              'bg-blue-900/40 text-blue-400'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No orders yet</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
