import { prisma } from "@/lib/prisma";
import CategoryEditor from "@/components/admin/CategoryEditor";
import NewCategoryCard from "@/components/admin/NewCategoryCard";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      subCategories: { orderBy: { sortOrder: "asc" } },
      _count: {
        select: { products: { where: { isActive: true } } },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground text-sm">
            Manage storefront categories, sub-categories, images, and visibility.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        <NewCategoryCard />
        {categories.map((category) => (
          <CategoryEditor key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
