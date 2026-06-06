import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ShippingRatesClient from './ShippingRatesClient'

export default async function AdminShippingPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin')
  return <ShippingRatesClient />
}
