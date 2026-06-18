'use client'
import { useState, useEffect, useCallback } from 'react'

const STATUS_COLORS = {
  pending: 'text-yellow-400',
  confirmed: 'text-blue-400',
  processing: 'text-purple-400',
  shipped: 'text-cyan-400',
  delivered: 'text-green-400',
  cancelled: 'text-red-400',
}

export default function AffiliatePortal() {
  // null = not yet checked, false = not logged in, object = logged in
  const [session, setSession] = useState(null)
  const [data, setData] = useState(null)
  const [dataError, setDataError] = useState('')
  const [dataLoading, setDataLoading] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [copied, setCopied] = useState('')

  // ── Load session from localStorage on mount ──────────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem('affiliate_session')
      if (stored) {
        const parsed = JSON.parse(stored)
        // Basic sanity check
        if (parsed?.token && parsed?.affiliateCode) {
          setSession(parsed)
          return
        }
      }
    } catch {}
    setSession(false) // explicitly not logged in
  }, [])

  // ── Fetch dashboard data whenever we have a valid session ─────────
  const fetchData = useCallback(async (token) => {
    setDataLoading(true)
    setDataError('')
    try {
      const res = await fetch('/api/affiliate/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (!res.ok) {
        // Token expired or invalid — log out
        if (res.status === 401) {
          localStorage.removeItem('affiliate_session')
          setSession(false)
          return
        }
        throw new Error(json.error || 'Failed to load dashboard')
      }
      setData(json)
    } catch (err) {
      setDataError(err.message)
    } finally {
      setDataLoading(false)
    }
  }, [])

  useEffect(() => {
    if (session && session.token) {
      fetchData(session.token)
    }
  }, [session, fetchData])

  // ── Login ────────────────────────────────────────────────────────
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

  // ── Logout ───────────────────────────────────────────────────────
  function logout() {
    localStorage.removeItem('affiliate_session')
    setSession(false)
    setData(null)
    setDataError('')
  }

  // ── Copy helper ──────────────────────────────────────────────────
  function copyLink(url) {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(url)
      setTimeout(() => setCopied(''), 2500)
    })
  }

  // ── Still checking localStorage ─────────────────────────────────
  if (session === null) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // ── Login screen ─────────────────────────────────────────────────
  if (session === false) {
    return (
      <div className="max-w-sm mx-auto mt-12">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🤝</div>
          <h1 className="text-2xl font-bold text-white">Affiliate Portal</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to access your referral dashboard</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-[#111111] border border-[#c9a84c]/20 rounded-2xl p-6 space-y-4"
        >
          {loginError && (
            <div className="bg-red-900/30 border border-red-500/40 text-red-300 rounded-lg p-3 text-sm">
              {loginError}
            </div>
          )}

          <div>
            <label className="block text-xs text-gray-400 mb-1">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={loginForm.password}
              onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
              className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60"
            />
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full btn-gold py-2.5 rounded-lg font-semibold disabled:opacity-60"
          >
            {loginLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Signing in…
              </span>
            ) : 'Sign In'}
          </button>
        </form>
      </div>
    )
  }

  // ── Dashboard ────────────────────────────────────────────────────
  const aff = data?.affiliate
  const orders = data?.recentOrders || []
  const shopLink = `${window.location.origin}/shop?ref=${session.affiliateCode}`

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome, {session.name} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Your code:{' '}
            <span className="text-[#c9a84c] font-mono font-bold tracking-wider">
              {session.affiliateCode}
            </span>
          </p>
        </div>
        <button
          onClick={logout}
          className="text-sm text-gray-400 hover:text-red-400 transition"
        >
          Sign out
        </button>
      </div>

      {/* Error banner */}
      {dataError && (
        <div className="bg-red-900/30 border border-red-500/40 text-red-300 rounded-xl p-4 text-sm flex items-center justify-between gap-4">
          <span>{dataError}</span>
          <button
            onClick={() => fetchData(session.token)}
            className="shrink-0 text-red-300 underline text-xs"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats */}
      {dataLoading && !aff ? (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#111111] border border-[#c9a84c]/10 rounded-2xl p-5 animate-pulse h-24" />
          ))}
        </div>
      ) : aff ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Clicks', value: aff.totalClicks },
            { label: 'Orders Referred', value: aff.totalOrders },
            { label: 'Revenue Driven', value: `PKR ${Number(aff.totalRevenue || 0).toLocaleString()}`, gold: true },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-[#111111] border border-[#c9a84c]/15 rounded-2xl p-5 text-center"
            >
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">{s.label}</p>
              <p className={`text-3xl font-bold ${s.gold ? 'text-[#c9a84c]' : 'text-white'}`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {/* Shop referral link */}
      <div className="bg-[#111111] border border-[#c9a84c]/20 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Your Shop Link</h2>
          <span className="text-xs text-gray-500">30-day attribution window</span>
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-[#1a1a1a] text-[#c9a84c] rounded-lg px-3 py-2.5 text-xs break-all">
            {shopLink}
          </code>
          <button
            onClick={() => copyLink(shopLink)}
            className="shrink-0 btn-gold px-4 py-2.5 rounded-lg text-sm font-medium"
          >
            {copied === shopLink ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Anyone who places an order after visiting via this link will be attributed to you.
        </p>
      </div>

      {/* Referred orders */}
      <div className="bg-[#111111] border border-[#c9a84c]/20 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Referred Orders</h2>
          <button
            onClick={() => fetchData(session.token)}
            disabled={dataLoading}
            className="text-xs text-gray-400 hover:text-[#c9a84c] transition disabled:opacity-40"
          >
            {dataLoading ? 'Refreshing…' : '↻ Refresh'}
          </button>
        </div>

        {dataLoading && orders.length === 0 ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#0f0f0f] rounded-xl p-3 h-12 animate-pulse" />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-2">
            {orders.map((o) => (
              <div
                key={o._id}
                className="flex items-center justify-between gap-4 bg-[#0f0f0f] rounded-xl p-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="text-white font-medium">{o.orderNumber}</p>
                  <p className="text-gray-500 text-xs truncate">{o.customer?.name}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[#c9a84c] font-semibold">
                    PKR {Number(o.total || 0).toLocaleString()}
                  </p>
                  <p className={`text-xs ${STATUS_COLORS[o.status] || 'text-gray-400'}`}>
                    {o.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No referred orders yet.</p>
            <p className="text-gray-600 text-xs mt-1">Start sharing your link to earn referrals.</p>
          </div>
        )}
      </div>
    </div>
  )
}
