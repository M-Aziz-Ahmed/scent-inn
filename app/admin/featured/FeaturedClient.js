'use client'
import { useState, useEffect, useCallback } from 'react'
import AdminNav from '../AdminNav'

export default function FeaturedClient() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [autoRunning, setAutoRunning] = useState(false)
  const [autoResult, setAutoResult] = useState(null)
  const [featuredCount, setFeaturedCount] = useState(8)
  const [heroCount, setHeroCount] = useState(4)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/products?limit=50')
    const data = await res.json()
    setProducts(data.products || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const runAutoFeature = async () => {
    setAutoRunning(true)
    setAutoResult(null)
    const token = localStorage.getItem('admin_token')
    const res = await fetch('/api/admin/auto-feature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ featuredCount, heroSlideCount: heroCount }),
    })
    const data = await res.json()
    setAutoResult(data)
    setAutoRunning(false)
    fetchProducts()
  }

  const toggleFeatured = async (product) => {
    const token = localStorage.getItem('admin_token')
    await fetch(`/api/products/${product._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isFeatured: !product.isFeatured }),
    })
    fetchProducts()
  }

  const toggleHero = async (product) => {
    const token = localStorage.getItem('admin_token')
    await fetch(`/api/products/${product._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isHeroSlide: !product.isHeroSlide }),
    })
    fetchProducts()
  }

  const featuredProducts = products.filter((p) => p.isFeatured)
  const heroProducts = products.filter((p) => p.isHeroSlide)

  return (
    <div className="flex min-h-screen">
      {/* <AdminNav /> */}
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-2">Featured & Hero Slides</h1>
          <p className="text-gray-400 text-sm mb-6">
            Manage which products appear in the hero slider and featured sections.
          </p>

          {/* Auto Feature */}
          <div className="card-dark rounded-xl p-6 mb-8">
            <h2 className="font-semibold text-[#c9a84c] mb-2">🤖 Auto-Feature (Smart)</h2>
            <p className="text-gray-400 text-sm mb-4">
              Automatically promotes your top-selling products to featured and hero slide positions.
            </p>

            <div className="flex flex-wrap gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Featured Products Count</label>
                <input
                  type="number"
                  value={featuredCount}
                  onChange={(e) => setFeaturedCount(Number(e.target.value))}
                  min="1"
                  max="20"
                  className="w-24 bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Hero Slide Count</label>
                <input
                  type="number"
                  value={heroCount}
                  onChange={(e) => setHeroCount(Number(e.target.value))}
                  min="1"
                  max="8"
                  className="w-24 bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm"
                />
              </div>
            </div>

            <button
              onClick={runAutoFeature}
              disabled={autoRunning}
              className="btn-gold px-6 py-2.5 rounded-lg font-semibold disabled:opacity-60"
            >
              {autoRunning ? 'Running...' : '⚡ Run Auto-Feature Now'}
            </button>

            {autoResult && (
              <div className="mt-4 bg-green-900/20 border border-green-500/30 rounded-lg p-3 text-sm text-green-300">
                ✅ {autoResult.message}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Current Featured */}
            <div className="card-dark rounded-xl p-5">
              <h2 className="font-semibold text-[#c9a84c] mb-3">
                ⭐ Featured ({featuredProducts.length})
              </h2>
              {featuredProducts.length === 0 ? (
                <p className="text-gray-500 text-sm">No featured products</p>
              ) : (
                <div className="space-y-2">
                  {featuredProducts.map((p) => (
                    <div key={p._id} className="flex items-center justify-between">
                      <span className="text-white text-sm">{p.name}</span>
                      <button
                        onClick={() => toggleFeatured(p)}
                        className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Current Hero */}
            <div className="card-dark rounded-xl p-5">
              <h2 className="font-semibold text-[#c9a84c] mb-3">
                🎠 Hero Slides ({heroProducts.length})
              </h2>
              {heroProducts.length === 0 ? (
                <p className="text-gray-500 text-sm">No hero slide products</p>
              ) : (
                <div className="space-y-2">
                  {heroProducts.map((p) => (
                    <div key={p._id} className="flex items-center justify-between">
                      <span className="text-white text-sm">{p.name}</span>
                      <button
                        onClick={() => toggleHero(p)}
                        className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* All Products Toggle */}
          <div className="card-dark rounded-xl p-5">
            <h2 className="font-semibold text-[#c9a84c] mb-4">All Products — Manual Control</h2>
            {loading ? (
              <p className="text-gray-400 text-sm">Loading...</p>
            ) : (
              <div className="space-y-2">
                {products.map((p) => (
                  <div key={p._id} className="flex items-center justify-between py-2 border-b border-[#c9a84c]/10 last:border-0">
                    <div>
                      <span className="text-white text-sm">{p.name}</span>
                      <span className="text-gray-500 text-xs ml-2">{p.salesCount} sold</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleFeatured(p)}
                        className={`text-xs px-3 py-1 rounded-full transition ${
                          p.isFeatured
                            ? 'bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40'
                            : 'border border-gray-600 text-gray-400 hover:border-[#c9a84c]/40'
                        }`}
                      >
                        {p.isFeatured ? '⭐ Featured' : 'Feature'}
                      </button>
                      <button
                        onClick={() => toggleHero(p)}
                        className={`text-xs px-3 py-1 rounded-full transition ${
                          p.isHeroSlide
                            ? 'bg-purple-900/40 text-purple-400 border border-purple-500/40'
                            : 'border border-gray-600 text-gray-400 hover:border-purple-500/40'
                        }`}
                      >
                        {p.isHeroSlide ? '🎠 Hero' : 'Hero'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
