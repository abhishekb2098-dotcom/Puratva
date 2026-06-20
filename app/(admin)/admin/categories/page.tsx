import { prisma } from "@/lib/prisma";
import CategoryEditor from "@/components/admin/CategoryEditor";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: { where: { isActive: true } },
        },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-muted-foreground text-sm">
          Manage storefront category images, descriptions, ordering, and visibility.
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {categories.map((category) => (
          <CategoryEditor key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
