import { connectDB } from '@/lib/db'
import Settings from '@/models/Settings'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET() {
  await connectDB()
  const settings = await Settings.findOne({ key: 'socialLinks' }).lean()
  return Response.json({ links: settings?.value || {} })
}

export async function PUT(request) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const body = await request.json()
  const links = {
    facebook: typeof body.facebook === 'string' ? body.facebook.trim() : '',
    instagram: typeof body.instagram === 'string' ? body.instagram.trim() : '',
    tiktok: typeof body.tiktok === 'string' ? body.tiktok.trim() : '',
  }

  await Settings.findOneAndUpdate(
    { key: 'socialLinks' },
    { value: links },
    { upsert: true, new: true }
  )

  return Response.json({ links })
}
