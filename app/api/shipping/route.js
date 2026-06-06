import { connectDB } from '@/lib/db'
import Settings from '@/models/Settings'
import { getAdminFromRequest } from '@/lib/auth'
import { DEFAULT_SHIPPING_RATES } from '@/lib/shipping'

export async function GET() {
  await connectDB()
  const settings = await Settings.findOne({ key: 'shippingRates' }).lean()
  return Response.json({ rates: settings?.value || DEFAULT_SHIPPING_RATES })
}

export async function PUT(request) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const body = await request.json()
  const rates = body.rates || {}

  if (typeof rates !== 'object' || Array.isArray(rates)) {
    return Response.json({ error: 'Invalid shipping rates format' }, { status: 400 })
  }

  await Settings.findOneAndUpdate(
    { key: 'shippingRates' },
    { value: rates },
    { upsert: true, new: true }
  )

  return Response.json({ rates })
}
