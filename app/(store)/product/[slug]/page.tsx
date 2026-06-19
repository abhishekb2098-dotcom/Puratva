import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductDetail from "@/components/shop/ProductDetail";
import FeaturedProducts from "@/components/home/FeaturedProducts";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    select: { name: true, metaTitle: true, metaDesc: true, images: { take: 1 } },
  });
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.metaTitle || product.name,
    description: product.metaDesc || `Buy ${product.name} from Puratva — organic, farm-fresh quality.`,
    openGraph: {
      images: product.images[0] ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, isActive: true },
    include: {
      category: true,
      subCategory: true,
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      tags: true,
    },
  });

  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      reviews: { select: { rating: true } },
      variants: true,
    },
    take: 4,
  });

  return (
    <>
      <ProductDetail product={product as any} />
      {related.length > 0 && (
        <FeaturedProducts
          products={related as any}
          title="Related Products"
          subtitle="You might also like these organic picks."
        />
      )}
    </>
  );
}
