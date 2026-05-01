import { connectDB } from '@/lib/db'
import Product from '@/models/Product'
import { getAdminFromRequest } from '@/lib/auth'

// Auto-feature: promotes top-selling products to featured automatically
export async function POST(request) {
  const admin = await getAdminFromRequest(request)
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const { featuredCount = 8, heroSlideCount = 4 } = await request.json().catch(() => ({}))

  // Clear all current featured/hero flags
  await Product.updateMany({}, { isFeatured: false, isHeroSlide: false, featuredOrder: 0, heroSlideOrder: 0 })

  // Top sellers become featured
  const topSellers = await Product.find({ isActive: true, inStock: true })
    .sort({ salesCount: -1 })
    .limit(featuredCount)
    .select('_id name salesCount')

  for (let i = 0; i < topSellers.length; i++) {
    await Product.findByIdAndUpdate(topSellers[i]._id, {
      isFeatured: true,
      featuredOrder: i + 1,
      isHeroSlide: i < heroSlideCount,
      heroSlideOrder: i < heroSlideCount ? i + 1 : 0,
    })
  }

  return Response.json({
    message: `Auto-featured ${topSellers.length} products, ${Math.min(topSellers.length, heroSlideCount)} in hero slide`,
    featured: topSellers.map((p) => p.name),
  })
}
