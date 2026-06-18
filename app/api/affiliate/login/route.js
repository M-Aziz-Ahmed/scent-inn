import { connectDB } from '@/lib/db'
import Admin from '@/models/Admin'
import Affiliate from '@/models/Affiliate'
import { signToken } from '@/lib/auth'

export async function POST(request) {
  await connectDB()
  const { email, password } = await request.json()

  if (!email || !password) {
    return Response.json({ error: 'Email and password required' }, { status: 400 })
  }

  const admin = await Admin.findOne({ email: email.toLowerCase(), role: 'affiliate', isActive: true })
  if (!admin) return Response.json({ error: 'Invalid credentials' }, { status: 401 })

  const valid = await admin.comparePassword(password)
  if (!valid) return Response.json({ error: 'Invalid credentials' }, { status: 401 })

  const affiliate = await Affiliate.findOne({ admin: admin._id, isActive: true }).lean()
  if (!affiliate) return Response.json({ error: 'Affiliate profile not found' }, { status: 403 })

  const token = signToken({ id: admin._id, role: 'affiliate', affiliateCode: affiliate.code, name: admin.name })
  return Response.json({ token, affiliateCode: affiliate.code, name: admin.name })
}
