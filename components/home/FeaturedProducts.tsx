"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart, Star, Leaf } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import toast from "react-hot-toast";
import type { ProductWithRelations } from "@/types";

const fallbackProducts = [
  {
    id: "1",
    name: "A2 Cow Bilona Ghee",
    slug: "a2-cow-bilona-ghee",
    price: 899,
    comparePrice: 1099,
    images: [{ url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80", isPrimary: true }],
    category: { name: "Ghee" },
    isBestSeller: true,
    isOrganic: true,
    reviews: Array(47).fill({ rating: 5 }),
    stock: 50,
    unit: "500ml",
  },
  {
    id: "2",
    name: "Cold-Pressed Groundnut Oil",
    slug: "cold-pressed-groundnut-oil",
    price: 349,
    comparePrice: 449,
    images: [{ url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80", isPrimary: true }],
    category: { name: "Oils" },
    isBestSeller: true,
    isOrganic: true,
    reviews: Array(32).fill({ rating: 5 }),
    stock: 80,
    unit: "1 Litre",
  },
  {
    id: "3",
    name: "Mango Pickle (Aam Ka Achar)",
    slug: "mango-pickle",
    price: 199,
    comparePrice: 249,
    images: [{ url: "https://images.unsplash.com/photo-1568158879083-c42860933ed7?w=400&q=80", isPrimary: true }],
    category: { name: "Pickles" },
    isBestSeller: true,
    isOrganic: true,
    reviews: Array(61).fill({ rating: 5 }),
    stock: 100,
    unit: "500g",
  },
  {
    id: "4",
    name: "Organic Toor Dal",
    slug: "organic-toor-dal",
    price: 189,
    comparePrice: 229,
    images: [{ url: "https://images.unsplash.com/photo-1585664811641-5b51bb30e4e8?w=400&q=80", isPrimary: true }],
    category: { name: "Pulses" },
    isNewArrival: true,
    isOrganic: true,
    reviews: Array(18).fill({ rating: 4 }),
    stock: 120,
    unit: "1 kg",
  },
  {
    id: "5",
    name: "Dosa Mix (Ready to Cook)",
    slug: "dosa-premix",
    price: 149,
    comparePrice: 179,
    images: [{ url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80", isPrimary: true }],
    category: { name: "Premixes" },
    isNewArrival: true,
    isOrganic: true,
    reviews: Array(24).fill({ rating: 5 }),
    stock: 60,
    unit: "500g",
  },
  {
    id: "6",
    name: "Fresh Farm Paneer",
    slug: "fresh-farm-paneer",
    price: 129,
    comparePrice: 159,
    images: [{ url: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80", isPrimary: true }],
    category: { name: "Dairy" },
    isNewArrival: true,
    isOrganic: true,
    reviews: Array(39).fill({ rating: 5 }),
    stock: 30,
    unit: "200g",
  },
  {
    id: "7",
    name: "Cold-Pressed Coconut Oil",
    slug: "cold-pressed-coconut-oil",
    price: 499,
    comparePrice: 599,
    images: [{ url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80", isPrimary: true }],
    category: { name: "Oils" },
    isBestSeller: true,
    isOrganic: true,
    reviews: Array(55).fill({ rating: 5 }),
    stock: 40,
    unit: "500ml",
  },
  {
    id: "8",
    name: "Garlic Pickle",
    slug: "garlic-pickle",
    price: 179,
    comparePrice: 219,
    images: [{ url: "https://images.unsplash.com/photo-1568158879083-c42860933ed7?w=400&q=80", isPrimary: true }],
    category: { name: "Pickles" },
    isFeatured: true,
    isOrganic: true,
    reviews: Array(28).fill({ rating: 4 }),
    stock: 70,
    unit: "250g",
  },
];

const SPACING = { S: "py-8 md:py-10", M: "py-16 md:py-20", L: "py-20 md:py-28" };

type Props = {
  products?: ProductWithRelations[];
  title?: string;
  subtitle?: string;
  spacing?: string;
};

export default function FeaturedProducts({ products, title = "Featured Products", subtitle = "Best sellers, new arrivals, and trending picks — hand-selected for you.", spacing = "M" }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const { addItem: addWish, removeItem: removeWish, hasItem } = useWishlistStore();
  const data: any[] = products?.length ? products : fallbackProducts;

  const handleAddToCart = (p: any) => {
    const primaryImg = p.images?.find((img: any) => img.isPrimary)?.url || p.images?.[0]?.url;
    addItem({
      id: `cart-${p.id}`,
      productId: p.id,
      name: p.name,
      price: p.price,
      image: primaryImg || "",
      quantity: 1,
      stock: p.stock,
    });
    toast.success(`${p.name} added to cart!`);
  };

  const toggleWishlist = (p: any) => {
    const primaryImg = p.images?.find((img: any) => img.isPrimary)?.url || p.images?.[0]?.url;
    if (hasItem(p.id)) {
      removeWish(p.id);
      toast("Removed from wishlist");
    } else {
      addWish({
        id: `wish-${p.id}`,
        productId: p.id,
        name: p.name,
        price: p.price,
        comparePrice: p.comparePrice,
        image: primaryImg || "",
        slug: p.slug,
      });
      toast.success("Added to wishlist!");
    }
  };

  return (
    <section className={`${SPACING[spacing as keyof typeof SPACING] ?? SPACING.M} bg-white`}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4"
        >
          <div>
            <span className="text-puratva-green text-sm font-semibold tracking-widest uppercase">
              Products
            </span>
            <h2 className="font-display text-4xl font-bold mt-1">{title}</h2>
            <p className="text-muted-foreground mt-2 max-w-lg">{subtitle}</p>
          </div>
          <Link
            href="/shop"
            className="shrink-0 border border-puratva-green text-puratva-green px-6 py-2 rounded-full font-medium hover:bg-puratva-green hover:text-white transition-all"
          >
            View All →
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {data.map((p, i) => {
            const primaryImg = p.images?.find((img: any) => img.isPrimary)?.url || p.images?.[0]?.url;
            const avgRating = p.reviews?.length
              ? p.reviews.reduce((s: number, r: any) => s + r.rating, 0) / p.reviews.length
              : 5;
            const discount = calculateDiscount(p.price, p.comparePrice);
            const isWished = hasItem(p.id);

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group"
              >
                <div className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <Image
                      src={primaryImg || "/images/placeholder.jpg"}
                      alt={p.name}
                      fill
                      className={`object-cover group-hover:scale-105 transition-transform duration-500 ${p.status === "out_of_stock" || p.status === "coming_soon" ? "opacity-70" : ""}`}
                    />
                    {/* Status overlay */}
                    {p.status === "out_of_stock" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
                      </div>
                    )}
                    {p.status === "coming_soon" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">Coming Soon</span>
                      </div>
                    )}
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {discount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          -{discount}%
                        </span>
                      )}
                      {p.isBestSeller && (
                        <span className="bg-puratva-gold text-puratva-green-dark text-xs font-bold px-2 py-0.5 rounded-full">
                          Best Seller
                        </span>
                      )}
                      {p.isNewArrival && (
                        <span className="bg-puratva-green text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          New
                        </span>
                      )}
                    </div>

                    {p.isOrganic && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-white/90 text-puratva-green text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Leaf className="w-3 h-3" /> Organic
                        </span>
                      </div>
                    )}

                    {/* Wishlist */}
                    <button
                      onClick={() => toggleWishlist(p)}
                      className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    >
                      <Heart className={`w-4 h-4 ${isWished ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="text-xs text-puratva-green font-medium mb-1">
                      {p.category?.name || "Organic"}
                    </div>
                    <Link href={`/product/${p.slug}`}>
                      <h3 className="font-medium text-sm leading-snug hover:text-puratva-green transition-colors line-clamp-2">
                        {p.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-1 mt-1.5">
                      <Star className="w-3.5 h-3.5 fill-puratva-gold text-puratva-gold" />
                      <span className="text-xs font-medium">{avgRating.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">({p.reviews?.length})</span>
                    </div>

                    <div className="text-xs text-muted-foreground mt-0.5">{p.unit}</div>

                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <span className="font-bold text-puratva-green-dark">{formatPrice(p.price)}</span>
                        {p.comparePrice && p.comparePrice > p.price && (
                          <span className="text-xs text-muted-foreground line-through ml-1.5">
                            {formatPrice(p.comparePrice)}
                          </span>
                        )}
                      </div>
                      {p.status === "coming_soon" ? (
                        <span className="text-xs px-3 py-1.5 bg-yellow-100 text-yellow-700 font-semibold rounded-lg">Coming Soon</span>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(p)}
                          disabled={p.status === "out_of_stock" || p.stock === 0}
                          className="flex items-center gap-1 bg-puratva-green text-white text-xs px-3 py-1.5 rounded-lg hover:bg-puratva-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          {p.status === "out_of_stock" || p.stock === 0 ? "Sold Out" : "Add"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
