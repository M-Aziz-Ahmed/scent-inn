'use client'
import { useState, useEffect, useCallback } from 'react'

const STATUS_COLORS = {
  pending: 'text-yellow-400 bg-yellow-900/30',
  confirmed: 'text-blue-400 bg-blue-900/30',
  processing: 'text-purple-400 bg-purple-900/30',
  shipped: 'text-cyan-400 bg-cyan-900/30',
  delivered: 'text-green-400 bg-green-900/30',
  cancelled: 'text-red-400 bg-red-900/30',
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button onClick={copy} className="text-xs text-[#c9a84c] hover:underline ml-1">
      {copied ? '✓' : 'copy'}
    </button>
  )
}

export default function AffiliatesClient() {
  const [affiliates, setAffiliates] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', code: '' })
  const [baseUrl, setBaseUrl] = useState('')

  useEffect(() => {
    setBaseUrl(window.location.origin)
  }, [])

  const fetchAffiliates = useCallback(async () => {
    setLoading(true)
    const token = localStorage.getItem('admin_token')
    const res = await fetch('/api/admin/affiliates', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setAffiliates(data.affiliates || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchAffiliates() }, [fetchAffiliates])

  async function handleCreate(e) {
    e.preventDefault()
    setCreating(true)
    setCreateError('')
    const token = localStorage.getItem('admin_token')
    const res = await fetch('/api/admin/affiliates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) { setCreateError(data.error || 'Failed'); setCreating(false); return }
    setForm({ name: '', email: '', password: '', code: '' })
    setCreating(false)
    fetchAffiliates()
  }

  async function toggleActive(aff) {
    const token = localStorage.getItem('admin_token')
    await fetch('/api/admin/affiliates', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ affiliateId: aff._id, isActive: !aff.isActive }),
    })
    fetchAffiliates()
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold gold-text">Affiliates</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Manage referral partners, see who&apos;s driving traffic and orders.
        </p>
      </div>

      {/* Create form */}
      <div className="bg-[#111111] border border-[#c9a84c]/20 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Add New Affiliate</h2>
        {createError && (
          <div className="bg-red-900/30 border border-red-500/40 text-red-300 rounded-lg p-3 text-sm mb-3">
            {createError}
          </div>
        )}
        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Name *</label>
            <input
              required value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Ali Khan"
              className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Email *</label>
            <input
              type="email" required value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="ali@example.com"
              className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Password *</label>
            <input
              type="password" required value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              placeholder="••••••••"
              className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Referral Code * <span className="text-gray-600">(e.g. ALI10)</span>
            </label>
            <div className="flex gap-2">
              <input
                required value={form.code}
                onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') }))}
                placeholder="ALI10"
                maxLength={12}
                className="flex-1 bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-[#c9a84c]/60"
              />
              <button
                type="submit" disabled={creating}
                className="btn-gold px-3 py-2 rounded-lg text-sm font-semibold disabled:opacity-60 shrink-0"
              >
                {creating ? '…' : 'Add'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-gray-400 text-sm">Loading…</div>
      ) : affiliates.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          No affiliates yet. Add one above.
        </div>
      ) : (
        <div className="space-y-4">
          {affiliates.map((aff) => {
            const shopLink = `${baseUrl}/shop?ref=${aff.code}`
            const isExpanded = expanded === aff._id
            return (
              <div
                key={aff._id}
                className={`bg-[#111111] border rounded-2xl overflow-hidden transition-colors ${
                  aff.isActive ? 'border-[#c9a84c]/20' : 'border-gray-700/40 opacity-70'
                }`}
              >
                {/* Row summary */}
                <div className="flex flex-wrap items-center gap-4 p-5">
                  {/* Avatar / initials */}
                  <div className="w-10 h-10 rounded-full bg-[#c9a84c]/15 flex items-center justify-center text-[#c9a84c] font-bold text-sm shrink-0">
                    {aff.admin?.name?.charAt(0).toUpperCase() || '?'}
                  </div>

                  {/* Name + email */}
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium truncate">{aff.admin?.name}</p>
                    <p className="text-gray-500 text-xs truncate">{aff.admin?.email}</p>
                  </div>

                  {/* Code badge */}
                  <div className="shrink-0">
                    <span className="bg-[#c9a84c]/10 text-[#c9a84c] font-mono font-bold text-xs px-3 py-1 rounded-full border border-[#c9a84c]/30">
                      {aff.code}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-5 text-center shrink-0">
                    <div>
                      <p className="text-white font-semibold">{aff.totalClicks}</p>
                      <p className="text-gray-500 text-xs">clicks</p>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{aff.totalOrders}</p>
                      <p className="text-gray-500 text-xs">orders</p>
                    </div>
                    <div>
                      <p className="text-[#c9a84c] font-semibold">PKR {Number(aff.totalRevenue || 0).toLocaleString()}</p>
                      <p className="text-gray-500 text-xs">revenue</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setExpanded(isExpanded ? null : aff._id)}
                      className="text-xs btn-outline-gold px-3 py-1.5 rounded-lg"
                    >
                      {isExpanded ? 'Hide' : 'Details'}
                    </button>
                    <button
                      onClick={() => toggleActive(aff)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                        aff.isActive
                          ? 'border-red-500/40 text-red-400 hover:bg-red-900/20'
                          : 'border-green-500/40 text-green-400 hover:bg-green-900/20'
                      }`}
                    >
                      {aff.isActive ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>

                {/* Expanded section */}
                {isExpanded && (
                  <div className="border-t border-[#c9a84c]/10 p-5 space-y-4 bg-[#0d0d0d]">
                    {/* Shop link */}
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Shop referral link</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 bg-[#1a1a1a] text-[#c9a84c] text-xs rounded-lg px-3 py-2 truncate">
                          {shopLink}
                        </code>
                        <CopyButton text={shopLink} />
                      </div>
                    </div>

                    {/* Recent orders */}
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Recent referred orders</p>
                      {aff.recentOrders?.length > 0 ? (
                        <div className="space-y-2">
                          {aff.recentOrders.map((o) => (
                            <div key={o._id} className="flex items-center justify-between gap-4 bg-[#111111] rounded-xl px-4 py-2.5 text-sm">
                              <div>
                                <span className="text-white font-medium">{o.orderNumber}</span>
                                <span className="text-gray-500 text-xs ml-2">{o.customer?.name}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-[#c9a84c] text-sm font-semibold">
                                  PKR {Number(o.total || 0).toLocaleString()}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[o.status] || 'text-gray-400 bg-gray-800'}`}>
                                  {o.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600 text-xs">No referred orders yet</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
