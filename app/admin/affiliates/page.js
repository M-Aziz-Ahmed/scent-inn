import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AffiliatesClient from './AffiliatesClient'

export const metadata = { title: 'Affiliates — Scent Inn Admin' }

export default async function AffiliatesPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin')
  return <AffiliatesClient />
}
