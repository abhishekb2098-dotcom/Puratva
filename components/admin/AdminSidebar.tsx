"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Tag, Image, MessageSquare,
  ShoppingBag, Users, BookOpen, Leaf, Settings, BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/categories", icon: Tag, label: "Categories" },
  { href: "/admin/banners", icon: Image, label: "Banners" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/admin/testimonials", icon: MessageSquare, label: "Testimonials" },
  { href: "/admin/customers", icon: Users, label: "Customers" },
  { href: "/admin/blogs", icon: BookOpen, label: "Blogs" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-puratva-green-dark text-white flex flex-col shrink-0">
      <div className="p-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-puratva-gold rounded-full flex items-center justify-center">
            <Leaf className="w-4 h-4 text-puratva-green-dark" />
          </div>
          <div>
            <div className="font-display font-bold text-lg leading-none">Puratva</div>
            <div className="text-xs text-white/60">Admin Panel</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link href="/" className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors">
          ← View Store
        </Link>
      </div>
    </aside>
  );
}
