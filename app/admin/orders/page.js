import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import OrdersClient from './OrdersClient'

export default async function AdminOrdersPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin')
  return <OrdersClient />
}
