import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  const products = query
    ? await prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
            { tags: { contains: query } },
          ],
        },
        include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
        take: 24,
      })
    : [];

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Search Products</h1>

      <form method="GET" className="flex gap-3 mb-8 max-w-lg">
        <input
          name="q"
          defaultValue={query}
          placeholder="Search for ghee, oils, pickles…"
          className="flex-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green"
        />
        <button type="submit" className="bg-puratva-green text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-puratva-green-dark transition-colors flex items-center gap-2">
          <Search className="w-4 h-4" /> Search
        </button>
      </form>

      {query && (
        <p className="text-muted-foreground text-sm mb-4">
          {products.length} result{products.length !== 1 ? "s" : ""} for &quot;{query}&quot;
        </p>
      )}

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => {
            const img = p.images[0]?.url;
            return (
              <Link key={p.id} href={`/product/${p.slug}`} className="bg-white rounded-2xl border overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-44 bg-muted">
                  {img ? (
                    <Image src={img} alt={p.name} fill className="object-cover" />
                  ) : (
                    <div className="h-full flex items-center justify-center text-3xl">🌿</div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-medium text-sm line-clamp-2">{p.name}</p>
                  <p className="text-puratva-green font-bold mt-1">{formatPrice(p.price)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : query ? (
        <div className="text-center py-20 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm mt-1">Try a different search term or <Link href="/shop" className="text-puratva-green hover:underline">browse all products</Link>.</p>
        </div>
      ) : null}
    </div>
  );
}
