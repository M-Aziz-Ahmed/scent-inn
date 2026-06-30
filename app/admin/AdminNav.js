 'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Products', icon: '👗' },
  { href: '/admin/users', label: 'Users', icon: '👤' },
  { href: '/admin/affiliates', label: 'Affiliates', icon: '🤝' },
  { href: '/admin/orders', label: 'Orders', icon: '📦' },
  { href: '/admin/messages', label: 'Messages', icon: '✉️' },
  { href: '/admin/shipping', label: 'Shipping Rates', icon: '🚚' },
  { href: '/admin/featured', label: 'Featured', icon: '⭐' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [unread, setUnread] = useState(0)
  const [newOrders, setNewOrders] = useState(0)

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    localStorage.removeItem('admin_token')
    router.push('/admin')
    router.refresh()
  }

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) return
    let mounted = true
    fetch('/api/admin/messages', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return
        const msgs = data.messages || []
        const count = msgs.filter((m) => m.status === 'new').length
        setUnread(count)
      })
      .catch(() => {})
    // fetch pending orders
    fetch('/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return
        setNewOrders(data.pendingCount || 0)
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  return (
    <aside className="w-56 bg-[#111111] border-r border-[#c9a84c]/20 flex flex-col min-h-screen">
      <div className="p-5 border-b border-[#c9a84c]/20">
        <Link href="/" className="text-lg font-bold gold-text tracking-wider">
          GULLKAR
        </Link>
        <p className="text-xs text-gray-500 mt-1">Admin Portal</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
              pathname.startsWith(item.href)
                ? 'bg-[#c9a84c]/15 text-[#c9a84c] font-medium'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{item.icon}</span>
            <span className="truncate">{item.label}</span>
            {item.href === '/admin/messages' && unread > 0 && (
              <span className="ml-auto inline-flex items-center justify-center bg-red-500 text-xs text-white px-2 py-0.5 rounded-full">
                {unread}
              </span>
            )}
            {item.href === '/admin/orders' && newOrders > 0 && (
              <span className="ml-auto inline-flex items-center justify-center bg-red-500 text-xs text-white px-2 py-0.5 rounded-full">
                {newOrders}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-[#c9a84c]/20">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition mb-1"
        >
          <span>🌐</span> View Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-900/10 transition"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  )
}
