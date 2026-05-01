import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ProductsClient from './ProductsClient'

export default async function AdminProductsPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin')
  return <ProductsClient />
}
