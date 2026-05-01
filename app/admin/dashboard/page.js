import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminDashboardClient from './AdminDashboardClient'

export default async function DashboardPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin')

  return <AdminDashboardClient />
}
