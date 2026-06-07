'use client'
import { useState, useEffect, useCallback } from 'react'
import AdminNav from '../AdminNav'

const STATUS_COLORS = {
  pending: 'bg-yellow-900/40 text-yellow-400',
  confirmed: 'bg-blue-900/40 text-blue-400',
  processing: 'bg-purple-900/40 text-purple-400',
  shipped: 'bg-indigo-900/40 text-indigo-400',
  delivered: 'bg-green-900/40 text-green-400',
  cancelled: 'bg-red-900/40 text-red-400',
}

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

export default function OrdersClient() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const token = localStorage.getItem('admin_token')
    const qs = new URLSearchParams({ page, limit: 20 })
    if (filter) qs.set('status', filter)
    const res = await fetch(`/api/orders?${qs}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setOrders(data.orders || [])
    setTotalPages(data.pagination?.pages || 1)
    setLoading(false)
  }, [page, filter])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('admin_token')
    await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    })
    fetchOrders()
    if (selectedOrder?._id === id) {
      setSelectedOrder((prev) => ({ ...prev, status }))
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* <AdminNav /> */}
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6">Orders</h1>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => { setFilter(''); setPage(1) }}
              className={`px-3 py-1.5 rounded-full text-sm transition ${!filter ? 'bg-[#c9a84c] text-black font-semibold' : 'border border-[#c9a84c]/30 text-gray-400 hover:border-[#c9a84c]'}`}
            >
              All
            </button>
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => { setFilter(s); setPage(1) }}
                className={`px-3 py-1.5 rounded-full text-sm capitalize transition ${filter === s ? 'bg-[#c9a84c] text-black font-semibold' : 'border border-[#c9a84c]/30 text-gray-400 hover:border-[#c9a84c]'}`}
              >
                {s}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-gray-400">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-gray-400">No orders found</p>
            </div>
          ) : (
            <>
              <div className="card-dark rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#c9a84c]/20">
                      <th className="text-left p-4 text-gray-400 font-medium">Order</th>
                      <th className="text-left p-4 text-gray-400 font-medium hidden md:table-cell">Customer</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Total</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b border-[#c9a84c]/10 hover:bg-white/2">
                        <td className="p-4">
                          <p className="text-white font-medium">{order.orderNumber}</p>
                          <p className="text-gray-500 text-xs">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <p className="text-white">{order.customer?.name}</p>
                          <p className="text-gray-500 text-xs">{order.customer?.phone}</p>
                        </td>
                        <td className="p-4 text-[#c9a84c] font-semibold">
                          PKR {order.total?.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_COLORS[order.status]}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-xs btn-outline-gold px-3 py-1 rounded-lg"
                            >
                              View
                            </button>
                            <select
                              value={order.status}
                              onChange={(e) => updateStatus(order._id, e.target.value)}
                              className="text-xs bg-[#1a1a1a] border border-[#c9a84c]/20 text-gray-300 rounded-lg px-2 py-1"
                            >
                              {STATUSES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`px-3 py-1.5 rounded-lg text-sm ${p === page ? 'btn-gold' : 'btn-outline-gold'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#c9a84c]/20 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#c9a84c]">
                Order {selectedOrder.orderNumber}
              </h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="card-dark rounded-xl p-4">
                <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2">Customer</h3>
                <p className="text-white">{selectedOrder.customer?.name}</p>
                <p className="text-gray-400">{selectedOrder.customer?.phone}</p>
                <p className="text-gray-400">{selectedOrder.customer?.email}</p>
              </div>

              <div className="card-dark rounded-xl p-4">
                <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2">Shipping Address</h3>
                <p className="text-white">
                  {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}
                </p>
                <p className="text-gray-400">
                  {selectedOrder.shippingAddress?.state}, {selectedOrder.shippingAddress?.country}
                </p>
              </div>

              <div className="card-dark rounded-xl p-4">
                <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2">Items</h3>
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex justify-between py-1">
                    <span className="text-white">{item.name} × {item.quantity}</span>
                    <span className="text-[#c9a84c]">PKR {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t border-[#c9a84c]/20 mt-2 pt-2 flex justify-between font-semibold">
                  <span className="text-white">Total</span>
                  <span className="text-[#c9a84c]">PKR {selectedOrder.total?.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">Update Status</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateStatus(selectedOrder._id, e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 text-white rounded-lg px-3 py-2 text-sm"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
