'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cartContext'
import { getShippingCost } from '@/lib/shipping'
import { getStoredAffiliateCode } from '@/components/AffiliateTracker'
import Link from 'next/link'

const INPUT = 'w-full border border-[#e5e5e5] px-3 py-2.5 text-sm text-[#1a1a1a] placeholder-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition bg-white'

export default function CheckoutForm() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const [shippingRates, setShippingRates] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    street: '', city: '', state: '', postalCode: '', country: 'Pakistan',
    paymentMethod: 'cod', notes: '',
  })

  const cityOptions = useMemo(
    () => shippingRates ? Object.keys(shippingRates).filter((c) => c !== 'default') : [],
    [shippingRates]
  )
  const formatCity = (c) => c.replace(/-/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase())
  const shippingCost = useMemo(() => getShippingCost(form.city, shippingRates), [form.city, shippingRates])
  const orderTotal = subtotal + shippingCost

  useEffect(() => {
    fetch('/api/shipping').then((r) => r.json()).then((d) => setShippingRates(d.rates || null)).catch(() => {})
  }, [])

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (items.length === 0) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name: form.name, email: form.email, phone: form.phone },
          shippingAddress: { street: form.street, city: form.city, state: form.state, postalCode: form.postalCode, country: form.country },
          items: items.map((i) => ({
            product: i._id,
            quantity: i.qty,
            // pass size/color in notes if needed
            ...(i.size || i.color ? { variantNote: [i.size, i.color].filter(Boolean).join(' / ') } : {}),
          })),
          paymentMethod: form.paymentMethod,
          notes: [form.notes, ...items.filter(i => i.size || i.color).map(i => `${i.name}: ${[i.size, i.color].filter(Boolean).join('/')}`)].filter(Boolean).join('\n'),
          shippingCost,
          affiliateCode: getStoredAffiliateCode(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to place order')
      clearCart()
      router.push(`/order/success?order=${data.orderNumber}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Redirect if cart is empty (client-side only)
  if (typeof window !== 'undefined' && items.length === 0 && !loading) {
    // handled via empty state below
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

      {/* Left — form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="border border-red-300 bg-red-50 text-red-600 p-3 text-xs">{error}</div>}

        {/* Contact */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#1a1a1a] mb-3">Contact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#555] mb-1">Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name" className={INPUT} />
            </div>
            <div>
              <label className="block text-xs text-[#555] mb-1">Phone *</label>
              <input name="phone" value={form.phone} onChange={handleChange} required placeholder="03XX-XXXXXXX" className={INPUT} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-[#555] mb-1">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com (optional)" className={INPUT} />
            </div>
          </div>
        </section>

        {/* Shipping */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#1a1a1a] mb-3">Shipping Address</h2>
          <div className="space-y-3">
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
                  <p className="text-[11px] text-[#999] mt-1">Shipping: PKR {shippingCost.toLocaleString()}</p>
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
          </div>
        </section>

        {/* Payment */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#1a1a1a] mb-3">Payment Method</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'cod', label: 'Cash on Delivery' },
              { value: 'easypaisa', label: 'EasyPaisa' },
              { value: 'jazzcash', label: 'JazzCash' },
              { value: 'bank_transfer', label: 'Bank Transfer' },
            ].map((pm) => (
              <label key={pm.value}
                className={`flex items-center gap-2 p-3 border text-xs cursor-pointer transition ${
                  form.paymentMethod === pm.value ? 'border-[#1a1a1a] font-medium text-[#1a1a1a]' : 'border-[#e5e5e5] text-[#555]'
                }`}>
                <input type="radio" name="paymentMethod" value={pm.value} checked={form.paymentMethod === pm.value}
                  onChange={handleChange} className="sr-only" />
                {pm.label}
              </label>
            ))}
          </div>
        </section>

        {/* Notes */}
        <div>
          <label className="block text-xs text-[#555] mb-1">Order Notes (optional)</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
            placeholder="Special instructions, size preferences..." className={`${INPUT} resize-none`} />
        </div>

        <button type="submit" disabled={loading || items.length === 0}
          className="w-full bg-[#1a1a1a] text-white text-sm font-medium py-4 hover:bg-[#333] transition disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Placing Order…' : `Place Order — PKR ${orderTotal.toLocaleString()}`}
        </button>
        <p className="text-[11px] text-[#bbb] text-center">By placing an order you agree to our terms and conditions.</p>
      </form>

      {/* Right — order summary */}
      <div className="lg:sticky lg:top-20 h-fit">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#1a1a1a] mb-4">Order Summary</h2>

        {items.length === 0 ? (
          <div className="border border-[#e5e5e5] p-6 text-center">
            <p className="text-sm text-[#999] mb-3">Your cart is empty</p>
            <Link href="/shop" className="text-xs underline text-[#555]">Browse products</Link>
          </div>
        ) : (
          <div className="border border-[#e5e5e5]">
            {/* Items */}
            <div className="divide-y divide-[#f0f0f0]">
              {items.map((item) => (
                <div key={item.key} className="flex gap-3 p-4">
                  <div className="w-14 h-16 bg-[#f5f5f5] shrink-0 overflow-hidden relative">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-xl opacity-20">👗</div>}
                    <span className="absolute -top-1.5 -right-1.5 bg-[#555] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {item.qty}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#1a1a1a] line-clamp-2 leading-snug">{item.name}</p>
                    {(item.size || item.color) && (
                      <p className="text-[11px] text-[#999] mt-0.5">{[item.size, item.color].filter(Boolean).join(' · ')}</p>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-[#1a1a1a] shrink-0">
                    PKR {(item.price * item.qty).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-[#e5e5e5] p-4 space-y-2 text-xs">
              <div className="flex justify-between text-[#555]">
                <span>Subtotal</span>
                <span>PKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#555]">
                <span>Shipping</span>
                <span>{shippingCost > 0 ? `PKR ${shippingCost.toLocaleString()}` : form.city ? 'Free' : '—'}</span>
              </div>
              <div className="flex justify-between font-semibold text-[#1a1a1a] text-sm pt-2 border-t border-[#e5e5e5]">
                <span>Total</span>
                <span>PKR {orderTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
