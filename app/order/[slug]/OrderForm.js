'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getShippingCost } from '@/lib/shipping'
import { getStoredAffiliateCode } from '@/components/AffiliateTracker'

export default function OrderForm({ product }) {
  const router = useRouter()
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shippingRates, setShippingRates] = useState(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Pakistan',
    paymentMethod: 'cod',
    notes: '',
  })

  const total = product.price * qty

  const cityOptions = useMemo(
    () => shippingRates ? Object.keys(shippingRates).filter((city) => city !== 'default') : [],
    [shippingRates]
  )

  const formatCityLabel = (city) =>
    city
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const shippingCost = getShippingCost(form.city, shippingRates)
      const affiliateCode = getStoredAffiliateCode()
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
          },
          shippingAddress: {
            street: form.street,
            city: form.city,
            state: form.state,
            postalCode: form.postalCode,
            country: form.country,
          },
          items: [{ product: product._id, quantity: qty }],
          paymentMethod: form.paymentMethod,
          notes: form.notes,
          shippingCost,
          affiliateCode,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to place order')

      router.push(`/order/success?order=${data.orderNumber}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('/api/shipping')
        const data = await res.json()
        setShippingRates(data.rates || null)
      } catch {
        setShippingRates(null)
      }
    }
    fetchRates()
  }, [])

  const shippingCost = useMemo(() => getShippingCost(form.city, shippingRates), [form.city, shippingRates])
  const orderTotal = total + shippingCost

  return (
    <form onSubmit={handleSubmit} className="card-dark rounded-2xl p-6 space-y-5">
      <h2 className="text-xl font-semibold text-[#c9a84c]">Your Details</h2>

      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-300 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Full Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Your full name"
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a84c]/60 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Phone *</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="03XX-XXXXXXX"
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a84c]/60 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="your@email.com (optional)"
          className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a84c]/60 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Street Address *</label>
        <input
          name="street"
          value={form.street}
          onChange={handleChange}
          required
          placeholder="House #, Street, Area"
          className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a84c]/60 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">City *</label>
          {shippingRates && cityOptions.length > 0 ? (
            <>
              <select
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#c9a84c]/60 text-sm"
              >
                <option value="">Select your city</option>
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {formatCityLabel(city)}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-2">
                Choose your delivery city from the list configured in admin.
              </p>
            </>
          ) : (
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              placeholder="Karachi"
              className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a84c]/60 text-sm"
            />
          )}
          {form.city && shippingRates && (
            <p className="text-xs text-gray-400 mt-2">
              Shipping fee: <span className="text-[#c9a84c]">PKR {shippingCost?.toLocaleString()}</span>
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Province *</label>
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            required
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#c9a84c]/60 text-sm"
          >
            <option value="">Select</option>
            <option>Punjab</option>
            <option>Sindh</option>
            <option>KPK</option>
            <option>Balochistan</option>
            <option>Islamabad</option>
            <option>AJK</option>
            <option>Gilgit-Baltistan</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Postal Code</label>
        <input
          name="postalCode"
          value={form.postalCode}
          onChange={handleChange}
          placeholder="75500"
          className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a84c]/60 text-sm"
        />
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Quantity</label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-9 h-9 rounded-full border border-[#c9a84c]/40 text-[#c9a84c] hover:bg-[#c9a84c]/10 transition flex items-center justify-center text-lg"
          >
            −
          </button>
          <span className="text-white font-semibold w-8 text-center">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="w-9 h-9 rounded-full border border-[#c9a84c]/40 text-[#c9a84c] hover:bg-[#c9a84c]/10 transition flex items-center justify-center text-lg"
          >
            +
          </button>
          <span className="text-gray-400 text-sm ml-2">
            Total: <span className="text-[#c9a84c] font-bold">PKR {total.toLocaleString()}</span>
          </span>
        </div>
      </div>

      {/* Payment */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Payment Method</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'cod', label: '💵 Cash on Delivery' },
            { value: 'easypaisa', label: '📱 EasyPaisa' },
            { value: 'jazzcash', label: '📱 JazzCash' },
            { value: 'bank_transfer', label: '🏦 Bank Transfer' },
          ].map((pm) => (
            <label
              key={pm.value}
              className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition text-sm ${
                form.paymentMethod === pm.value
                  ? 'border-[#c9a84c] bg-[#c9a84c]/10 text-white'
                  : 'border-[#c9a84c]/20 text-gray-400 hover:border-[#c9a84c]/40'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={pm.value}
                checked={form.paymentMethod === pm.value}
                onChange={handleChange}
                className="sr-only"
              />
              {pm.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Order Notes (optional)</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={2}
          placeholder="Any special instructions..."
          className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#c9a84c]/60 text-sm resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-gold py-4 rounded-full text-lg font-bold disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Placing Order...' : `Place Order — PKR ${orderTotal.toLocaleString()}`}
      </button>

      <p className="text-center text-xs text-gray-500">
        By placing an order you agree to our terms and conditions.
      </p>
    </form>
  )
}
