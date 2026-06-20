import { prisma } from "@/lib/prisma";
import { getSiteConfig } from "@/lib/site-config";
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
          OR: [{ startsAt: null }, { startsAt: { lte: new Date() } }],
          AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: new Date() } }] }],
        },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.category.findMany({
        where: { isActive: true },
        include: { _count: { select: { products: { where: { isActive: true } } } } },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.product.findMany({
        where: { isBestSeller: true, isActive: true },
        include: {
          category: true, subCategory: true,
          images: { orderBy: { sortOrder: "asc" } },
          variants: true, reviews: { select: { rating: true } },
        },
        orderBy: { sortOrder: "asc" },
        take: 8,
      }),
      prisma.product.findMany({
        where: { isNewArrival: true, isActive: true },
        include: {
          category: true, subCategory: true,
          images: { orderBy: { sortOrder: "asc" } },
          variants: true, reviews: { select: { rating: true } },
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
  const [{ banners, categories, bestSellers, newArrivals, testimonials }, config] =
    await Promise.all([getData(), getSiteConfig()]);

  const features = [
    { title: config.feat1Title, desc: config.feat1Desc, icon: config.feat1Icon },
    { title: config.feat2Title, desc: config.feat2Desc, icon: config.feat2Icon },
    { title: config.feat3Title, desc: config.feat3Desc, icon: config.feat3Icon },
    { title: config.feat4Title, desc: config.feat4Desc, icon: config.feat4Icon },
    { title: config.feat5Title, desc: config.feat5Desc, icon: config.feat5Icon },
    { title: config.feat6Title, desc: config.feat6Desc, icon: config.feat6Icon },
  ];

  const stats = [
    { value: config.stat1Value, label: config.stat1Label },
    { value: config.stat2Value, label: config.stat2Label },
    { value: config.stat3Value, label: config.stat3Label },
    { value: config.stat4Value, label: config.stat4Label },
  ];

  // Parse section order from config
  let sections: { id: string; enabled: boolean; size?: string }[] = [];
  try {
    sections = JSON.parse(config.homePageSections);
  } catch {
    sections = [
      { id: "hero", enabled: true, size: "M" },
      { id: "categories", enabled: true, size: "M" },
      { id: "bestSellers", enabled: true, size: "M" },
      { id: "whyUs", enabled: true, size: "M" },
      { id: "newArrivals", enabled: true, size: "M" },
      { id: "testimonials", enabled: true, size: "M" },
      { id: "newsletter", enabled: true, size: "M" },
    ];
  }

  const buildSectionMap = (s: { id: string; size?: string }): React.ReactNode => {
    const sp = s.size ?? "M";
    switch (s.id) {
      case "hero":
        return <HeroSection key="hero" banners={banners} />;
      case "categories":
        return <CategoriesSection key="categories" categories={categories as any} spacing={sp} />;
      case "bestSellers":
        return (
          <FeaturedProducts
            key="bestSellers"
            products={bestSellers as any}
            title="Best Sellers"
            subtitle="Our most loved products — trusted by thousands of happy customers."
            spacing={sp}
          />
        );
      case "whyUs":
        return (
          <WhyPuratva
            key="whyUs"
            whyLabel={config.whyLabel}
            whyTitle={config.whyTitle}
            whySubtext={config.whySubtext}
            whyCardAlignment={config.whyCardAlignment}
            features={features}
            stats={stats}
            spacing={sp}
          />
        );
      case "newArrivals":
        return newArrivals.length > 0 ? (
          <FeaturedProducts
            key="newArrivals"
            products={newArrivals as any}
            title="New Arrivals"
            subtitle="Fresh additions to our organic family. Be the first to try them."
            spacing={sp}
          />
        ) : null;
      case "testimonials":
        return (
          <TestimonialsSection
            key="testimonials"
            testimonials={testimonials}
            label={config.testimonialsLabel}
            title={config.testimonialsTitle}
            subtext={config.testimonialsSubtext}
            perView={Number(config.testimonialsPerView) || 1}
            spacing={sp}
          />
        );
      case "newsletter":
        return (
          <NewsletterSection
            key="newsletter"
            heading={config.newsletterHeading}
            subtext={config.newsletterSubtext}
            spacing={sp}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {sections
        .filter((s) => s.enabled)
        .map((s) => buildSectionMap(s))
        .filter(Boolean)}
    </>
  );
}
