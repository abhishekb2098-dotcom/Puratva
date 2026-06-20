import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Puratva database...");

  // Admin user
  const hashedPassword = await bcrypt.hash("Admin@123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@puratva.com" },
    update: {},
    create: {
      name: "Puratva Admin",
      email: "admin@puratva.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Categories
  const categoriesData = [
    { name: "Oils", slug: "oils", description: "100% cold-pressed natural oils — groundnut, coconut, sesame, mustard, and sunflower.", icon: "🫒", sortOrder: 1 },
    { name: "Ghee", slug: "ghee", description: "Traditional bilona and A2 cow ghee made the authentic way.", icon: "🧈", sortOrder: 2 },
    { name: "Pickles", slug: "pickles", description: "Handcrafted Indian pickles made from farm-fresh produce and cold-pressed oils.", icon: "🥭", sortOrder: 3 },
    { name: "Premixes", slug: "premixes", description: "Ready-to-cook organic premixes for dosa, idli, upma, and more.", icon: "🍲", sortOrder: 4 },
    { name: "Pulses", slug: "pulses", description: "Organic farm-fresh lentils and pulses — toor, moong, chana, and urad dal.", icon: "🌾", sortOrder: 5 },
    { name: "Dairy Products", slug: "dairy-products", description: "Fresh farm dairy — milk, paneer, butter, ghee, curd, and more.", icon: "🥛", sortOrder: 6 },
  ];

  const categories: Record<string, any> = {};
  for (const cat of categoriesData) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: { ...cat, isActive: true },
    });
    categories[cat.slug] = c;
    console.log(`✅ Category: ${c.name}`);
  }

  const categoryImages: Record<string, string> = {
    oils: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80",
    ghee: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80",
    pickles: "https://images.unsplash.com/photo-1568158879083-c42860933ed7?w=400&q=80",
    premixes: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
    pulses: "/images/categories/pulses.png",
    "dairy-products": "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80",
  };

  for (const [slug, image] of Object.entries(categoryImages)) {
    await prisma.category.update({ where: { slug }, data: { image } });
  }

  // Sub-categories
  const subCatsData = [
    { categorySlug: "oils", name: "Groundnut Oil", slug: "groundnut-oil" },
    { categorySlug: "oils", name: "Coconut Oil", slug: "coconut-oil" },
    { categorySlug: "oils", name: "Sesame Oil", slug: "sesame-oil" },
    { categorySlug: "ghee", name: "A2 Cow Ghee", slug: "a2-cow-ghee" },
    { categorySlug: "ghee", name: "Buffalo Ghee", slug: "buffalo-ghee" },
    { categorySlug: "dairy-products", name: "Milk", slug: "milk" },
    { categorySlug: "dairy-products", name: "Paneer", slug: "paneer" },
  ];

  for (const sub of subCatsData) {
    await prisma.subCategory.upsert({
      where: { slug_categoryId: { slug: sub.slug, categoryId: categories[sub.categorySlug].id } },
      update: {},
      create: { name: sub.name, slug: sub.slug, categoryId: categories[sub.categorySlug].id, isActive: true },
    });
  }
  console.log("✅ Sub-categories created");

  // Products
  const productsData = [
    {
      name: "A2 Cow Bilona Ghee",
      slug: "a2-cow-bilona-ghee",
      description: "Prepared using the traditional bilona method from A2 cow milk. Rich in CLA, vitamins, and butyric acid. Our ghee is hand-churned in small batches to preserve all its natural goodness.\n\nBenefits:\n• Rich in fat-soluble vitamins A, D, E, and K\n• High in butyric acid — great for gut health\n• Lactose and casein-free\n• Ideal for cooking, baking, and Ayurvedic use",
      shortDesc: "Traditional bilona A2 cow ghee, hand-churned in small batches.",
      price: 899, comparePrice: 1099, stock: 150, unit: "500ml",
      categorySlug: "ghee", isBestSeller: true, isOrganic: true, sortOrder: 1,
      images: [{ url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80", isPrimary: true }],
      variants: [
        { name: "Size", value: "250ml", price: 499, stock: 80 },
        { name: "Size", value: "500ml", price: 899, stock: 150 },
        { name: "Size", value: "1 Litre", price: 1699, stock: 60 },
      ],
    },
    {
      name: "Cold-Pressed Groundnut Oil",
      slug: "cold-pressed-groundnut-oil",
      description: "Extracted using traditional wooden expeller (chekku) pressing without any heat. Retains all the natural nutrients, flavour, and aroma of raw peanuts.\n\nKey Features:\n• No hexane or chemical extraction\n• High in monounsaturated fats\n• Natural Vitamin E content\n• Deep, nutty flavour",
      shortDesc: "Chekku-pressed groundnut oil — retains all natural flavours and nutrition.",
      price: 349, comparePrice: 449, stock: 200, unit: "1 Litre",
      categorySlug: "oils", isBestSeller: true, isOrganic: true, sortOrder: 1,
      images: [{ url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80", isPrimary: true }],
      variants: [
        { name: "Size", value: "500ml", price: 199, stock: 150 },
        { name: "Size", value: "1 Litre", price: 349, stock: 200 },
        { name: "Size", value: "2 Litres", price: 649, stock: 80 },
      ],
    },
    {
      name: "Mango Pickle (Aam Ka Achar)",
      slug: "mango-pickle",
      description: "Made from raw unripe mangoes sun-dried and pickled in cold-pressed mustard oil with authentic Indian spices. A taste of grandmother's kitchen, every jar!",
      shortDesc: "Homestyle mango pickle in cold-pressed mustard oil.",
      price: 199, comparePrice: 249, stock: 300, unit: "500g",
      categorySlug: "pickles", isBestSeller: true, isOrganic: true, sortOrder: 1,
      images: [{ url: "https://images.unsplash.com/photo-1568158879083-c42860933ed7?w=600&q=80", isPrimary: true }],
      variants: [
        { name: "Size", value: "250g", price: 119, stock: 200 },
        { name: "Size", value: "500g", price: 199, stock: 300 },
        { name: "Size", value: "1 kg", price: 369, stock: 100 },
      ],
    },
    {
      name: "Organic Toor Dal",
      slug: "organic-toor-dal",
      description: "Farm-grown toor dal (pigeon peas) with no chemical pesticides or synthetic fertilisers. Nutty in flavour and perfectly sized for easy cooking.",
      shortDesc: "Farm-fresh pesticide-free toor dal.",
      price: 189, comparePrice: 229, stock: 400, unit: "1 kg",
      categorySlug: "pulses", isNewArrival: true, isOrganic: true, sortOrder: 1,
      images: [{ url: "https://images.unsplash.com/photo-1585664811641-5b51bb30e4e8?w=600&q=80", isPrimary: true }],
    },
    {
      name: "Dosa Premix (Organic)",
      slug: "dosa-premix",
      description: "Just add water and you are ready to make crispy restaurant-style dosas at home! Made from organic rice and urad dal in the perfect ratio.",
      shortDesc: "Ready-to-cook organic dosa mix. Just add water!",
      price: 149, comparePrice: 179, stock: 180, unit: "500g",
      categorySlug: "premixes", isNewArrival: true, isOrganic: true, sortOrder: 1,
      images: [{ url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80", isPrimary: true }],
    },
    {
      name: "Fresh Farm Paneer",
      slug: "fresh-farm-paneer",
      description: "Made fresh daily from full-fat cow milk. Soft, rich, and perfect for curries, grills, and salads.",
      shortDesc: "Farm-fresh paneer made daily from cow milk.",
      price: 129, comparePrice: 159, stock: 100, unit: "200g",
      categorySlug: "dairy-products", isNewArrival: true, isOrganic: true, sortOrder: 1,
      images: [{ url: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&q=80", isPrimary: true }],
    },
    {
      name: "Cold-Pressed Coconut Oil",
      slug: "cold-pressed-coconut-oil",
      description: "Extracted from fresh coconuts without any heat treatment. Perfect for cooking, hair care, and skin care.",
      shortDesc: "Virgin coconut oil — extracted cold from fresh coconuts.",
      price: 499, comparePrice: 599, stock: 120, unit: "500ml",
      categorySlug: "oils", isBestSeller: true, isOrganic: true, sortOrder: 2,
      images: [{ url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80", isPrimary: true }],
    },
    {
      name: "Lemon Pickle",
      slug: "lemon-pickle",
      description: "Tangy, spicy, and absolutely delicious! Made from fresh nimbu pickled in cold-pressed oil with authentic spices.",
      shortDesc: "Authentic spicy lemon pickle in cold-pressed oil.",
      price: 179, comparePrice: 219, stock: 200, unit: "250g",
      categorySlug: "pickles", isOrganic: true, sortOrder: 2,
      images: [{ url: "https://images.unsplash.com/photo-1568158879083-c42860933ed7?w=600&q=80", isPrimary: true }],
    },
  ];

  for (const p of productsData) {
    const { categorySlug, images, variants, ...productData } = p;
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...productData,
        categoryId: categories[categorySlug].id,
        isActive: true,
        images: images?.length ? { create: images.map((img, i) => ({ ...img, sortOrder: i })) } : undefined,
        variants: variants?.length ? { create: variants } : undefined,
      },
    });
    console.log(`✅ Product: ${product.name}`);
  }

  // Banners
  const bannersData = [
    {
      title: "From Nature To Your Home",
      subtitle: "Pure. Traditional. Authentic.",
      description: "100% organic, farm-fresh products crafted using age-old traditions.",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1400&q=80",
      ctaText: "Shop Now",
      ctaLink: "/shop",
      badge: "New Arrivals",
      isActive: true,
      sortOrder: 1,
    },
    {
      title: "A2 Cow Ghee — Nature's Gold",
      subtitle: "Traditional Bilona Method",
      description: "Hand-churned from desi cow milk using the ancient bilona process.",
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1400&q=80",
      ctaText: "Buy Ghee",
      ctaLink: "/shop/ghee",
      badge: "Best Seller",
      isActive: true,
      sortOrder: 2,
    },
  ];

  for (const b of bannersData) {
    await prisma.banner.create({ data: b });
  }
  console.log("✅ Banners created");

  // Testimonials
  const testimonialsData = [
    { name: "Priya Sharma", location: "Mumbai", rating: 5, content: "The A2 Cow Ghee is absolutely divine! Rich, aromatic, and exactly how ghee should be.", isFeatured: true, status: "APPROVED" as const },
    { name: "Rajesh Kumar", location: "Delhi", rating: 5, content: "Cold-pressed mustard oil from Puratva is exceptional. Consistent quality, great packaging.", isFeatured: true, status: "APPROVED" as const },
    { name: "Anjali Patel", location: "Ahmedabad", rating: 5, content: "Their mango pickle is straight out of a grandmother's kitchen. Already on my fourth jar!", isFeatured: true, status: "APPROVED" as const },
  ];

  for (const t of testimonialsData) {
    await prisma.testimonial.create({ data: t });
  }
  console.log("✅ Testimonials created");

  // Coupons
  const coupons = [
    { code: "WELCOME10", description: "10% off on first order", type: "PERCENTAGE", value: 10, minOrderAmount: 299, maxDiscount: 100, isActive: true },
    { code: "ORGANIC20", description: "20% off on orders above ₹999", type: "PERCENTAGE", value: 20, minOrderAmount: 999, maxDiscount: 200, isActive: true },
    { code: "FLAT50", description: "Flat ₹50 off", type: "FIXED", value: 50, minOrderAmount: 499, isActive: true },
  ];
  for (const c of coupons) {
    await prisma.coupon.upsert({ where: { code: c.code }, update: {}, create: c });
  }
  console.log("✅ Coupons created");

  console.log("\n🎉 Database seeded successfully!");
  console.log("📧 Admin: admin@puratva.com | 🔑 Password: Admin@123");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
