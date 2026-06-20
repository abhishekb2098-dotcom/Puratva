import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

type Props = { params: Promise<{ id: string }> };

export default async function ProductEditPage({ params }: Props) {
  const { id } = await params;
  const isNew = id === "new";

  const [product, categories] = await Promise.all([
    isNew ? null : prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } }, variants: true, tags: true },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      include: { subCategories: { where: { isActive: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!isNew && !product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{isNew ? "Add New Product" : `Edit: ${product?.name}`}</h1>
      <ProductForm product={product as any} categories={categories as any} isNew={isNew} />
    </div>
  );
}
