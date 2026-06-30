import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, min: 0 },
    images: [{ type: String }],

    // Clothing-specific fields
    category: { type: String, required: true, trim: true }, // dynamic — no enum
    sizes: [{ type: String, trim: true }],   // e.g. ['XS','S','M','L','XL','XXL']
    colors: [{ type: String, trim: true }],  // e.g. ['Black','White','Navy']
    material: { type: String, trim: true },  // e.g. 'Cotton', 'Linen'
    gender: {
      type: String,
      enum: ['men', 'women', 'kids', 'unisex'],
      default: 'unisex',
    },
    sku: { type: String, trim: true },

    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 0 },

    isFeatured: { type: Boolean, default: false },
    featuredOrder: { type: Number, default: 0 },
    isHeroSlide: { type: Boolean, default: false },
    heroSlideOrder: { type: Number, default: 0 },
    heroSlideTagline: { type: String },

    salesCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    tags: [String],
    isActive: { type: Boolean, default: true },
    viewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

// Auto-generate slug from name if not provided
ProductSchema.pre('validate', function () {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
})

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)
