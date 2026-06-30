import mongoose from 'mongoose'

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String },
})

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true, default: 'Pakistan' },
    },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'bank_transfer', 'easypaisa', 'jazzcash'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    notes: { type: String },
    trackingNumber: { type: String },
    source: { type: String, default: 'website' }, // website, ad, etc.
    utmSource: { type: String },
    utmMedium: { type: String },
    utmCampaign: { type: String },
    affiliateCode: { type: String, default: null }, // referral tracking
  },
  { timestamps: true }
)

// Auto-generate order number
OrderSchema.pre('save', async function () {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments()
    this.orderNumber = `GK-${String(count + 1).padStart(5, '0')}`
  }
  // Update product sales count
  if (this.isNew) {
    for (const item of this.items) {
      await mongoose.model('Product').findByIdAndUpdate(item.product, {
        $inc: { salesCount: item.quantity },
      })
    }
    // Update affiliate stats if order came via referral
    if (this.affiliateCode) {
      await mongoose.model('Affiliate').findOneAndUpdate(
        { code: this.affiliateCode.toUpperCase() },
        { $inc: { totalOrders: 1, totalRevenue: this.total } }
      )
    }
  }
})

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)
