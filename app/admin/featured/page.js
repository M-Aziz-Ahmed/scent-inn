import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import FeaturedClient from './FeaturedClient'

export default async function AdminFeaturedPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin')
  return <FeaturedClient />
}
