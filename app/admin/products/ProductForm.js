'use client'
import { useState, useEffect } from 'react'
import ImageUploader from '@/components/ImageUploader'

const GENDERS = ['men', 'women', 'kids', 'unisex']

export default function ProductForm({ product, onClose }) {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    shortDescription: product?.shortDescription || '',
    price: product?.price || '',
    comparePrice: product?.comparePrice || '',
    category: product?.category || '',
    gender: product?.gender || 'unisex',
    sizes: product?.sizes?.join(', ') || '',
    colors: product?.colors?.join(', ') || '',
    material: product?.material || '',
    sku: product?.sku || '',
    images: product?.images || [],
    inStock: product?.inStock ?? true,
    isFeatured: product?.isFeatured || false,
    isHeroSlide: product?.isHeroSlide || false,
    heroSlideTagline: product?.heroSlideTagline || '',
    featuredOrder: product?.featuredOrder || 0,
    heroSlideOrder: product?.heroSlideOrder || 0,
    tags: product?.tags?.join(', ') || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load dynamic categories
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    fetch('/api/settings/categories', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => {})
  }, [])

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
      gender: form.gender,
      sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(',').map((s) => s.trim()).filter(Boolean),
      material: form.material,
      sku: form.sku,
      images: form.images,
      inStock: form.inStock,
      isFeatured: form.isFeatured,
      isHeroSlide: form.isHeroSlide,
      heroSlideTagline: form.heroSlideTagline,
      featuredOrder: Number(form.featuredOrder),
      heroSlideOrder: Number(form.heroSlideOrder),
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
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-300 rounded-lg p-3 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div className="sm:col-span-2">
          <label className="block text-xs text-gray-400 mb-1">Product Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60" />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Slug (auto-generated if empty)</label>
          <input name="slug" value={form.slug} onChange={handleChange}
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60" />
        </div>

        {/* SKU */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">SKU</label>
          <input name="sku" value={form.sku} onChange={handleChange} placeholder="GK-001"
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60" />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Category *</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            list="category-options"
            placeholder="e.g. Kurta, T-Shirt, Jeans"
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60"
          />
          <datalist id="category-options">
            {categories.map((c) => <option key={c} value={c} />)}
          </datalist>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange}
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60">
            {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Price (PKR) *</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} required min="0"
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60" />
        </div>

        {/* Compare Price */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Compare Price (PKR)</label>
          <input name="comparePrice" type="number" value={form.comparePrice} onChange={handleChange} min="0"
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60" />
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Sizes (comma separated)</label>
          <input name="sizes" value={form.sizes} onChange={handleChange} placeholder="XS, S, M, L, XL, XXL"
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60" />
        </div>

        {/* Colors */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Colors (comma separated)</label>
          <input name="colors" value={form.colors} onChange={handleChange} placeholder="Black, White, Navy"
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60" />
        </div>

        {/* Material */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Material / Fabric</label>
          <input name="material" value={form.material} onChange={handleChange} placeholder="100% Cotton"
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60" />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Tags (comma separated)</label>
          <input name="tags" value={form.tags} onChange={handleChange} placeholder="summer, casual, eid"
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60" />
        </div>

        {/* Short Description */}
        <div className="sm:col-span-2">
          <label className="block text-xs text-gray-400 mb-1">Short Description</label>
          <input name="shortDescription" value={form.shortDescription} onChange={handleChange}
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60" />
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="block text-xs text-gray-400 mb-1">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={3}
            className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60 resize-none" />
        </div>

        {/* Images */}
        <div className="sm:col-span-2">
          <label className="block text-xs text-gray-400 mb-1">Product Images</label>
          <ImageUploader
            images={form.images}
            onChange={(urls) => setForm((p) => ({ ...p, images: urls }))}
          />
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
            <input type="checkbox" name={toggle.name} checked={form[toggle.name]} onChange={handleChange}
              className="w-4 h-4 accent-[#c9a84c]" />
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
            placeholder="Wear Your Identity"
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
