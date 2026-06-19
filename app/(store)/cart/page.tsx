"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, Leaf } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCartStore();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = totalPrice();
  const shipping = subtotal >= 499 ? 0 : 49;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal - discount + shipping + tax;

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    setCouponLoading(true);
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: coupon, orderAmount: subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setDiscount(data.discount);
        toast.success(`Coupon applied! You save ${formatPrice(data.discount)}`);
      } else {
        toast.error(data.error || "Invalid coupon");
      }
    } catch {
      toast.error("Could not apply coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <ShoppingBag className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">Add some organic goodness to your cart!</p>
        <Link href="/shop" className="bg-puratva-green text-white px-8 py-3 rounded-full font-semibold hover:bg-puratva-green-dark transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold mb-8">Shopping Cart ({items.length} items)</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <motion.div
              key={`${item.productId}-${item.variantId}`}
              layout
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl p-4 border border-border flex gap-4"
            >
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-muted shrink-0">
                <Image src={item.image || "/images/placeholder.jpg"} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <div>
                    <h3 className="font-medium line-clamp-2">{item.name}</h3>
                    {item.variant && <p className="text-sm text-muted-foreground">{item.variant}</p>}
                  </div>
                  <button onClick={() => removeItem(item.productId, item.variantId)} className="text-red-400 hover:text-red-600 shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)} className="px-3 py-2 hover:bg-muted">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 py-2 font-medium text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)} className="px-3 py-2 hover:bg-muted">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-bold text-puratva-green-dark">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            </motion.div>
          ))}

          <div className="flex justify-between items-center">
            <Link href="/shop" className="text-puratva-green hover:underline text-sm font-medium">
              ← Continue Shopping
            </Link>
            <button onClick={clearCart} className="text-red-500 hover:underline text-sm font-medium">
              Clear Cart
            </button>
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-2xl border border-border p-6 sticky top-20">
            <h2 className="font-display text-lg font-bold mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shipping)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">GST (5%)</span><span>{formatPrice(tax)}</span></div>
              {shipping === 0 && (
                <div className="flex items-center gap-1 text-green-600 text-xs bg-green-50 px-3 py-2 rounded-lg">
                  <Leaf className="w-3 h-3" /> Free delivery applied!
                </div>
              )}
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground bg-muted px-3 py-2 rounded-lg">
                  Add {formatPrice(499 - subtotal)} more to get FREE delivery!
                </p>
              )}
            </div>

            <div className="border-t my-4" />

            <div className="flex justify-between font-bold text-lg mb-5">
              <span>Total</span>
              <span className="text-puratva-green-dark">{formatPrice(total)}</span>
            </div>

            {/* Coupon */}
            <div className="mb-5">
              <p className="text-sm font-medium mb-2">Coupon Code</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green/30 uppercase"
                />
                <button
                  onClick={applyCoupon}
                  disabled={couponLoading}
                  className="bg-puratva-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-puratva-green-dark disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
            </div>

            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full bg-puratva-green text-white font-bold py-3 rounded-xl hover:bg-puratva-green-dark transition-colors"
            >
              Checkout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
