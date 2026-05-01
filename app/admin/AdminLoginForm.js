'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginForm() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')

      // Store token for API calls
      localStorage.setItem('admin_token', data.token)
      router.push('/admin/dashboard')
      router.refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-dark rounded-2xl p-8 space-y-5">
      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-300 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm text-gray-400 mb-1">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          required
          placeholder="admin@scentinn.com"
          className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a84c]/60"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          required
          placeholder="••••••••"
          className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a84c]/60"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-gold py-3 rounded-lg font-semibold disabled:opacity-60"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <p className="text-center text-xs text-gray-500">
        First time? Visit <code className="text-[#c9a84c]">/admin/setup</code> to create your account.
      </p>
    </form>
  )
}
