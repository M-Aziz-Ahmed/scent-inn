import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import SettingsClient from './SettingsClient'

export default async function AdminSettingsPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin')
  return <SettingsClient />
}
