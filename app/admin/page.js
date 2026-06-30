import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminLoginForm from './AdminLoginForm'

export default async function AdminPage() {
  const session = await getAdminSession()
  if (session) redirect('/admin/dashboard')

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gold-text tracking-wider">GULLKAR</h1>
          <p className="text-gray-400 mt-2">Admin Portal</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  )
}
