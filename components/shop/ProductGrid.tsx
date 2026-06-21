"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Star, Leaf } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import toast from "react-hot-toast";
import type { ProductWithRelations } from "@/types";

type Props = {
  products: ProductWithRelations[];
  total: number;
  page: number;
  limit: number;
  searchParams: any;
};

export default function ProductGrid({ products, total, page, limit, searchParams }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const { addItem: addWish, removeItem: removeWish, hasItem } = useWishlistStore();
  const totalPages = Math.ceil(total / limit);

  const handleAddToCart = (p: ProductWithRelations) => {
    const img = p.images?.find((i) => i.isPrimary)?.url || p.images?.[0]?.url || "";
    addItem({
      id: `cart-${p.id}`,
      productId: p.id,
      name: p.name,
      price: p.price,
      image: img,
      quantity: 1,
      stock: p.stock,
    });
    toast.success(`${p.name} added to cart!`);
  };

  if (!products.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">🌿</div>
        <h3 className="font-display text-xl font-bold mb-2">No Products Found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
        <Link href="/shop" className="mt-4 bg-puratva-green text-white px-6 py-2 rounded-full font-medium hover:bg-puratva-green-dark transition-colors">
          Clear Filters
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((p, i) => {
          const img = p.images?.find((im) => im.isPrimary)?.url || p.images?.[0]?.url || "";
          const avgRating = p.reviews?.length
            ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
            : 5;
          const discount = calculateDiscount(p.price, p.comparePrice || 0);
          const isWished = hasItem(p.id);

          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group"
            >
              <div className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <Image src={img || "/images/placeholder.jpg"} alt={p.name} fill className={`object-cover group-hover:scale-105 transition-transform duration-500 ${(p as any).status === "out_of_stock" || (p as any).status === "coming_soon" ? "opacity-70" : ""}`} />
                  {(p as any).status === "out_of_stock" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
                    </div>
                  )}
                  {(p as any).status === "coming_soon" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">Coming Soon</span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {discount > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">-{discount}%</span>}
                    {p.isBestSeller && <span className="bg-puratva-gold text-puratva-green-dark text-xs font-bold px-2 py-0.5 rounded-full">Best Seller</span>}
                    {p.isNewArrival && <span className="bg-puratva-green text-white text-xs font-bold px-2 py-0.5 rounded-full">New</span>}
                  </div>
                  {p.isOrganic && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-white/90 text-puratva-green text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Leaf className="w-3 h-3" /> Organic
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      if (isWished) { removeWish(p.id); toast("Removed from wishlist"); }
                      else { addWish({ id: `w-${p.id}`, productId: p.id, name: p.name, price: p.price, comparePrice: p.comparePrice || undefined, image: img, slug: p.slug }); toast.success("Added to wishlist!"); }
                    }}
                    className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Heart className={`w-4 h-4 ${isWished ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                  </button>
                </div>
                <div className="p-2.5 md:p-3">
                  <div className="text-xs text-puratva-green font-medium mb-0.5 truncate">{p.category?.name}</div>
                  <Link href={`/product/${p.slug}`}>
                    <h3 className="font-medium text-xs md:text-sm line-clamp-2 hover:text-puratva-green transition-colors leading-snug">{p.name}</h3>
                  </Link>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-puratva-gold text-puratva-gold shrink-0" />
                    <span className="text-xs">{avgRating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground hidden sm:inline">({p.reviews?.length})</span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{p.unit}</div>
                  <div className="flex items-center justify-between mt-2 gap-1">
                    <div className="min-w-0">
                      {(p as any).status !== "coming_soon" && (
                        <div className="flex items-baseline gap-1 flex-wrap">
                          <span className="font-bold text-xs md:text-sm">{formatPrice(p.price)}</span>
                          {p.comparePrice && p.comparePrice > p.price && (
                            <span className="text-[10px] text-muted-foreground line-through">{formatPrice(p.comparePrice)}</span>
                          )}
                        </div>
                      )}
                    </div>
                    {(p as any).status === "coming_soon" ? (
                      <span className="text-[10px] md:text-xs px-2 py-1 bg-yellow-100 text-yellow-700 font-semibold rounded-lg whitespace-nowrap">Soon</span>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(p)}
                        disabled={(p as any).status === "out_of_stock" || p.stock === 0}
                        className="flex items-center gap-1 bg-puratva-green text-white text-[10px] md:text-xs px-2 md:px-2.5 py-1.5 rounded-lg hover:bg-puratva-green-dark transition-colors disabled:opacity-50 shrink-0"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        <span className="hidden sm:inline">{(p as any).status === "out_of_stock" || p.stock === 0 ? "Sold Out" : "Add"}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`?${new URLSearchParams({ ...searchParams, page: String(p) })}`}
              className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                p === page ? "bg-puratva-green text-white" : "border border-border hover:border-puratva-green hover:text-puratva-green"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
