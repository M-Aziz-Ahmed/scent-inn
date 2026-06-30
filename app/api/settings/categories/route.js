import { connectDB } from '@/lib/db'
import Settings from '@/models/Settings'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET() {
  await connectDB()
  const setting = await Settings.findOne({ key: 'categories' }).lean()
  return Response.json({ categories: setting?.value || [] })
}

export async function PUT(request) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const { categories } = await request.json()

  if (!Array.isArray(categories)) {
    return Response.json({ error: 'categories must be an array' }, { status: 400 })
  }

  const cleaned = categories
    .map((c) => String(c).trim())
    .filter(Boolean)
    // deduplicate case-insensitively, keep original casing of first occurrence
    .filter((c, i, arr) => arr.findIndex((x) => x.toLowerCase() === c.toLowerCase()) === i)

  await Settings.findOneAndUpdate(
    { key: 'categories' },
    { value: cleaned },
    { upsert: true, new: true }
  )

  return Response.json({ categories: cleaned })
}
