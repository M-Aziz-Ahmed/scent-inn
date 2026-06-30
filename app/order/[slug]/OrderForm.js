'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getShippingCost } from '@/lib/shipping'
import { getStoredAffiliateCode } from '@/components/AffiliateTracker'

const INPUT = 'w-full border border-[#e5e5e5] px-3 py-2.5 text-sm text-[#1a1a1a] placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition bg-white'

export default function OrderForm({ product }) {
  const router = useRouter()
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shippingRates, setShippingRates] = useState(null)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', street: '', city: '', state: '',
    postalCode: '', country: 'Pakistan', paymentMethod: 'cod', notes: '',
  })

  const total = product.price * qty
  const cityOptions = useMemo(
    () => shippingRates ? Object.keys(shippingRates).filter((c) => c !== 'default') : [],
    [shippingRates]
  )
  const formatCity = (c) => c.replace(/-/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase())
  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  const shippingCost = useMemo(() => getShippingCost(form.city, shippingRates), [form.city, shippingRates])
  const orderTotal = total + shippingCost

  useEffect(() => {
    fetch('/api/shipping').then((r) => r.json()).then((d) => setShippingRates(d.rates || null)).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name: form.name, email: form.email, phone: form.phone },
          shippingAddress: { street: form.street, city: form.city, state: form.state, postalCode: form.postalCode, country: form.country },
          items: [{ product: product._id, quantity: qty }],
          paymentMethod: form.paymentMethod,
          notes: form.notes,
          shippingCost: getShippingCost(form.city, shippingRates),
          affiliateCode: getStoredAffiliateCode(),
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-sm font-semibold text-[#1a1a1a] uppercase tracking-wider mb-2">Your Details</h2>

      {error && <div className="border border-red-300 bg-red-50 text-red-600 p-3 text-xs">{error}</div>}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[#555] mb-1">Full Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name" className={INPUT} />
        </div>
        <div>
          <label className="block text-xs text-[#555] mb-1">Phone *</label>
          <input name="phone" value={form.phone} onChange={handleChange} required placeholder="03XX-XXXXXXX" className={INPUT} />
        </div>
      </div>

      <div>
        <label className="block text-xs text-[#555] mb-1">Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com (optional)" className={INPUT} />
      </div>

      <div>
        <label className="block text-xs text-[#555] mb-1">Street Address *</label>
        <input name="street" value={form.street} onChange={handleChange} required placeholder="House #, Street, Area" className={INPUT} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[#555] mb-1">City *</label>
          {shippingRates && cityOptions.length > 0 ? (
            <select name="city" value={form.city} onChange={handleChange} required className={INPUT}>
              <option value="">Select city</option>
              {cityOptions.map((c) => <option key={c} value={c}>{formatCity(c)}</option>)}
            </select>
          ) : (
            <input name="city" value={form.city} onChange={handleChange} required placeholder="Karachi" className={INPUT} />
          )}
          {form.city && shippingRates && (
            <p className="text-xs text-[#999] mt-1">Shipping: PKR {shippingCost?.toLocaleString()}</p>
          )}
        </div>
        <div>
          <label className="block text-xs text-[#555] mb-1">Province *</label>
          <select name="state" value={form.state} onChange={handleChange} required className={INPUT}>
            <option value="">Select</option>
            {['Punjab','Sindh','KPK','Balochistan','Islamabad','AJK','Gilgit-Baltistan'].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs text-[#555] mb-1">Postal Code</label>
        <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="75500" className={INPUT} />
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-xs text-[#555] mb-2">Quantity</label>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-8 h-8 border border-[#e5e5e5] text-[#1a1a1a] hover:border-[#1a1a1a] transition flex items-center justify-center">−</button>
          <span className="text-sm font-medium text-[#1a1a1a] w-6 text-center">{qty}</span>
          <button type="button" onClick={() => setQty((q) => q + 1)}
            className="w-8 h-8 border border-[#e5e5e5] text-[#1a1a1a] hover:border-[#1a1a1a] transition flex items-center justify-center">+</button>
          <span className="text-xs text-[#999] ml-1">Total: <span className="text-[#1a1a1a] font-medium">PKR {total.toLocaleString()}</span></span>
        </div>
      </div>

      {/* Payment */}
      <div>
        <label className="block text-xs text-[#555] mb-2">Payment Method</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'cod', label: 'Cash on Delivery' },
            { value: 'easypaisa', label: 'EasyPaisa' },
            { value: 'jazzcash', label: 'JazzCash' },
            { value: 'bank_transfer', label: 'Bank Transfer' },
          ].map((pm) => (
            <label key={pm.value}
              className={`flex items-center gap-2 p-2.5 border text-xs cursor-pointer transition ${
                form.paymentMethod === pm.value ? 'border-[#1a1a1a] text-[#1a1a1a] font-medium' : 'border-[#e5e5e5] text-[#555]'
              }`}>
              <input type="radio" name="paymentMethod" value={pm.value} checked={form.paymentMethod === pm.value}
                onChange={handleChange} className="sr-only" />
              {pm.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs text-[#555] mb-1">Order Notes (optional)</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
          placeholder="Special instructions, size preferences..." className={`${INPUT} resize-none`} />
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-[#1a1a1a] text-white text-sm font-medium py-4 hover:bg-[#333] transition disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? 'Placing Order…' : `Place Order — PKR ${orderTotal.toLocaleString()}`}
      </button>

      <p className="text-center text-[11px] text-[#bbb]">By placing an order you agree to our terms and conditions.</p>
    </form>
  )
}
