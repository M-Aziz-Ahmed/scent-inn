"use client"
import { useEffect } from 'react'

export default function ProductViewTracker({ productId, slug }) {
  useEffect(() => {
    const payload = { productId, slug, referrer: document.referrer }
    try {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {})
    } catch {}
  }, [productId, slug])

  return null
}
