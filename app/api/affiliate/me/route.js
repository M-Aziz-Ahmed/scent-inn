import { connectDB } from '@/lib/db'
import Affiliate from '@/models/Affiliate'
import Order from '@/models/Order'
import { getAdminFromRequest } from '@/lib/auth'

export async function GET(request) {
  const session = await getAdminFromRequest(request)
  if (!session || !['affiliate', 'admin', 'superadmin'].includes(session.role)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  // Admins can pass ?code=XXX to inspect any affiliate
  const { searchParams } = request.nextUrl
  const codeParam = searchParams.get('code')

  let affiliate
  if (['admin', 'superadmin'].includes(session.role) && codeParam) {
    affiliate = await Affiliate.findOne({ code: codeParam.toUpperCase() })
      .populate('admin', 'name email')
      .lean()
  } else {
    affiliate = await Affiliate.findOne({ code: session.affiliateCode })
      .populate('admin', 'name email')
      .lean()
  }

  if (!affiliate) return Response.json({ error: 'Affiliate not found' }, { status: 404 })

  // Get recent referred orders
  const recentOrders = await Order.find({ affiliateCode: affiliate.code })
    .sort({ createdAt: -1 })
    .limit(20)
    .select('orderNumber customer total status createdAt items')
    .lean()

  return Response.json({ affiliate, recentOrders })
}
