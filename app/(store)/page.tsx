import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import WhyPuratva from "@/components/home/WhyPuratva";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NewsletterSection from "@/components/home/NewsletterSection";

async function getData() {
  try {
    const [banners, categories, bestSellers, newArrivals, testimonials] = await Promise.all([
      prisma.banner.findMany({
        where: {
          isActive: true,
          OR: [
            { startsAt: null },
            { startsAt: { lte: new Date() } },
          ],
          AND: [
            { OR: [{ endsAt: null }, { endsAt: { gte: new Date() } }] },
          ],
        },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.category.findMany({
        where: { isActive: true },
        include: {
          _count: {
            select: {
              products: { where: { isActive: true } },
            },
          },
        },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.product.findMany({
        where: { isBestSeller: true, isActive: true },
        include: {
          category: true,
          subCategory: true,
          images: { orderBy: { sortOrder: "asc" } },
          variants: true,
          reviews: { select: { rating: true } },
        },
        orderBy: { sortOrder: "asc" },
        take: 8,
      }),
      prisma.product.findMany({
        where: { isNewArrival: true, isActive: true },
        include: {
          category: true,
          subCategory: true,
          images: { orderBy: { sortOrder: "asc" } },
          variants: true,
          reviews: { select: { rating: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
      prisma.testimonial.findMany({
        where: { status: "APPROVED", isFeatured: true },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
    ]);
    return { banners, categories, bestSellers, newArrivals, testimonials };
  } catch {
    return { banners: [], categories: [], bestSellers: [], newArrivals: [], testimonials: [] };
  }
}

export default async function HomePage() {
  const { banners, categories, bestSellers, newArrivals, testimonials } = await getData();

  return (
    <>
      <HeroSection banners={banners} />
      <CategoriesSection categories={categories as any} />
      <FeaturedProducts
        products={bestSellers as any}
        title="Best Sellers"
        subtitle="Our most loved products — trusted by thousands of happy customers."
      />
      <WhyPuratva />
      {newArrivals.length > 0 && (
        <FeaturedProducts
          products={newArrivals as any}
          title="New Arrivals"
          subtitle="Fresh additions to our organic family. Be the first to try them."
        />
      )}
      <TestimonialsSection testimonials={testimonials} />
      <NewsletterSection />
    </>
  );
}
