"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, totalPrice } =
    useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={toggleCart}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-puratva-green" />
                My Cart ({items.length})
              </h2>
              <button onClick={toggleCart} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Your cart is empty</p>
                    <p className="text-sm text-muted-foreground">Add some organic goodness!</p>
                  </div>
                  <Link
                    href="/shop"
                    onClick={toggleCart}
                    className="bg-puratva-green text-white px-6 py-2 rounded-lg font-medium hover:bg-puratva-green-dark transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex gap-3 p-3 bg-muted/30 rounded-xl">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white border shrink-0">
                      <Image
                        src={item.image || "/images/placeholder.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                      {item.variant && (
                        <p className="text-xs text-muted-foreground">{item.variant}</p>
                      )}
                      <p className="text-puratva-green font-semibold mt-1">
                        {formatPrice(item.price)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                          className="w-7 h-7 border rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                          className="w-7 h-7 border rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="ml-auto p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-4 space-y-3 bg-white">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-puratva-green">{formatPrice(totalPrice())}</span>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Taxes and shipping calculated at checkout
                </p>
                <Link
                  href="/checkout"
                  onClick={toggleCart}
                  className="block w-full bg-puratva-green text-white py-3 rounded-xl text-center font-semibold hover:bg-puratva-green-dark transition-colors"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/cart"
                  onClick={toggleCart}
                  className="block w-full border border-puratva-green text-puratva-green py-3 rounded-xl text-center font-medium hover:bg-puratva-cream transition-colors"
                >
                  View Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
