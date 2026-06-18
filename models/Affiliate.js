import mongoose from 'mongoose'

const AffiliateSchema = new mongoose.Schema(
  {
    // Links to an Admin account with role='affiliate'
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true, unique: true },
    // Short unique code used in ?ref= query param
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    // Lifetime stats (denormalized for fast reads)
    totalClicks: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.models.Affiliate || mongoose.model('Affiliate', AffiliateSchema)
