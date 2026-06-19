"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { Category } from "@prisma/client";
import { SlidersHorizontal } from "lucide-react";

type Props = {
  categories: Category[];
  searchParams: any;
  currentCategory?: string;
};

export default function ShopFilters({ categories, searchParams, currentCategory }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="bg-white rounded-2xl p-6 border border-border sticky top-20">
        <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </h3>

        {/* Categories */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Categories</h4>
          <ul className="space-y-1">
            <li>
              <Link
                href="/shop"
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${!currentCategory ? "bg-puratva-green text-white font-medium" : "hover:bg-muted"}`}
              >
                All Products
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/shop/${cat.slug}`}
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${currentCategory === cat.slug ? "bg-puratva-green text-white font-medium" : "hover:bg-muted"}`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Price Range</h4>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              defaultValue={searchParams?.minPrice}
              onChange={(e) => updateParam("minPrice", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green/30"
            />
            <input
              type="number"
              placeholder="Max"
              defaultValue={searchParams?.maxPrice}
              onChange={(e) => updateParam("maxPrice", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green/30"
            />
          </div>
        </div>

        {/* Sort */}
        <div>
          <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Sort By</h4>
          <select
            defaultValue={searchParams?.sort || "featured"}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green/30"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Best Rated</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
