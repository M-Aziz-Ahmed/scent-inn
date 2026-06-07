'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Products', icon: '🌹' },
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

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    localStorage.removeItem('admin_token')
    router.push('/admin')
    router.refresh()
  }

  return (
    <aside className="w-56 bg-[#111111] border-r border-[#c9a84c]/20 flex flex-col min-h-screen">
      <div className="p-5 border-b border-[#c9a84c]/20">
        <Link href="/" className="text-lg font-bold gold-text tracking-wider">
          SCENT INN
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
            {item.label}
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
