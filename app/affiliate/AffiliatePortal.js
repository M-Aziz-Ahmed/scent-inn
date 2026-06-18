'use client'
import { useState, useEffect } from 'react'

export default function AffiliatePortal() {
  const [session, setSession] = useState(null) // { token, affiliateCode, name }
  const [data, setData] = useState(null)        // { affiliate, recentOrders }
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [copied, setCopied] = useState('')

  // Restore session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('affiliate_session')
      if (stored) setSession(JSON.parse(stored))
    } catch {}
  }, [])

  // Fetch data when session exists
  useEffect(() => {
    if (!session) return
    fetch('/api/affiliate/me', {
      headers: { Authorization: `Bearer ${session.token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) setData(d) })
  }, [session])

  async function handleLogin(e) {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')
    try {
      const res = await fetch('/api/affiliate/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Login failed')
      const s = { token: d.token, affiliateCode: d.affiliateCode, name: d.name }
      localStorage.setItem('affiliate_session', JSON.stringify(s))
      setSession(s)
    } catch (err) {
      setLoginError(err.message)
    } finally {
      setLoginLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem('affiliate_session')
    setSession(null)
    setData(null)
  }

  function copyLink(url) {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(url)
      setTimeout(() => setCopied(''), 2000)
    })
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  // ── Login screen ────────────────────────────────────────────────
  if (!session) {
    return (
      <div className="max-w-sm mx-auto mt-12">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🤝</div>
          <h1 className="text-2xl font-bold text-white">Affiliate Portal</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to access your referral dashboard</p>
        </div>
        <form onSubmit={handleLogin} className="bg-[#111111] border border-[#c9a84c]/20 rounded-2xl p-6 space-y-4">
          {loginError && (
            <div className="bg-red-900/30 border border-red-500/40 text-red-300 rounded-lg p-3 text-sm">
              {loginError}
            </div>
          )}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Email</label>
            <input
              type="email" required
              value={loginForm.email}
              onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Password</label>
            <input
              type="password" required
              value={loginForm.password}
              onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
              className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60"
            />
          </div>
          <button type="submit" disabled={loginLoading}
            className="w-full btn-gold py-2.5 rounded-lg font-semibold disabled:opacity-60">
            {loginLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    )
  }

  // ── Dashboard ────────────────────────────────────────────────────
  const aff = data?.affiliate
  const orders = data?.recentOrders || []

  const shopLink = `${baseUrl}/shop?ref=${session.affiliateCode}`

  const statusColors = {
    pending: 'text-yellow-400',
    confirmed: 'text-blue-400',
    processing: 'text-purple-400',
    shipped: 'text-cyan-400',
    delivered: 'text-green-400',
    cancelled: 'text-red-400',
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome, {session.name} 👋</h1>
          <p className="text-gray-400 text-sm mt-1">
            Your code: <span className="text-[#c9a84c] font-mono font-bold">{session.affiliateCode}</span>
          </p>
        </div>
        <button onClick={logout}
          className="text-sm text-gray-400 hover:text-red-400 transition">
          Sign out
        </button>
      </div>

      {/* Stats */}
      {aff && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Clicks', value: aff.totalClicks },
            { label: 'Orders Referred', value: aff.totalOrders },
            { label: 'Revenue Driven', value: `PKR ${Number(aff.totalRevenue || 0).toLocaleString()}`, gold: true },
          ].map((s) => (
            <div key={s.label} className="bg-[#111111] border border-[#c9a84c]/15 rounded-2xl p-5 text-center">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.gold ? 'text-[#c9a84c]' : 'text-white'}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Shop link */}
      <div className="bg-[#111111] border border-[#c9a84c]/20 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-white mb-3">Your Shop Link</h2>
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-[#1a1a1a] text-[#c9a84c] rounded-lg px-3 py-2 text-xs truncate">
            {shopLink}
          </code>
          <button
            onClick={() => copyLink(shopLink)}
            className="shrink-0 btn-gold px-4 py-2 rounded-lg text-sm"
          >
            {copied === shopLink ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Share this link — anyone who orders after visiting will be attributed to you.
        </p>
      </div>

      {/* Recent orders */}
      <div className="bg-[#111111] border border-[#c9a84c]/20 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Your Referred Orders</h2>
        {orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o._id} className="flex items-center justify-between gap-4 bg-[#0f0f0f] rounded-xl p-3 text-sm">
                <div>
                  <p className="text-white font-medium">{o.orderNumber}</p>
                  <p className="text-gray-500 text-xs">{o.customer?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#c9a84c] font-semibold">PKR {Number(o.total || 0).toLocaleString()}</p>
                  <p className={`text-xs ${statusColors[o.status] || 'text-gray-400'}`}>{o.status}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No referred orders yet. Start sharing your links!</p>
        )}
      </div>
    </div>
  )
}
