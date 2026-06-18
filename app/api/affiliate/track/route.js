import { connectDB } from '@/lib/db'
import Affiliate from '@/models/Affiliate'

// Called client-side when someone lands with ?ref=CODE
export async function POST(request) {
  await connectDB()
  const { code } = await request.json()
  if (!code) return Response.json({ ok: false })

  const affiliate = await Affiliate.findOneAndUpdate(
    { code: code.toUpperCase(), isActive: true },
    { $inc: { totalClicks: 1 } },
    { new: true }
  )

  return Response.json({ ok: !!affiliate })
}
