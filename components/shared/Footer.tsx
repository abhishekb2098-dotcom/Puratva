import Link from "next/link";
import { Leaf, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-puratva-green-dark text-puratva-cream">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-puratva-gold rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-puratva-green-dark" />
              </div>
              <span className="font-display text-2xl font-bold">Puratva</span>
            </div>
            <p className="text-sm text-puratva-cream/80 leading-relaxed">
              Bringing you 100% natural, farm-fresh organic products. From our
              farms to your table — pure, traditional, authentic.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-puratva-cream/10 hover:bg-puratva-gold/80 rounded-full flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
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
              {[
                { label: "🫒 Oils", href: "/shop/oils" },
                { label: "🧈 Ghee", href: "/shop/ghee" },
                { label: "🥭 Pickles", href: "/shop/pickles" },
                { label: "🍲 Premixes", href: "/shop/premixes" },
                { label: "🌾 Pulses", href: "/shop/pulses" },
                { label: "🥛 Dairy Products", href: "/shop/dairy-products" },
              ].map((cat) => (
                <li key={cat.href}>
                  <Link href={cat.href} className="hover:text-puratva-gold transition-colors">
                    {cat.label}
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
                <span>123 Organic Farm Road, Green Valley, Mumbai 400001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-puratva-gold" />
                <a href="tel:+919876543210" className="hover:text-puratva-gold">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-puratva-gold" />
                <a href="mailto:hello@puratva.com" className="hover:text-puratva-gold">hello@puratva.com</a>
              </li>
            </ul>

            {/* Newsletter mini */}
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
                  className="bg-puratva-gold text-puratva-green-dark px-4 py-2 rounded-lg text-sm font-medium hover:bg-puratva-gold-light transition-colors"
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
          <span>© 2024 Puratva. All rights reserved.</span>
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
