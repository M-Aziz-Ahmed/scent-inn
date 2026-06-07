'use client'
import { useEffect, useState } from 'react'

export default function SettingsClient() {
  const [links, setLinks] = useState({ facebook: '', instagram: '', tiktok: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await fetch('/api/settings')
        const data = await res.json()
        setLinks({
          facebook: data.links?.facebook || '',
          instagram: data.links?.instagram || '',
          tiktok: data.links?.tiktok || '',
        })
      } catch (err) {
        setError('Unable to load social links. Try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchLinks()
  }, [])

  const handleChange = (field, value) => {
    setLinks((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setMessage('')

    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(links),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save settings')
      setLinks({
        facebook: data.links?.facebook || '',
        instagram: data.links?.instagram || '',
        tiktok: data.links?.tiktok || '',
      })
      setMessage('Social media links saved successfully.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Social Media Settings</h1>
              <p className="text-gray-400">Add your Facebook, Instagram, and TikTok profiles so links appear on the site.</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="btn-gold px-5 py-2 rounded-lg text-sm disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Links'}
            </button>
          </div>

          <div className="card-dark rounded-2xl p-6 space-y-5">
            {error && (
              <div className="bg-red-900/30 border border-red-500/50 text-red-300 rounded-lg p-3 text-sm">{error}</div>
            )}
            {message && (
              <div className="bg-green-900/30 border border-green-500/50 text-green-300 rounded-lg p-3 text-sm">{message}</div>
            )}

            <div>
              <label className="block text-sm text-gray-400 mb-2">Facebook URL</label>
              <input
                type="url"
                placeholder="https://www.facebook.com/yourpage"
                value={links.facebook}
                onChange={(e) => handleChange('facebook', e.target.value)}
                className="w-full bg-[#111111] border border-[#c9a84c]/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c9a84c]/60"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Instagram URL</label>
              <input
                type="url"
                placeholder="https://www.instagram.com/yourprofile"
                value={links.instagram}
                onChange={(e) => handleChange('instagram', e.target.value)}
                className="w-full bg-[#111111] border border-[#c9a84c]/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c9a84c]/60"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">TikTok URL</label>
              <input
                type="url"
                placeholder="https://www.tiktok.com/@yourprofile"
                value={links.tiktok}
                onChange={(e) => handleChange('tiktok', e.target.value)}
                className="w-full bg-[#111111] border border-[#c9a84c]/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c9a84c]/60"
              />
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-400">
            <p>These URLs will automatically appear in the website footer and contact page.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
