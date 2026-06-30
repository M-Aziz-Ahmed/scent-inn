'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function SetupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const res = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMessage('Admin account created! You can now log in.')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gold-text">Initial Setup</h1>
          <p className="text-gray-400 mt-2">Create your admin account</p>
        </div>

        <form onSubmit={handleSubmit} className="card-dark rounded-2xl p-8 space-y-5">
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-300 rounded-lg p-3 text-sm">{error}</div>
          )}
          {message && (
            <div className="bg-green-900/30 border border-green-500/50 text-green-300 rounded-lg p-3 text-sm">
              {message}{' '}
              <Link href="/admin" className="underline">
                Go to Login
              </Link>
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
              placeholder="Admin Name"
              className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a84c]/60"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              required
              placeholder="admin@gullkar.com"
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
              minLength={8}
              placeholder="Min 8 characters"
              className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a84c]/60"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full btn-gold py-3 rounded-lg font-semibold disabled:opacity-60">
            {loading ? 'Creating...' : 'Create Admin Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
