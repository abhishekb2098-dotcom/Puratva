import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

async function getProducts(searchParams: any) {
  const search = searchParams?.search;
  const category = searchParams?.category;
  const page = parseInt(searchParams?.page || "1");
  const limit = 20;

  const where: any = {};
  if (search) where.name = { contains: search, mode: "insensitive" };
  if (category) where.categoryId = category;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: { select: { name: true } },
        images: { where: { isPrimary: true }, take: 1 },
        _count: { select: { reviews: true } },
      },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, page, limit };
}

export default async function AdminProductsPage({ searchParams }: { searchParams: any }) {
  const { products, total, page, limit } = await getProducts(searchParams);
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground text-sm">{total} total products</p>
        </div>
        <Link href="/admin/products/new" className="flex items-center gap-2 bg-puratva-green text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-puratva-green-dark transition-colors">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border p-4 flex gap-3 flex-wrap">
        <form className="flex gap-3 flex-wrap flex-1">
          <input
            name="search"
            type="search"
            placeholder="Search products..."
            defaultValue={searchParams?.search}
            className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-puratva-green/30"
          />
          <select
            name="category"
            defaultValue={searchParams?.category}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green/30"
          >
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button type="submit" className="bg-puratva-green text-white px-4 py-2 rounded-lg text-sm font-medium">
            Filter
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Product</th>
              <th className="text-left px-4 py-3 font-medium">Category</th>
              <th className="text-left px-4 py-3 font-medium">Price</th>
              <th className="text-left px-4 py-3 font-medium">Stock</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                      {p.images[0] ? (
                        <Image src={p.images[0].url} alt={p.name} fill className="object-cover" />
                      ) : (
                        <Package className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium line-clamp-1">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.sku || p.id.slice(0, 8)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.category.name}</td>
                <td className="px-4 py-3 font-medium">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    p.stock === 0 ? "bg-red-100 text-red-700"
                    : p.stock <= 5 ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                  }`}>
                    {p.stock === 0 ? "Out of stock" : `${p.stock} units`}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                    {p.isActive ? "Active" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/products/${p.id}`} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-muted-foreground" />
                    </Link>
                    <DeleteProductButton id={p.id} name={p.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}
