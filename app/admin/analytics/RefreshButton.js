'use client'

import { useRouter } from 'next/navigation'

export default function RefreshButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.refresh()}
      className="btn-outline-gold px-3 py-1.5 rounded-lg text-sm"
      title="Refresh metrics"
    >
      Refresh
    </button>
  )
}
