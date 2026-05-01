# 🌹 Scent Inn — Luxury Perfume E-Commerce

A complete, production-ready e-commerce website for a perfume brand built with **Next.js 16**, **React 19**, **MongoDB**, and **Tailwind CSS v4**. Optimized for running ads and converting visitors into customers.

## ✨ Features

### 🛍️ Customer-Facing Features
- **Hero Slider** — Showcase featured products with beautiful animations
- **Product Catalog** — Browse by category, search, filter, and sort
- **Product Details** — Full product pages with images, notes, and descriptions
- **Order Page** — Optimized for ad traffic with simple checkout flow
- **Cash on Delivery** — No payment gateway needed to start
- **Order Success Page** — Clear confirmation after order placement
- **Responsive Design** — Works perfectly on mobile, tablet, and desktop
- **Dark Theme** — Elegant black and gold luxury aesthetic

### 🎛️ Admin Portal Features
- **Dashboard** — View stats, revenue, orders, and top products
- **Product Management** — Add, edit, delete products with full control
- **Order Management** — View and update order status
- **Featured Products** — Manually or automatically feature products
- **Auto-Feature System** — Automatically promotes best-selling products
- **Hero Slide Management** — Control which products appear in the hero slider
- **Secure Authentication** — JWT-based admin login system

### 🚀 Technical Features
- **Next.js 16 App Router** — Latest Next.js with server components
- **MongoDB + Mongoose** — Scalable database with proper schemas
- **API Routes** — RESTful API for all operations
- **Server-Side Rendering** — Fast page loads and SEO-friendly
- **Optimized for Vercel** — Deploy with one click
- **UTM Tracking** — Track ad campaign performance
- **Free Hosting Ready** — Works on Vercel free tier

---

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd scent-inn
npm install
```

### 2. Set Up MongoDB

1. Create a free MongoDB cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Get your connection string
3. Create `.env.local` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/scent-inn?retryWrites=true&w=majority
JWT_SECRET=your-long-random-secret-string-here
SETUP_DISABLED=false
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Create Admin Account

1. Visit `http://localhost:3000/admin/setup`
2. Create your admin account
3. After creating, set `SETUP_DISABLED=true` in `.env.local`

### 5. Add Products

1. Login at `/admin`
2. Go to **Products** → **Add Product**
3. Fill in product details and save

### 6. Auto-Feature Products

1. Go to **Featured** in admin
2. Click **Run Auto-Feature Now**
3. Top-selling products will be automatically featured

---

## 📁 Project Structure

```
scent-inn/
├── app/
│   ├── admin/              # Admin portal pages
│   │   ├── dashboard/      # Dashboard with stats
│   │   ├── products/       # Product management
│   │   ├── orders/         # Order management
│   │   └── featured/       # Featured & hero management
│   ├── api/                # API routes
│   │   ├── products/       # Product CRUD
│   │   ├── orders/         # Order CRUD
│   │   └── admin/          # Admin auth & stats
│   ├── shop/               # Product catalog & details
│   ├── order/              # Order placement pages
│   ├── about/              # About page
│   ├── contact/            # Contact page
│   └── page.js             # Homepage
├── components/             # Reusable components
│   ├── Navbar.js
│   ├── Footer.js
│   ├── HeroSlider.js
│   ├── ProductCard.js
│   └── FeaturedSlider.js
├── lib/
│   ├── db.js               # MongoDB connection
│   └── auth.js             # JWT authentication
├── models/                 # Mongoose schemas
│   ├── Product.js
│   ├── Order.js
│   ├── Admin.js
│   └── Settings.js
└── public/                 # Static assets
```

---

## 🎨 Customization

### Change Brand Colors

Edit `app/globals.css`:

```css
:root {
  --gold: #c9a84c;          /* Primary gold color */
  --gold-light: #e8c97a;    /* Light gold */
  --gold-dark: #9a7a2e;     /* Dark gold */
  --dark: #0a0a0a;          /* Background */
}
```

### Update Brand Name

Search and replace `SCENT INN` and `Scent Inn` throughout the project.

### Add Payment Gateway

Integrate Stripe, PayPal, or local payment gateways in:
- `app/order/[slug]/OrderForm.js`
- `app/api/orders/route.js`

---

## 📦 Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `SETUP_DISABLED=false`
4. Click **Deploy**

### 3. Set Up Custom Domain (Optional)

1. Go to Vercel project settings
2. Add your custom domain
3. Update DNS records as instructed

---

## 🎯 Running Ads

### Facebook/Instagram Ads

**Landing Page URL:**
```
https://yourdomain.com/order/product-slug?utm_source=facebook&utm_medium=cpc&utm_campaign=summer-sale
```

**Tracking:**
- All orders capture UTM parameters
- View order sources in admin dashboard

### Google Ads

**Landing Page URL:**
```
https://yourdomain.com/order/product-slug?utm_source=google&utm_medium=cpc&utm_campaign=perfume-keywords
```

### TikTok Ads

**Landing Page URL:**
```
https://yourdomain.com/order/product-slug?utm_source=tiktok&utm_medium=cpc&utm_campaign=viral-video
```

---

## 🔧 API Endpoints

### Public Endpoints

```
GET  /api/products              # List products
GET  /api/products/:id          # Get product by ID or slug
POST /api/orders                # Create order
```

### Admin Endpoints (Requires Auth)

```
POST /api/admin/login           # Admin login
POST /api/admin/logout          # Admin logout
GET  /api/admin/stats           # Dashboard stats
POST /api/admin/auto-feature    # Auto-feature products

GET  /api/orders                # List orders
PUT  /api/orders/:id            # Update order

POST /api/products              # Create product
PUT  /api/products/:id          # Update product
DELETE /api/products/:id        # Delete product
```

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19
- **Styling:** Tailwind CSS v4
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Hosting:** Vercel (free tier compatible)
- **Language:** JavaScript

---

## 📊 Database Schema

### Product
```javascript
{
  name, slug, description, price, comparePrice,
  images[], category, notes{top, middle, base},
  volume, inStock, isFeatured, isHeroSlide,
  salesCount, rating, reviewCount, tags[]
}
```

### Order
```javascript
{
  orderNumber, customer{name, email, phone},
  shippingAddress{street, city, state, postalCode},
  items[], subtotal, shippingCost, discount, total,
  status, paymentMethod, paymentStatus,
  utmSource, utmMedium, utmCampaign
}
```

### Admin
```javascript
{
  name, email, password (hashed),
  role, isActive
}
```

---

## 🎁 Features Breakdown

### Auto-Feature System
Automatically promotes your best-selling products to:
- **Featured Section** — Shows on homepage
- **Hero Slider** — Main carousel on homepage

**How it works:**
1. Sorts products by `salesCount`
2. Marks top N products as featured
3. Marks top M products as hero slides
4. Updates `featuredOrder` and `heroSlideOrder`

### Order Flow
1. Customer clicks ad → lands on `/order/product-slug`
2. Fills in shipping details
3. Selects payment method (COD, EasyPaisa, etc.)
4. Submits order
5. Order saved to database with UTM tracking
6. Redirects to success page
7. Admin receives order in dashboard

---

## 🔐 Security

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ HTTP-only cookies for admin sessions
- ✅ Environment variables for secrets
- ✅ Setup route can be disabled after first use
- ✅ Admin routes protected with middleware

---

## 📈 Performance

- ✅ Server-side rendering for SEO
- ✅ Static generation where possible
- ✅ Optimized images with Next.js Image
- ✅ Minimal JavaScript bundle
- ✅ Fast page loads (<2s)
- ✅ Mobile-optimized

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check your connection string in `.env.local`
- Ensure IP whitelist includes `0.0.0.0/0` in MongoDB Atlas
- Verify database user has read/write permissions

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Admin Can't Login
- Verify JWT_SECRET is set in `.env.local`
- Check admin account exists in database
- Clear browser cookies and try again

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🤝 Support

For questions or issues:
- Open an issue on GitHub
- Email: hello@scentinn.com

---

## 🎉 What's Next?

- [ ] Add product reviews and ratings
- [ ] Implement wishlist functionality
- [ ] Add email notifications
- [ ] Integrate payment gateways
- [ ] Add inventory management
- [ ] Create mobile app
- [ ] Add multi-language support
- [ ] Implement discount codes

---

**Built with ❤️ for perfume entrepreneurs**
