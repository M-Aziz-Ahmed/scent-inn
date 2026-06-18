'use client'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

/**
 * Invisible component — reads ?ref=CODE from URL, persists it to
 * localStorage (30-day attribution window), and pings the click counter.
 * Drop this into the root layout or any page that might receive ?ref= traffic.
 */
export default function AffiliateTracker() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (!ref) return

    const code = ref.toUpperCase()

    // Store with a 30-day expiry
    const entry = { code, expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 }
    localStorage.setItem('affiliate_ref', JSON.stringify(entry))

    // Fire click ping (non-blocking)
    fetch('/api/affiliate/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    }).catch(() => {})
  }, [searchParams])

  return null
}

/** Helper — call this in OrderForm to read the stored affiliate code */
export function getStoredAffiliateCode() {
  try {
    const raw = localStorage.getItem('affiliate_ref')
    if (!raw) return null
    const entry = JSON.parse(raw)
    if (Date.now() > entry.expiresAt) {
      localStorage.removeItem('affiliate_ref')
      return null
    }
    return entry.code
  } catch {
    return null
  }
}
