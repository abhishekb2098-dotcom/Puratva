"use client";

import { useWishlistStore } from "@/store/wishlist";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const removeItem = useWishlistStore((s) => s.removeItem);
  const addToCart = useCartStore((s) => s.addItem);

  const moveToCart = (item: any) => {
    addToCart({
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    });
    removeItem(item.productId);
    toast.success("Moved to cart");
  };

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

      {items.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Heart className="w-14 h-14 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Your wishlist is empty</p>
          <p className="text-sm mt-1 mb-6">Save your favourite products here.</p>
          <Link href="/shop" className="bg-puratva-green text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-puratva-green-dark transition-colors inline-block">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.productId} className="bg-white rounded-2xl border overflow-hidden">
              <Link href={`/product/${item.slug || item.productId}`}>
                <div className="relative h-44 bg-muted">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="h-full flex items-center justify-center text-3xl">🌿</div>
                  )}
                </div>
              </Link>
              <div className="p-3 space-y-2">
                <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                <p className="text-puratva-green font-bold">₹{item.price}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => moveToCart(item)}
                    className="flex-1 flex items-center justify-center gap-1 bg-puratva-green text-white rounded-lg py-1.5 text-xs font-medium hover:bg-puratva-green-dark transition-colors"
                  >
                    <ShoppingCart className="w-3 h-3" /> Add to Cart
                  </button>
                  <button
                    onClick={() => { removeItem(item.productId); toast.success("Removed from wishlist"); }}
                    className="p-1.5 hover:bg-red-50 rounded-lg group"
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground group-hover:text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
