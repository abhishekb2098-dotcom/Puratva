"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingCart, Heart, Star, Leaf, Truck, ShieldCheck,
  RotateCcw, Plus, Minus, Share2, ChevronDown
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import toast from "react-hot-toast";
import type { ProductWithRelations } from "@/types";

type Props = { product: ProductWithRelations & { tags: any[]; reviews: any[] } };

export default function ProductDetail({ product }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    product.variants[0]?.id || null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "reviews" | "shipping">("desc");

  const addItem = useCartStore((s) => s.addItem);
  const { addItem: addWish, removeItem: removeWish, hasItem } = useWishlistStore();
  const isWished = hasItem(product.id);

  const variant = product.variants.find((v) => v.id === selectedVariant);
  const price = variant?.price ?? product.price;
  const discount = calculateDiscount(price, product.comparePrice || 0);
  const avgRating = product.reviews.length
    ? product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / product.reviews.length
    : 5;

  const handleAddToCart = () => {
    const img = product.images[selectedImage]?.url || product.images[0]?.url || "";
    addItem({
      id: `cart-${product.id}-${selectedVariant}`,
      productId: product.id,
      variantId: selectedVariant || undefined,
      name: product.name,
      price,
      image: img,
      quantity,
      variant: variant?.name,
      stock: variant?.stock ?? product.stock,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = "/checkout";
  };

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6 flex gap-2">
        <Link href="/" className="hover:text-puratva-green">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-puratva-green">Shop</Link>
        <span>/</span>
        <Link href={`/shop/${product.category.slug}`} className="hover:text-puratva-green">{product.category.name}</Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
            <Image
              src={product.images[selectedImage]?.url || "/images/placeholder.jpg"}
              alt={product.images[selectedImage]?.alt || product.name}
              fill
              className="object-cover"
              priority
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full">
                -{discount}% OFF
              </span>
            )}
            {product.isOrganic && (
              <span className="absolute top-4 right-4 bg-white/90 text-puratva-green text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5" /> Organic
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-colors ${i === selectedImage ? "border-puratva-green" : "border-transparent"}`}
                >
                  <Image src={img.url} alt={img.alt || ""} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <Link href={`/shop/${product.category.slug}`} className="text-sm text-puratva-green font-medium hover:underline">
              {product.category.name}
            </Link>
            <h1 className="font-display text-3xl font-bold mt-1">{product.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(avgRating) ? "fill-puratva-gold text-puratva-gold" : "text-muted"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {avgRating.toFixed(1)} ({product.reviews.length} reviews)
              </span>
            </div>
          </div>

          {(product as any).status === "coming_soon" ? (
            <div className="flex items-center gap-3">
              <span className="bg-yellow-100 text-yellow-800 font-bold text-lg px-4 py-2 rounded-xl">Coming Soon</span>
              <span className="text-sm text-muted-foreground">Price will be announced soon</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl font-bold text-puratva-green-dark">{formatPrice(price)}</span>
              {product.comparePrice && product.comparePrice > price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">{formatPrice(product.comparePrice)}</span>
                  <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded-full">-{discount}% OFF</span>
                </>
              )}
            </div>
          )}

          {product.shortDesc && (
            <p className="text-muted-foreground leading-relaxed">{product.shortDesc}</p>
          )}

          {/* Variants — hidden for coming soon */}
          {(product as any).status !== "coming_soon" && product.variants.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2">Choose Size / Variant</p>
              <div className="flex gap-2 flex-wrap">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v.id)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      selectedVariant === v.id
                        ? "border-puratva-green bg-puratva-green text-white"
                        : "border-border hover:border-puratva-green"
                    } ${v.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={v.stock === 0}
                  >
                    {v.name} {v.stock === 0 && "(Sold out)"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + CTA — hidden for coming soon */}
          {(product as any).status !== "coming_soon" ? (
            <>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-muted transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-4 py-3 hover:bg-muted transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-puratva-green text-puratva-green font-semibold py-3 rounded-xl hover:bg-puratva-cream transition-colors disabled:opacity-50"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 bg-puratva-green text-white font-semibold py-3 rounded-xl hover:bg-puratva-green-dark transition-colors disabled:opacity-50"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => {
                    if (isWished) { removeWish(product.id); toast("Removed from wishlist"); }
                    else { const img = product.images[0]?.url || ""; addWish({ id: `w-${product.id}`, productId: product.id, name: product.name, price, comparePrice: product.comparePrice || undefined, image: img, slug: product.slug }); toast.success("Added to wishlist!"); }
                  }}
                  className={`w-12 h-12 flex items-center justify-center border rounded-xl transition-colors ${isWished ? "bg-red-50 border-red-200" : "hover:bg-muted"}`}
                >
                  <Heart className={`w-5 h-5 ${isWished ? "fill-red-500 text-red-500" : ""}`} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-3">
              <button className="flex-1 bg-yellow-100 text-yellow-800 font-semibold py-3 rounded-xl cursor-default" disabled>
                Notify Me When Available
              </button>
              <button
                onClick={() => {
                  if (isWished) { removeWish(product.id); toast("Removed from wishlist"); }
                  else { const img = product.images[0]?.url || ""; addWish({ id: `w-${product.id}`, productId: product.id, name: product.name, price: 0, image: img, slug: product.slug }); toast.success("Added to wishlist!"); }
                }}
                className={`w-12 h-12 flex items-center justify-center border rounded-xl transition-colors ${isWished ? "bg-red-50 border-red-200" : "hover:bg-muted"}`}
              >
                <Heart className={`w-5 h-5 ${isWished ? "fill-red-500 text-red-500" : ""}`} />
              </button>
            </div>
          )}

          {/* Trust */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t">
            {[
              { icon: Truck, text: "Free Delivery above ₹499" },
              { icon: ShieldCheck, text: "100% Authentic & Safe" },
              { icon: RotateCcw, text: "Easy 7-Day Returns" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center text-center gap-1">
                <Icon className="w-5 h-5 text-puratva-green" />
                <span className="text-xs text-muted-foreground">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b flex gap-1">
        {(["desc", "reviews", "shipping"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
              activeTab === tab
                ? "border-puratva-green text-puratva-green"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "desc" ? "Description" : tab === "reviews" ? `Reviews (${product.reviews.length})` : "Shipping & Returns"}
          </button>
        ))}
      </div>

      <div className="py-8 max-w-3xl">
        {activeTab === "desc" && (
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6">
            {product.reviews.length === 0 ? (
              <p className="text-muted-foreground">No reviews yet. Be the first!</p>
            ) : (
              product.reviews.map((r: any) => (
                <div key={r.id} className="border-b pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 bg-puratva-green/10 text-puratva-green rounded-full flex items-center justify-center font-bold text-sm">
                      {r.user?.name?.[0] || "U"}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{r.user?.name || "Customer"}</div>
                      <div className="flex">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} className={`w-3 h-3 ${s <= r.rating ? "fill-puratva-gold text-puratva-gold" : "text-muted"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  {r.title && <p className="font-medium text-sm mb-1">{r.title}</p>}
                  <p className="text-sm text-muted-foreground">{r.content}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <div><strong className="text-foreground">Free Delivery:</strong> On all orders above ₹499. Orders below ₹499 have a flat shipping fee of ₹49.</div>
            <div><strong className="text-foreground">Delivery Time:</strong> 3-5 business days for most PIN codes. Metro cities: 1-2 days.</div>
            <div><strong className="text-foreground">Returns & Refunds:</strong> We offer a 7-day easy return policy. If you are not satisfied, contact us and we will arrange a pickup.</div>
            <div><strong className="text-foreground">Packaging:</strong> All perishable products are packed in temperature-controlled, eco-friendly packaging.</div>
          </div>
        )}
      </div>
    </div>
  );
}
