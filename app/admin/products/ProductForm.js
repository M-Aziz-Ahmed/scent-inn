'use client'
import { useState } from 'react'
import ImageUploader from '@/components/ImageUploader'

const CATEGORIES = ['men', 'women', 'unisex', 'gift-sets', 'oud', 'floral', 'fresh', 'oriental']

export default function ProductForm({ product, onClose }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    shortDescription: product?.shortDescription || '',
    price: product?.price || '',
    comparePrice: product?.comparePrice || '',
    category: product?.category || 'men',
    volume: product?.volume || '',
    images: product?.images || [],
    inStock: product?.inStock ?? true,
    isFeatured: product?.isFeatured || false,
    isHeroSlide: product?.isHeroSlide || false,
    heroSlideTagline: product?.heroSlideTagline || '',
    featuredOrder: product?.featuredOrder || 0,
    heroSlideOrder: product?.heroSlideOrder || 0,
    topNotes: product?.notes?.top?.join(', ') || '',
    middleNotes: product?.notes?.middle?.join(', ') || '',
    baseNotes: product?.notes?.base?.join(', ') || '',
    tags: product?.tags?.join(', ') || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const token = localStorage.getItem('admin_token')
    const payload = {
      name: form.name,
      slug: form.slug || undefined,
      description: form.description,
      shortDescription: form.shortDescription,
      price: Number(form.price),
      comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
      category: form.category,
      volume: form.volume,
      images: form.images,
      inStock: form.inStock,
      isFeatured: form.isFeatured,
      isHeroSlide: form.isHeroSlide,
      heroSlideTagline: form.heroSlideTagline,
      featuredOrder: Number(form.featuredOrder),
      heroSlideOrder: Number(form.heroSlideOrder),
      notes: {
        top: form.topNotes.split(',').map((s) => s.trim()).filter(Boolean),
        middle: form.middleNotes.split(',').map((s) => s.trim()).filter(Boolean),
        base: form.baseNotes.split(',').map((s) => s.trim()).filter(Boolean),
      },
      tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
    }

    try {
      const url = product ? `/api/products/${product._id}` : '/api/products'
      const method = product ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save product')
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-[#c9a84c]">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-white text-xl">
          ✕
        </button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-300 rounded-lg p-3 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs text-gray-400 mb-1">Product Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60" />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Slug (auto-generated if empty)</label>
          <input name="slug" value={form.slug} onChange={handleChange}
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60" />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Category *</label>
          <select name="category" value={form.category} onChange={handleChange}
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c.replace('-', ' ')}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Price (PKR) *</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} required min="0"
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60" />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Compare Price (PKR)</label>
          <input name="comparePrice" type="number" value={form.comparePrice} onChange={handleChange} min="0"
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60" />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Volume (e.g. 100ml)</label>
          <input name="volume" value={form.volume} onChange={handleChange}
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60" />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs text-gray-400 mb-1">Short Description</label>
          <input name="shortDescription" value={form.shortDescription} onChange={handleChange}
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60" />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs text-gray-400 mb-1">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={3}
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60 resize-none" />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs text-gray-400 mb-1">Product Images</label>
          <ImageUploader
            images={form.images}
            onChange={(urls) => setForm((p) => ({ ...p, images: urls }))}
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Top Notes (comma separated)</label>
          <input name="topNotes" value={form.topNotes} onChange={handleChange} placeholder="Bergamot, Lemon"
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60" />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Middle Notes (comma separated)</label>
          <input name="middleNotes" value={form.middleNotes} onChange={handleChange} placeholder="Rose, Jasmine"
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60" />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Base Notes (comma separated)</label>
          <input name="baseNotes" value={form.baseNotes} onChange={handleChange} placeholder="Oud, Musk, Amber"
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60" />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Tags (comma separated)</label>
          <input name="tags" value={form.tags} onChange={handleChange} placeholder="luxury, oud, gift"
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60" />
        </div>
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
        {[
          { name: 'inStock', label: 'In Stock' },
          { name: 'isFeatured', label: 'Featured' },
          { name: 'isHeroSlide', label: 'Hero Slide' },
        ].map((toggle) => (
          <label key={toggle.name} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name={toggle.name}
              checked={form[toggle.name]}
              onChange={handleChange}
              className="w-4 h-4 accent-[#c9a84c]"
            />
            <span className="text-sm text-gray-300">{toggle.label}</span>
          </label>
        ))}
      </div>

      {(form.isFeatured || form.isHeroSlide) && (
        <div className="grid grid-cols-2 gap-4">
          {form.isFeatured && (
            <div>
              <label className="block text-xs text-gray-400 mb-1">Featured Order</label>
              <input name="featuredOrder" type="number" value={form.featuredOrder} onChange={handleChange} min="0"
                className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60" />
            </div>
          )}
          {form.isHeroSlide && (
            <div>
              <label className="block text-xs text-gray-400 mb-1">Hero Slide Order</label>
              <input name="heroSlideOrder" type="number" value={form.heroSlideOrder} onChange={handleChange} min="0"
                className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60" />
            </div>
          )}
        </div>
      )}

      {form.isHeroSlide && (
        <div>
          <label className="block text-xs text-gray-400 mb-1">Hero Slide Tagline</label>
          <input name="heroSlideTagline" value={form.heroSlideTagline} onChange={handleChange}
            placeholder="The Essence of Royalty"
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60" />
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="flex-1 btn-gold py-2.5 rounded-lg font-semibold disabled:opacity-60">
          {loading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
        </button>
        <button type="button" onClick={onClose} className="px-4 py-2.5 btn-outline-gold rounded-lg">
          Cancel
        </button>
      </div>
    </form>
  )
}
