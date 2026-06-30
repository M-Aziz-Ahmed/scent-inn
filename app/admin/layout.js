export const metadata = {
  title: 'Admin — Gullkar',
  description: 'Gullkar Admin Portal',
}

import AdminNav from './AdminNav'

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="flex">
        <AdminNav />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
