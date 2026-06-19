"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Search,
  Menu,
  X,
  User,
  ChevronDown,
  Phone,
  Leaf,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { cn } from "@/lib/utils";

const categories = [
  { name: "Oils", slug: "oils", icon: "🫒" },
  { name: "Ghee", slug: "ghee", icon: "🧈" },
  { name: "Pickles", slug: "pickles", icon: "🥭" },
  { name: "Premixes", slug: "premixes", icon: "🍲" },
  { name: "Pulses", slug: "pulses", icon: "🌾" },
  { name: "Dairy", slug: "dairy-products", icon: "🥛" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const { data: session } = useSession();
  const totalItems = useCartStore((s) => s.totalItems());
  const wishlistItems = useWishlistStore((s) => s.items.length);
  const toggleCart = useCartStore((s) => s.toggleCart);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      {/* Top bar */}
      <div className="bg-puratva-green text-puratva-cream text-xs py-2 hidden md:block">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" /> +91 98765 43210
            </span>
            <span>Free shipping on orders above ₹499</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Leaf className="w-3 h-3" /> 100% Organic Certified
            </span>
            {session?.user?.role === "ADMIN" && (
              <Link href="/admin" className="hover:underline">
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md"
            : "bg-puratva-cream"
        )}
      >
        <div className="container flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-puratva-green rounded-full flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-2xl font-bold text-puratva-green-dark">
              Puratva
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-puratva-green transition-colors">
              Home
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setIsShopOpen(true)}
              onMouseLeave={() => setIsShopOpen(false)}
            >
              <button className="flex items-center gap-1 hover:text-puratva-green transition-colors">
                Shop <ChevronDown className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {isShopOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-xl shadow-xl border border-border p-3 grid grid-cols-2 gap-1"
                  >
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/shop/${cat.slug}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-puratva-cream text-sm transition-colors"
                      >
                        <span className="text-lg">{cat.icon}</span>
                        {cat.name}
                      </Link>
                    ))}
                    <Link
                      href="/shop"
                      className="col-span-2 text-center text-puratva-green font-medium px-3 py-2 rounded-lg hover:bg-puratva-cream text-sm border border-puratva-green/20 mt-1"
                    >
                      View All Products →
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/about" className="hover:text-puratva-green transition-colors">
              About
            </Link>
            <Link href="/blog" className="hover:text-puratva-green transition-colors">
              Blog
            </Link>
            <Link href="/contact" className="hover:text-puratva-green transition-colors">
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link href="/search" className="p-2 hover:text-puratva-green transition-colors hidden md:flex">
              <Search className="w-5 h-5" />
            </Link>

            <Link href="/wishlist" className="p-2 hover:text-puratva-green transition-colors relative hidden md:flex">
              <Heart className="w-5 h-5" />
              {wishlistItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistItems}
                </span>
              )}
            </Link>

            <button
              onClick={toggleCart}
              className="p-2 hover:text-puratva-green transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-puratva-green text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {session ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setIsUserOpen(!isUserOpen)}
                  className="flex items-center gap-2 p-2 hover:text-puratva-green transition-colors"
                >
                  <User className="w-5 h-5" />
                  <ChevronDown className="w-3 h-3" />
                </button>
                <AnimatePresence>
                  {isUserOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-border py-2"
                    >
                      <div className="px-4 py-2 text-sm font-medium border-b">{session.user?.name}</div>
                      <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-muted">My Orders</Link>
                      <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-muted">Profile</Link>
                      {session.user?.role === "ADMIN" && (
                        <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-muted text-puratva-green font-medium">Admin Panel</Link>
                      )}
                      <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-sm hover:bg-muted text-red-600">Sign Out</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="hidden md:flex items-center gap-1 bg-puratva-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-puratva-green-dark transition-colors"
              >
                Sign In
              </Link>
            )}

            <button
              className="lg:hidden p-2"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-white border-t overflow-hidden"
            >
              <div className="container py-4 flex flex-col gap-3">
                <Link href="/" className="py-2 font-medium" onClick={() => setIsMobileOpen(false)}>Home</Link>
                <div className="py-2 font-medium">Shop</div>
                <div className="pl-4 grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/shop/${cat.slug}`}
                      className="flex items-center gap-2 py-1 text-sm"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {cat.icon} {cat.name}
                    </Link>
                  ))}
                </div>
                <Link href="/about" className="py-2 font-medium" onClick={() => setIsMobileOpen(false)}>About</Link>
                <Link href="/blog" className="py-2 font-medium" onClick={() => setIsMobileOpen(false)}>Blog</Link>
                <Link href="/contact" className="py-2 font-medium" onClick={() => setIsMobileOpen(false)}>Contact</Link>
                {!session && (
                  <Link href="/auth/login" className="bg-puratva-green text-white px-4 py-2 rounded-lg text-center font-medium" onClick={() => setIsMobileOpen(false)}>
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
