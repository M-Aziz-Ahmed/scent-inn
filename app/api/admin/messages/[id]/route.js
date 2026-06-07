import { connectDB } from '@/lib/db'
import Contact from '@/models/Contact'
import { getAdminFromRequest } from '@/lib/auth'

export async function PATCH(request, { params }) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const { id } = params
  const body = await request.json()
  const { status } = body

  if (!['new', 'read'].includes(status)) {
    return Response.json({ error: 'Invalid status' }, { status: 400 })
  }

  const message = await Contact.findByIdAndUpdate(id, { status }, { new: true }).lean()
  if (!message) return Response.json({ error: 'Message not found' }, { status: 404 })

  return Response.json({ message })
}
