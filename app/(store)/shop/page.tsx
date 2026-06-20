import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import ProductGrid from "@/components/shop/ProductGrid";
import ShopFilters from "@/components/shop/ShopFilters";
import ShopHeader from "@/components/shop/ShopHeader";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse our complete range of organic, farm-fresh products â€” oils, ghee, pickles, pulses, dairy and more.",
};

async function getProducts(searchParams: any) {
  const page = parseInt(searchParams?.page || "1");
  const limit = 12;
  const skip = (page - 1) * limit;
  const categorySlug = searchParams?.category;
  const sort = searchParams?.sort || "featured";
  const search = searchParams?.search;
  const minPrice = searchParams?.minPrice ? parseFloat(searchParams.minPrice) : undefined;
  const maxPrice = searchParams?.maxPrice ? parseFloat(searchParams.maxPrice) : undefined;

  try {
    const where: any = { isActive: true };
    if (categorySlug) where.category = { slug: categorySlug };
    if (search) where.name = { contains: search, mode: "insensitive" };
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const orderBy: any =
      sort === "price-asc" ? { price: "asc" }
      : sort === "price-desc" ? { price: "desc" }
      : sort === "newest" ? { createdAt: "desc" }
      : sort === "rating" ? { reviews: { _count: "desc" } }
      : { sortOrder: "asc" };

    const [products, total, categories] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" } },
          reviews: { select: { rating: true } },
          variants: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
      prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    ]);

    return { products, total, categories, page, limit };
  } catch {
    return { products: [], total: 0, categories: [], page: 1, limit: 12 };
  }
}

export default async function ShopPage({ searchParams }: { searchParams: any }) {
  const { products, total, categories, page, limit } = await getProducts(searchParams);

  return (
    <div className="min-h-screen bg-puratva-cream">
      <ShopHeader total={total} searchParams={searchParams} />
      <div className="container py-8">
        <div className="flex gap-8">
          <ShopFilters categories={categories} searchParams={searchParams} />
          <ProductGrid
            products={products as any}
            total={total}
            page={page}
            limit={limit}
            searchParams={searchParams}
          />
        </div>
      </div>
    </div>
  );
}
