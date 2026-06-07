import { connectDB } from '@/lib/db'
import Contact from '@/models/Contact'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET(request) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const messages = await Contact.find().sort({ createdAt: -1 }).lean()
  return Response.json({ messages })
}
