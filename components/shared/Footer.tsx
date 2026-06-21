import Link from "next/link";
import Image from "next/image";
import { Leaf, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import type { SiteConfig } from "@/lib/site-config";

type Category = { name: string; slug: string; icon: string };

const FALLBACK_CATEGORIES: Category[] = [
  { name: "🫒 Oils",         slug: "oils",          icon: "" },
  { name: "🧈 Ghee",         slug: "ghee",          icon: "" },
  { name: "🥭 Pickles",      slug: "pickles",       icon: "" },
  { name: "🍲 Premixes",     slug: "premixes",      icon: "" },
  { name: "🌾 Pulses",       slug: "pulses",        icon: "" },
  { name: "🥛 Dairy Products",slug: "dairy-products",icon: "" },
];

export default function Footer({ config, categories: propCategories }: { config: SiteConfig; categories?: Category[] }) {
  const footerCategories = propCategories && propCategories.length > 0
    ? propCategories
    : FALLBACK_CATEGORIES;
  return (
    <footer className="bg-puratva-green-dark text-puratva-cream">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {config.logoUrl ? (
                <Image
                  src={config.logoUrl}
                  alt={config.storeName}
                  width={Number(config.logoSize) || 40}
                  height={Number(config.logoSize) || 40}
                  style={{ width: `${config.logoSize || 40}px`, height: `${config.logoSize || 40}px` }}
                  className="object-contain"
                />
              ) : (
                <div className="w-10 h-10 bg-puratva-gold rounded-full flex items-center justify-center shrink-0">
                  <Leaf className="w-5 h-5 text-puratva-green-dark" />
                </div>
              )}
              <span className="font-display text-2xl font-bold">{config.storeName}</span>
            </div>
            <p className="text-sm text-puratva-cream/80 leading-relaxed">
              {config.footerDescription}
            </p>
            <div className="flex gap-3">
              {config.facebook && config.facebook !== "#" && (
                <a href={config.facebook} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-puratva-cream/10 hover:bg-puratva-gold/80 rounded-full flex items-center justify-center transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {config.instagram && config.instagram !== "#" && (
                <a href={config.instagram} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-puratva-cream/10 hover:bg-puratva-gold/80 rounded-full flex items-center justify-center transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {config.twitter && config.twitter !== "#" && (
                <a href={config.twitter} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-puratva-cream/10 hover:bg-puratva-gold/80 rounded-full flex items-center justify-center transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {config.youtube && config.youtube !== "#" && (
                <a href={config.youtube} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-puratva-cream/10 hover:bg-puratva-gold/80 rounded-full flex items-center justify-center transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {/* Show all icons as placeholders if all are "#" */}
              {[config.facebook, config.instagram, config.twitter, config.youtube].every(s => !s || s === "#") &&
                [Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                  <a key={i} href="#"
                    className="w-9 h-9 bg-puratva-cream/10 hover:bg-puratva-gold/80 rounded-full flex items-center justify-center transition-colors">
                    <Icon className="w-4 h-4" />
                  </a>
                ))
              }
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-puratva-cream/80">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Shop", href: "/shop" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" },
                { label: "Track Order", href: "/orders" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-puratva-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-puratva-cream/80">
              {footerCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/shop/${cat.slug}`} className="hover:text-puratva-gold transition-colors">
                    {cat.icon ? `${cat.icon} ${cat.name}` : cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Get In Touch</h4>
            <ul className="space-y-3 text-sm text-puratva-cream/80">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-puratva-gold" />
                <span>{config.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-puratva-gold" />
                <a href={`tel:${config.phone}`} className="hover:text-puratva-gold">{config.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-puratva-gold" />
                <a href={`mailto:${config.email}`} className="hover:text-puratva-gold">{config.email}</a>
              </li>
            </ul>

            <div className="mt-4">
              <p className="text-xs mb-2 text-puratva-cream/70">Subscribe for offers & updates</p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-puratva-cream/10 border border-puratva-cream/20 rounded-lg px-3 py-2 text-sm text-puratva-cream placeholder:text-puratva-cream/40 focus:outline-none focus:border-puratva-gold"
                />
                <button
                  type="submit"
                  className="bg-puratva-gold text-puratva-green-dark px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Go
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-puratva-cream/10">
        <div className="container py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-puratva-cream/60">
          <span>© {new Date().getFullYear()} {config.storeName}. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-puratva-gold">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-puratva-gold">Terms of Service</Link>
            <Link href="/refund" className="hover:text-puratva-gold">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
