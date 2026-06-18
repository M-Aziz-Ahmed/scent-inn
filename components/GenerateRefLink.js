'use client'
import { useState, useEffect } from 'react'

/**
 * Shows a "Generate Referral Link" button on product pages.
 * Only renders for logged-in affiliates or admins.
 * productSlug — the product's slug for the /shop/:slug URL.
 */
export default function GenerateRefLink({ productSlug }) {
  const [session, setSession] = useState(null) // { affiliateCode, role }
  const [link, setLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Try affiliate session first
    try {
      const aff = localStorage.getItem('affiliate_session')
      if (aff) {
        const parsed = JSON.parse(aff)
        if (parsed?.affiliateCode) {
          setSession({ affiliateCode: parsed.affiliateCode, role: 'affiliate', name: parsed.name })
          return
        }
      }
    } catch {}
    // Fall back to admin token (admins can also generate links for preview)
    const adminToken = localStorage.getItem('admin_token')
    if (adminToken) {
      try {
        // Decode payload without verification (client-side only, display purpose)
        const payload = JSON.parse(atob(adminToken.split('.')[1]))
        if (['admin', 'superadmin', 'affiliate'].includes(payload?.role)) {
          setSession({ affiliateCode: payload.affiliateCode || null, role: payload.role, name: payload.name })
        }
      } catch {}
    }
  }, [])

  function generate() {
    if (!session) return
    const base = window.location.origin
    const code = session.affiliateCode
    if (!code) {
      setLink(`${base}/shop/${productSlug}`)
    } else {
      setLink(`${base}/shop/${productSlug}?ref=${code}`)
    }
    setOpen(true)
  }

  function copy() {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (!session) return null

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={generate}
        className="flex items-center gap-2 text-xs text-[#c9a84c] border border-[#c9a84c]/30 hover:border-[#c9a84c]/70 hover:bg-[#c9a84c]/5 px-3 py-1.5 rounded-lg transition"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        Generate Referral Link
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div
            className="bg-[#111111] border border-[#c9a84c]/30 rounded-2xl p-6 w-full max-w-lg space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[#c9a84c]">Your Referral Link</h3>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white text-lg">✕</button>
            </div>

            {session.affiliateCode ? (
              <p className="text-xs text-gray-400">
                Logged in as <span className="text-white">{session.name}</span> ·
                Code: <span className="text-[#c9a84c] font-mono">{session.affiliateCode}</span>
              </p>
            ) : (
              <p className="text-xs text-yellow-400">
                You&apos;re an admin — this link has no affiliate code attached. Create an affiliate account to track referrals.
              </p>
            )}

            <div className="flex items-center gap-2">
              <code className="flex-1 bg-[#1a1a1a] text-[#c9a84c] rounded-lg px-3 py-2.5 text-xs break-all">
                {link}
              </code>
              <button
                onClick={copy}
                className="shrink-0 btn-gold px-4 py-2.5 rounded-lg text-sm font-medium"
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Anyone who places an order after visiting via this link will be attributed to your account.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
