import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/shop/ProductGrid";
import ShopFilters from "@/components/shop/ShopFilters";

type Props = { params: Promise<{ category: string }>; searchParams: Promise<any> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { title: "Category Not Found" };
  return {
    title: `${category.name} – Organic ${category.name}`,
    description: category.description || `Shop our range of organic ${category.name.toLowerCase()}.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category: slug } = await params;
  const sp = await searchParams;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: { subCategories: true },
  });
  if (!category) notFound();

  const page = parseInt(sp?.page || "1");
  const limit = 12;
  const skip = (page - 1) * limit;
  const subCategorySlug = sp?.sub;
  const sort = sp?.sort || "featured";
  const minPrice = sp?.minPrice ? parseFloat(sp.minPrice) : undefined;
  const maxPrice = sp?.maxPrice ? parseFloat(sp.maxPrice) : undefined;

  const where: any = { isActive: true, categoryId: category.id };
  if (subCategorySlug) where.subCategory = { slug: subCategorySlug };
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  const orderBy: any =
    sort === "price-asc" ? { price: "asc" }
    : sort === "price-desc" ? { price: "desc" }
    : sort === "newest" ? { createdAt: "desc" }
    : { sortOrder: "asc" };

  const [products, total, allCategories] = await Promise.all([
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

  return (
    <div className="min-h-screen bg-puratva-cream">
      <div className="bg-puratva-green text-white py-12">
        <div className="container">
          <div className="text-sm text-white/60 mb-2">Home / Shop / {category.name}</div>
          <h1 className="font-display text-4xl font-bold">{category.name}</h1>
          {category.description && (
            <p className="mt-2 text-white/80 max-w-2xl">{category.description}</p>
          )}
          {category.subCategories.length > 0 && (
            <div className="flex gap-2 mt-4 flex-wrap">
              <a
                href={`/shop/${slug}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!subCategorySlug ? "bg-white text-puratva-green" : "bg-white/20 hover:bg-white/30 text-white"}`}
              >
                All
              </a>
              {category.subCategories.map((sub) => (
                <a
                  key={sub.id}
                  href={`/shop/${slug}?sub=${sub.slug}`}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${subCategorySlug === sub.slug ? "bg-white text-puratva-green" : "bg-white/20 hover:bg-white/30 text-white"}`}
                >
                  {sub.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container py-8">
        <div className="flex gap-8">
          <ShopFilters categories={allCategories} searchParams={sp} currentCategory={slug} />
          <ProductGrid
            products={products as any}
            total={total}
            page={page}
            limit={limit}
            searchParams={sp}
          />
        </div>
      </div>
    </div>
  );
}
