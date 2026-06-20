# Puratva

A full-stack e-commerce platform for organic, farm-fresh products — oils, ghee, pickles, premixes, pulses, and dairy.

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript** + **Tailwind CSS**
- **Prisma** ORM + **PostgreSQL** (SQLite for local dev)
- **NextAuth v5** (credentials + Google OAuth)
- **Razorpay** payments
- **Cloudinary** image uploads
- **Zustand** cart & wishlist
- **Framer Motion** animations

## Local Development

```bash
npm install --legacy-peer-deps
npx prisma db push
npx ts-node --project tsconfig.seed.json prisma/seed.ts
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin panel: `/admin` — seed credentials: `admin@puratva.com` / `Admin@123`

## Environment Variables

```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```
