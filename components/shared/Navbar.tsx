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
import NextImage from "next/image";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { cn } from "@/lib/utils";

type Category = { name: string; slug: string; icon: string };
type NavLink  = { id: string; label: string; href: string; enabled: boolean };

const DEFAULT_NAV_LINKS: NavLink[] = [
  { id: "home",    label: "Home",    href: "/",        enabled: true },
  { id: "shop",    label: "Shop",    href: "/shop",    enabled: true },
  { id: "about",   label: "About",   href: "/about",   enabled: true },
  { id: "blog",    label: "Blog",    href: "/blog",    enabled: true },
  { id: "contact", label: "Contact", href: "/contact", enabled: true },
];

const FALLBACK_CATEGORIES: Category[] = [
  { name: "Oils",          slug: "oils",          icon: "🫒" },
  { name: "Ghee",          slug: "ghee",          icon: "🧈" },
  { name: "Pickles",       slug: "pickles",       icon: "🥭" },
  { name: "Premixes",      slug: "premixes",      icon: "🍲" },
  { name: "Pulses",        slug: "pulses",        icon: "🌾" },
  { name: "Dairy",         slug: "dairy-products",icon: "🥛" },
];

function parseNavLinks(raw?: string): NavLink[] {
  if (!raw) return DEFAULT_NAV_LINKS;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {}
  return DEFAULT_NAV_LINKS;
}

export default function Navbar({
  storeName = "Puratva",
  tagline = "",
  logoUrl = "",
  logoSize = "40",
  phone = "+91 98765 43210",
  topBarEnabled = "true",
  topBarLeft = "Free shipping on orders above ₹499",
  topBarBadge = "100% Organic Certified",
  topBarAnimation = "none",
  navLinks: navLinksRaw,
  categories: propCategories,
}: {
  storeName?: string;
  tagline?: string;
  logoUrl?: string;
  logoSize?: string;
  phone?: string;
  topBarEnabled?: string;
  topBarLeft?: string;
  topBarBadge?: string;
  topBarAnimation?: string;
  navLinks?: string;
  categories?: Category[];
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const totalItems = useCartStore((s) => s.totalItems());
  const wishlistItems = useWishlistStore((s) => s.items.length);
  const toggleCart = useCartStore((s) => s.toggleCart);

  useEffect(() => {
    setMounted(true);
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const showTopBar = topBarEnabled !== "false";
  const navLinks = parseNavLinks(navLinksRaw);
  const categories = (propCategories && propCategories.length > 0) ? propCategories : FALLBACK_CATEGORIES;

  const isShopEnabled = navLinks.find((l) => l.id === "shop")?.enabled !== false;

  return (
    <>
      {/* Top bar */}
      {showTopBar && (
        <div className="bg-puratva-green text-puratva-cream text-xs py-2 hidden md:block overflow-hidden">
          <div className="container flex justify-between items-center gap-4">
            <div className={`flex items-center gap-4 ${topBarAnimation === "marquee" ? "flex-1 overflow-hidden" : ""}`}>
              {topBarAnimation === "marquee" ? (
                <div className="flex items-center gap-8 animate-[marquee_18s_linear_infinite] whitespace-nowrap">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {phone}</span>
                  <span>{topBarLeft}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {phone}</span>
                  <span>{topBarLeft}</span>
                </div>
              ) : (
                <>
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {phone}</span>
                  <span>{topBarLeft}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className={`flex items-center gap-1 ${topBarAnimation === "pulse" ? "animate-pulse" : ""}`}>
                <Leaf className="w-3 h-3" /> {topBarBadge}
              </span>
              {session?.user?.role === "ADMIN" && (
                <Link href="/admin" className="hover:underline">Admin Panel</Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main nav */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-puratva-cream"
        )}
      >
        <div className="container flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            {logoUrl ? (
              <NextImage
                src={logoUrl}
                alt={storeName}
                width={Number(logoSize) || 40}
                height={Number(logoSize) || 40}
                style={{ width: `${logoSize || 40}px`, height: `${logoSize || 40}px` }}
                className="w-auto object-contain"
              />
            ) : (
              <div
                className="bg-puratva-green rounded-full flex items-center justify-center shrink-0"
                style={{ width: `${logoSize || 40}px`, height: `${logoSize || 40}px` }}
              >
                <Leaf className="w-1/2 h-1/2 text-white" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-display text-xl sm:text-2xl font-bold text-puratva-green-dark leading-tight">
                {storeName}
              </span>
              {tagline && (
                <span className="text-xs text-muted-foreground leading-tight hidden sm:block">
                  {tagline}
                </span>
              )}
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navLinks.filter((l) => l.enabled).map((link) =>
              link.id === "shop" ? (
                <div
                  key="shop"
                  className="relative"
                  onMouseEnter={() => setIsShopOpen(true)}
                  onMouseLeave={() => setIsShopOpen(false)}
                >
                  <button className="flex items-center gap-1 hover:text-puratva-green transition-colors">
                    {link.label} <ChevronDown className="w-4 h-4" />
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
              ) : (
                <Link key={link.id} href={link.href} className="hover:text-puratva-green transition-colors">
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/search" className="p-2 hover:text-puratva-green transition-colors hidden md:flex">
              <Search className="w-5 h-5" />
            </Link>

            <Link href="/wishlist" className="p-2 hover:text-puratva-green transition-colors relative hidden md:flex">
              <Heart className="w-5 h-5" />
              {mounted && wishlistItems > 0 && (
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
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-puratva-green text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {session ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setIsUserOpen(!isUserOpen)}
                  className="flex items-center gap-1.5 p-2 hover:text-puratva-green transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium max-w-[80px] truncate hidden lg:block">
                    {session.user?.name?.split(" ")[0]}
                  </span>
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
                className="hidden md:flex items-center gap-1 bg-puratva-green text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-puratva-green-dark transition-colors"
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
              <div className="container py-4 flex flex-col gap-1">

                {/* User info on mobile */}
                {session && (
                  <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-puratva-cream/60 rounded-xl">
                    <div className="w-9 h-9 bg-puratva-green rounded-full flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{session.user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                    </div>
                  </div>
                )}

                {/* Nav links */}
                {navLinks.filter((l) => l.enabled).map((link) =>
                  link.id === "shop" ? (
                    <div key="shop">
                      <div className="flex items-center gap-2 px-3 py-2.5 font-semibold text-sm rounded-xl hover:bg-muted/50 transition-colors">
                        <span>{link.label}</span>
                      </div>
                      <div className="pl-3 grid grid-cols-2 gap-1 mt-1 mb-1">
                        {categories.map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/shop/${cat.slug}`}
                            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted/50 transition-colors"
                            onClick={() => setIsMobileOpen(false)}
                          >
                            <span className="text-base shrink-0">{cat.icon}</span>
                            <span className="truncate">{cat.name}</span>
                          </Link>
                        ))}
                        <Link
                          href="/shop"
                          className="col-span-2 text-center text-puratva-green text-sm font-medium px-3 py-2 rounded-lg border border-puratva-green/20 hover:bg-puratva-cream/50 transition-colors mt-1"
                          onClick={() => setIsMobileOpen(false)}
                        >
                          View All Products →
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={link.id}
                      href={link.href}
                      className="px-3 py-2.5 font-semibold text-sm rounded-xl hover:bg-muted/50 transition-colors"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )
                )}

                <div className="border-t my-2" />

                {/* Search & Wishlist on mobile */}
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/search" className="flex items-center justify-center gap-2 px-3 py-2.5 border rounded-xl text-sm font-medium hover:bg-muted/50 transition-colors" onClick={() => setIsMobileOpen(false)}>
                    <Search className="w-4 h-4" /> Search
                  </Link>
                  <Link href="/wishlist" className="flex items-center justify-center gap-2 px-3 py-2.5 border rounded-xl text-sm font-medium hover:bg-muted/50 transition-colors relative" onClick={() => setIsMobileOpen(false)}>
                    <Heart className="w-4 h-4" /> Wishlist
                    {mounted && wishlistItems > 0 && (
                      <span className="absolute top-1.5 right-10 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{wishlistItems}</span>
                    )}
                  </Link>
                </div>

                {session ? (
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Link href="/orders" className="flex items-center justify-center px-3 py-2.5 border rounded-xl text-sm font-medium hover:bg-muted/50 transition-colors" onClick={() => setIsMobileOpen(false)}>
                      My Orders
                    </Link>
                    <Link href="/profile" className="flex items-center justify-center px-3 py-2.5 border rounded-xl text-sm font-medium hover:bg-muted/50 transition-colors" onClick={() => setIsMobileOpen(false)}>
                      Profile
                    </Link>
                    {session.user?.role === "ADMIN" && (
                      <Link href="/admin" className="col-span-2 flex items-center justify-center px-3 py-2.5 bg-puratva-green/10 text-puratva-green border border-puratva-green/20 rounded-xl text-sm font-medium hover:bg-puratva-green/20 transition-colors" onClick={() => setIsMobileOpen(false)}>
                        Admin Panel
                      </Link>
                    )}
                    <button onClick={() => { signOut(); setIsMobileOpen(false); }} className="col-span-2 flex items-center justify-center px-3 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors">
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link href="/auth/login" className="mt-1 flex items-center justify-center gap-2 bg-puratva-green text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-puratva-green-dark transition-colors" onClick={() => setIsMobileOpen(false)}>
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
