import mongoose from 'mongoose'

const ProductViewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    slug: { type: String, required: true },
    referrer: { type: String },
    userAgent: { type: String },
    ip: { type: String },
    country: { type: String },
  },
  { timestamps: true }
)

export default mongoose.models.ProductView || mongoose.model('ProductView', ProductViewSchema)
