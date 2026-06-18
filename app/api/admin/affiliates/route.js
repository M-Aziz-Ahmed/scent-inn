import { connectDB } from '@/lib/db'
import Admin from '@/models/Admin'
import Affiliate from '@/models/Affiliate'
import Order from '@/models/Order'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET(request) {
  const session = await getAdminFromRequest(request)
  if (!session || !['admin', 'superadmin'].includes(session.role)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  const affiliates = await Affiliate.find()
    .populate('admin', 'name email isActive')
    .sort({ totalRevenue: -1 })
    .lean()

  // Attach top referred orders per affiliate
  const enriched = await Promise.all(
    affiliates.map(async (aff) => {
      const recentOrders = await Order.find({ affiliateCode: aff.code })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('orderNumber customer total status createdAt')
        .lean()
      return { ...aff, recentOrders }
    })
  )

  return Response.json({ affiliates: enriched })
}

export async function POST(request) {
  const session = await getAdminFromRequest(request)
  if (!session || !['admin', 'superadmin'].includes(session.role)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const { name, email, password, code } = await request.json()

  if (!name || !email || !password || !code) {
    return Response.json({ error: 'name, email, password and code are required' }, { status: 400 })
  }

  const upperCode = code.toUpperCase().replace(/[^A-Z0-9]/g, '')
  if (upperCode.length < 3) {
    return Response.json({ error: 'Code must be at least 3 alphanumeric characters' }, { status: 400 })
  }

  // Check uniqueness
  const [existingEmail, existingCode] = await Promise.all([
    Admin.findOne({ email: email.toLowerCase() }),
    Affiliate.findOne({ code: upperCode }),
  ])
  if (existingEmail) return Response.json({ error: 'Email already in use' }, { status: 400 })
  if (existingCode) return Response.json({ error: 'Affiliate code already taken' }, { status: 400 })

  const adminUser = await Admin.create({ name, email: email.toLowerCase(), password, role: 'affiliate' })
  const affiliate = await Affiliate.create({ admin: adminUser._id, code: upperCode })

  return Response.json(
    {
      affiliate: {
        ...affiliate.toObject(),
        admin: { name: adminUser.name, email: adminUser.email, isActive: adminUser.isActive },
      },
    },
    { status: 201 }
  )
}

export async function PUT(request) {
  const session = await getAdminFromRequest(request)
  if (!session || !['admin', 'superadmin'].includes(session.role)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const { affiliateId, isActive } = await request.json()
  if (!affiliateId) return Response.json({ error: 'affiliateId required' }, { status: 400 })

  const aff = await Affiliate.findByIdAndUpdate(affiliateId, { isActive }, { new: true })
    .populate('admin', 'name email isActive')
    .lean()

  // Sync the admin account active state too
  if (aff) await Admin.findByIdAndUpdate(aff.admin._id, { isActive })

  return Response.json({ affiliate: aff })
}
