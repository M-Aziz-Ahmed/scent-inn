'use client'
import { useEffect, useState } from 'react'

export default function SettingsClient() {
  // Social links
  const [links, setLinks] = useState({ facebook: '', instagram: '', tiktok: '' })
  const [savingLinks, setSavingLinks] = useState(false)
  const [linksMsg, setLinksMsg] = useState('')
  const [linksErr, setLinksErr] = useState('')

  // Categories
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [savingCats, setSavingCats] = useState(false)
  const [catsMsg, setCatsMsg] = useState('')
  const [catsErr, setCatsErr] = useState('')

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    Promise.all([
      fetch('/api/settings').then((r) => r.json()),
      fetch('/api/settings/categories', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
    ])
      .then(([social, cats]) => {
        setLinks({
          facebook: social.links?.facebook || '',
          instagram: social.links?.instagram || '',
          tiktok: social.links?.tiktok || '',
        })
        setCategories(cats.categories || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // ── Social links ──────────────────────────────────────────────
  const saveLinks = async () => {
    setSavingLinks(true)
    setLinksErr('')
    setLinksMsg('')
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(links),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      setLinks({ facebook: data.links?.facebook || '', instagram: data.links?.instagram || '', tiktok: data.links?.tiktok || '' })
      setLinksMsg('Social links saved.')
    } catch (err) {
      setLinksErr(err.message)
    } finally {
      setSavingLinks(false)
    }
  }

  // ── Categories ────────────────────────────────────────────────
  const addCategory = () => {
    const val = newCategory.trim()
    if (!val) return
    if (categories.some((c) => c.toLowerCase() === val.toLowerCase())) {
      setCatsErr('Category already exists.')
      return
    }
    setCategories((prev) => [...prev, val])
    setNewCategory('')
    setCatsErr('')
  }

  const removeCategory = (cat) => {
    setCategories((prev) => prev.filter((c) => c !== cat))
  }

  const saveCategories = async () => {
    setSavingCats(true)
    setCatsErr('')
    setCatsMsg('')
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/settings/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ categories }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      setCategories(data.categories)
      setCatsMsg('Categories saved.')
    } catch (err) {
      setCatsErr(err.message)
    } finally {
      setSavingCats(false)
    }
  }

  if (loading) return <div className="p-8 text-gray-400">Loading settings…</div>

  return (
    <div className="space-y-10 max-w-3xl">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      {/* ── Categories ── */}
      <section className="card-dark rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[#c9a84c]">Product Categories</h2>
            <p className="text-gray-500 text-sm mt-0.5">These appear as filter options in the shop and in the product form.</p>
          </div>
          <button
            onClick={saveCategories}
            disabled={savingCats}
            className="btn-gold px-4 py-2 rounded-lg text-sm disabled:opacity-60"
          >
            {savingCats ? 'Saving…' : 'Save Categories'}
          </button>
        </div>

        {catsErr && <div className="bg-red-900/30 border border-red-500/40 text-red-300 rounded-lg p-3 text-sm mb-3">{catsErr}</div>}
        {catsMsg && <div className="bg-green-900/30 border border-green-500/40 text-green-300 rounded-lg p-3 text-sm mb-3">{catsMsg}</div>}

        {/* Add new */}
        <div className="flex gap-2 mb-4">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
            placeholder="e.g. Kurta, T-Shirt, Jeans…"
            className="flex-1 bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60"
          />
          <button
            type="button"
            onClick={addCategory}
            className="btn-outline-gold px-4 py-2 rounded-lg text-sm"
          >
            Add
          </button>
        </div>

        {/* List */}
        {categories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span
                key={cat}
                className="flex items-center gap-1.5 bg-[#1a3c2e] border border-[#c9a84c]/20 text-gray-200 text-sm px-3 py-1.5 rounded-full"
              >
                {cat}
                <button
                  onClick={() => removeCategory(cat)}
                  className="text-gray-500 hover:text-red-400 transition text-base leading-none"
                  aria-label={`Remove ${cat}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">No categories yet. Add some above.</p>
        )}
      </section>

      {/* ── Social Links ── */}
      <section className="card-dark rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[#c9a84c]">Social Media Links</h2>
            <p className="text-gray-500 text-sm mt-0.5">Appear in the footer and contact page.</p>
          </div>
          <button
            onClick={saveLinks}
            disabled={savingLinks}
            className="btn-gold px-4 py-2 rounded-lg text-sm disabled:opacity-60"
          >
            {savingLinks ? 'Saving…' : 'Save Links'}
          </button>
        </div>

        {linksErr && <div className="bg-red-900/30 border border-red-500/40 text-red-300 rounded-lg p-3 text-sm mb-3">{linksErr}</div>}
        {linksMsg && <div className="bg-green-900/30 border border-green-500/40 text-green-300 rounded-lg p-3 text-sm mb-3">{linksMsg}</div>}

        <div className="space-y-4">
          {[
            { key: 'facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/gullkar' },
            { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/gullkar' },
            { key: 'tiktok', label: 'TikTok URL', placeholder: 'https://tiktok.com/@gullkar' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-sm text-gray-400 mb-1">{label}</label>
              <input
                type="url"
                placeholder={placeholder}
                value={links[key]}
                onChange={(e) => setLinks((p) => ({ ...p, [key]: e.target.value }))}
                className="w-full bg-[#1a1a1a] border border-[#c9a84c]/20 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/60"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
