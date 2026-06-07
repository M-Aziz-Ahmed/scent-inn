'use client'
import { useEffect, useState } from 'react'
import AdminNav from '../AdminNav'

const normalizeCity = (city) => city?.trim().toLowerCase() || ''

export default function ShippingRatesClient() {
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true)
      const res = await fetch('/api/shipping')
      const data = await res.json()
      setRates(data.rates || {})
      setLoading(false)
    }
    fetchRates()
  }, [])

  const handleRateChange = (city, value) => {
    setRates((prev) => ({ ...prev, [city]: value }))
  }

  const handleAddRow = () => {
    setRates((prev) => ({ ...prev, 'new-city': 0 }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const token = localStorage.getItem('admin_token')
      const normalized = Object.entries(rates).reduce((acc, [city, value]) => {
        const key = normalizeCity(city)
        if (!key) return acc
        acc[key] = Number(value) || 0
        return acc
      }, {})
      const res = await fetch('/api/shipping', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rates: normalized }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save shipping rates')
      setRates(data.rates)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const rows = rates ? Object.entries(rates) : []

  return (
    <div className="flex min-h-screen">
      {/* <AdminNav /> */}
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Shipping Rates</h1>
              <p className="text-gray-400">Set city-based delivery fees. Use "default" for any city not listed.</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="btn-gold px-5 py-2 rounded-lg text-sm disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Rates'}
            </button>
          </div>

          {loading ? (
            <div className="text-gray-400">Loading shipping rates...</div>
          ) : (
            <div className="card-dark rounded-2xl overflow-hidden">
              <div className="grid grid-cols-3 gap-4 p-4 border-b border-[#c9a84c]/20 text-sm text-gray-400 uppercase tracking-wide">
                <div>City</div>
                <div>Fee (PKR)</div>
                <div>Example</div>
              </div>
              <div className="space-y-3 p-4">
                {rows.map(([city, value]) => (
                  <div key={city} className="grid grid-cols-3 gap-4 items-center">
                    <input
                      value={city}
                      onChange={(e) => {
                        const newCity = e.target.value
                        setRates((prev) => {
                          const next = { ...prev }
                          delete next[city]
                          next[newCity] = value
                          return next
                        })
                      }}
                      className="w-full bg-[#111] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm"
                    />
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => handleRateChange(city, e.target.value)}
                      className="w-full bg-[#111] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm"
                    />
                    <div className="text-gray-400 text-sm">
                      {city === 'default'
                        ? 'Fallback for unlisted cities'
                        : `Shipping fee for ${city}`}
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleAddRow}
                  className="w-full text-left text-sm text-[#c9a84c] hover:text-white transition"
                >
                  + Add city rate
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-900/30 border border-red-500/50 text-red-300 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
