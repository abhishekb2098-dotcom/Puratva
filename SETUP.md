# Puratva – Setup & Deployment Guide

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your actual credentials
```

### 3. Setup PostgreSQL
Option A – Docker (recommended):
```bash
docker-compose up db -d
```

Option B – Local PostgreSQL:
```sql
CREATE DATABASE puratva_db;
```

Update `DATABASE_URL` in `.env` accordingly.

### 4. Run Migrations & Seed Data
```bash
npm run db:push        # Push schema to database
npm run db:seed        # Seed categories, products, admin user
```

Admin credentials after seed:
- Email: `admin@puratva.com`
- Password: `Admin@123`

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Required Environment Variables

### Database
```
DATABASE_URL=postgresql://user:pass@localhost:5432/puratva_db
```

### NextAuth
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
```

### Cloudinary (Image Upload)
1. Create account at cloudinary.com
2. Copy Cloud Name, API Key, API Secret
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

### Razorpay (Payments)
1. Create account at razorpay.com
2. Get Test/Live API keys from Dashboard → Settings → API Keys
```
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your-secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```

### Google OAuth (Optional)
1. Go to console.cloud.google.com
2. Create OAuth 2.0 credentials
```
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

---

## 📁 Project Structure

```
Puratva/
├── app/
│   ├── (store)/          # Customer-facing pages
│   │   ├── page.tsx      # Homepage
│   │   ├── shop/         # Shop & Category pages
│   │   ├── product/      # Product detail
│   │   ├── cart/         # Cart
│   │   ├── checkout/     # Checkout + Razorpay
│   │   ├── wishlist/     # Wishlist
│   │   ├── orders/       # Order tracking
│   │   └── auth/         # Login, Register
│   ├── (admin)/          # Admin panel (protected)
│   │   └── admin/
│   │       ├── page.tsx  # Dashboard with stats
│   │       ├── products/ # Product CRUD
│   │       ├── categories/
│   │       ├── banners/  # Banner management
│   │       ├── testimonials/
│   │       └── orders/
│   └── api/              # API routes
├── components/
│   ├── home/             # Homepage sections
│   ├── shop/             # Shop components
│   ├── admin/            # Admin components
│   ├── cart/             # Cart drawer
│   └── shared/           # Navbar, Footer
├── lib/                  # Prisma, Auth, Cloudinary, Utils
├── prisma/
│   ├── schema.prisma     # Full database schema
│   └── seed.ts           # Seed data
├── store/                # Zustand cart + wishlist
└── types/                # TypeScript types
```

---

## 🚢 Production Deployment

### Vercel (Recommended for Frontend)
```bash
npm install -g vercel
vercel
```

Add all environment variables in Vercel Dashboard → Settings → Environment Variables.

### Database (Supabase / Railway)
1. Create a PostgreSQL database at supabase.com or railway.app
2. Copy the connection string to `DATABASE_URL`
3. Run `npm run db:push` with the production DATABASE_URL

### Docker (Full Stack)
```bash
docker-compose up --build -d
```

---

## 👑 Admin Panel

Access: `/admin` (requires ADMIN role)

Features:
- **Dashboard** – Revenue, orders, customers, low-stock alerts
- **Products** – Add/edit/delete products with multiple images, variants
- **Categories** – Manage categories and sub-categories
- **Banners** – Upload/schedule homepage banners with CTA
- **Testimonials** – Approve/reject/feature customer reviews
- **Orders** – View and update order status
- **Customers** – View registered users

---

## 🛒 Customer Features

- Browse by category (Oils, Ghee, Pickles, Premixes, Pulses, Dairy)
- Product search and filtering
- Product variants (sizes)
- Add to cart / Wishlist
- Coupon codes (WELCOME10, ORGANIC20, FLAT50)
- Razorpay checkout
- Order tracking
- Leave reviews

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:generate` | Regenerate Prisma client |
