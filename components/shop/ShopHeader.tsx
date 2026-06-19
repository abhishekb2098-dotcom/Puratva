"use client";

import { useRouter, usePathname } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";

type Props = {
  total: number;
  searchParams: any;
};

export default function ShopHeader({ total, searchParams }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const updateSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set("search", value);
    else params.delete("search");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-white border-b">
      <div className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">All Products</h1>
            <p className="text-muted-foreground text-sm mt-1">{total} products found</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search products..."
              defaultValue={searchParams?.search}
              onChange={(e) => updateSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-puratva-green/30 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
