import { prisma } from "./prisma";
import { unstable_cache } from "next/cache";

export type SiteConfig = {
  // Brand
  storeName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  logoSize: string; // px size for logo image e.g. "40"
  navTagline: string; // shown under store name in navbar
  footerDescription: string;
  // Colors (hex)
  colorPrimary: string;
  colorDark: string;
  colorAccent: string;
  colorBg: string;
  // Typography
  fontHeading: string;
  fontBody: string;
  // Contact
  phone: string;
  email: string;
  address: string;
  hours: string;
  // Social
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  // Top announcement bar
  topBarEnabled: string; // "true" | "false"
  topBarLeft: string;
  topBarBadge: string;
  topBarAnimation: string; // "none" | "marquee" | "pulse"
  // Home page
  heroTagline: string;
  freeShippingThreshold: string;
  newsletterHeading: string;
  newsletterSubtext: string;
  // Why Puratva section
  whyLabel: string;
  whyTitle: string;
  whySubtext: string;
  whyCardAlignment: string; // "left" | "center" | "right"
  feat1Title: string; feat1Desc: string; feat1Icon: string;
  feat2Title: string; feat2Desc: string; feat2Icon: string;
  feat3Title: string; feat3Desc: string; feat3Icon: string;
  feat4Title: string; feat4Desc: string; feat4Icon: string;
  feat5Title: string; feat5Desc: string; feat5Icon: string;
  feat6Title: string; feat6Desc: string; feat6Icon: string;
  stat1Value: string; stat1Label: string;
  stat2Value: string; stat2Label: string;
  stat3Value: string; stat3Label: string;
  stat4Value: string; stat4Label: string;
  // Testimonials section
  testimonialsLabel: string;
  testimonialsTitle: string;
  testimonialsSubtext: string;
  testimonialsPerView: string; // "1" | "2" | "3" | "4"
  // About page
  aboutHeroTitle: string;
  aboutHeroText: string;
  aboutStory: string;
  aboutMission: string;
  // Home page structure (JSON: [{id:string, enabled:boolean}][])
  homePageSections: string;
  // Commerce
  currency: string;
  taxRate: string;
  // Navigation links (JSON: [{id,label,href,enabled}][])
  navLinks: string;
};

export const defaultConfig: SiteConfig = {
  storeName: "Puratva",
  tagline: "Pure. Natural. Authentic.",
  logoUrl: "",
  faviconUrl: "",
  logoSize: "40",
  navTagline: "Pure. Natural. Authentic.",
  footerDescription: "Bringing you 100% natural, farm-fresh organic products. From our farms to your table — pure, traditional, authentic.",
  colorPrimary: "#2d6a4f",
  colorDark: "#1b4332",
  colorAccent: "#d4a017",
  colorBg: "#fefae0",
  fontHeading: "Playfair Display",
  fontBody: "Inter",
  phone: "+91 98765 43210",
  email: "hello@puratva.com",
  address: "123 Organic Farm Road, Green Valley, Mumbai 400001",
  hours: "Mon–Sat: 9am – 6pm IST",
  facebook: "#",
  instagram: "#",
  twitter: "#",
  youtube: "#",
  topBarEnabled: "true",
  topBarLeft: "Free shipping on orders above ₹499",
  topBarBadge: "100% Organic Certified",
  topBarAnimation: "none",
  heroTagline: "Pure. Natural. Authentic.",
  freeShippingThreshold: "499",
  newsletterHeading: "Join the Puratva Family",
  newsletterSubtext: "Get exclusive offers, healthy recipes, and farm stories straight to your inbox. Unsubscribe anytime.",
  whyLabel: "Why Choose Us",
  whyTitle: "The Puratva Promise",
  whySubtext: "We believe food should nourish, not harm. Every product we make is a testament to our commitment to purity, quality, and tradition.",
  whyCardAlignment: "left",
  feat1Title: "100% Natural", feat1Desc: "No artificial colours, flavours, or preservatives. Just pure, honest ingredients from nature.", feat1Icon: "Leaf",
  feat2Title: "Farm Fresh", feat2Desc: "Sourced directly from certified organic farms across India. Fresh from harvest to your door.", feat2Icon: "Sprout",
  feat3Title: "No Chemicals", feat3Desc: "Zero pesticides, zero synthetic additives. Safe for your entire family, including children.", feat3Icon: "ShieldCheck",
  feat4Title: "Traditional Processing", feat4Desc: "Ancient methods like cold-pressing and bilona churning preserve all natural nutrients.", feat4Icon: "Award",
  feat5Title: "Direct From Farmers", feat5Desc: "We partner directly with 200+ farmers, ensuring fair prices and complete supply-chain transparency.", feat5Icon: "Users",
  feat6Title: "Fast Delivery", feat6Desc: "PAN-India delivery with temperature-controlled packaging to maintain freshness.", feat6Icon: "Truck",
  stat1Value: "10K+", stat1Label: "Happy Customers",
  stat2Value: "200+", stat2Label: "Partner Farmers",
  stat3Value: "50+", stat3Label: "Products",
  stat4Value: "4.9★", stat4Label: "Average Rating",
  testimonialsLabel: "Testimonials",
  testimonialsTitle: "What Our Customers Say",
  testimonialsSubtext: "Real stories from real people who made the switch to pure, organic living.",
  testimonialsPerView: "1",
  aboutHeroTitle: "About Puratva",
  aboutHeroText:
    'Puratva means "purity" — and that\'s exactly what we promise. Born from a love for traditional Indian flavours and a commitment to healthy living, we bring you the finest organic products straight from the farm.',
  aboutStory:
    "Puratva was founded with a simple idea: what if everyone could access the same pure, natural foods our grandparents grew up with? We saw a gap between modern consumers and the authentic, chemical-free produce that once filled every Indian kitchen.",
  aboutMission:
    "Today we partner with over 50 small farms across India, bringing you cold-pressed oils, traditional ghee, hand-picked pickles, stone-ground pulses, and dairy products made with love and time-tested recipes.",
  homePageSections: JSON.stringify([
    { id: "hero",         enabled: true,  size: "M" },
    { id: "categories",   enabled: true,  size: "M" },
    { id: "bestSellers",  enabled: true,  size: "M" },
    { id: "whyUs",        enabled: true,  size: "M" },
    { id: "newArrivals",  enabled: true,  size: "M" },
    { id: "testimonials", enabled: true,  size: "M" },
    { id: "newsletter",   enabled: true,  size: "M" },
  ]),
  currency: "INR",
  taxRate: "18",
  navLinks: JSON.stringify([
    { id: "home",    label: "Home",    href: "/",        enabled: true },
    { id: "shop",    label: "Shop",    href: "/shop",    enabled: true },
    { id: "about",   label: "About",   href: "/about",   enabled: true },
    { id: "blog",    label: "Blog",    href: "/blog",    enabled: true },
    { id: "contact", label: "Contact", href: "/contact", enabled: true },
  ]),
};

async function _getSiteConfig(): Promise<SiteConfig> {
  try {
    const rows = await prisma.siteSettings.findMany();
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return { ...defaultConfig, ...map } as SiteConfig;
  } catch {
    return defaultConfig;
  }
}

export const getSiteConfig = unstable_cache(_getSiteConfig, ["site-config"], {
  revalidate: 60,
  tags: ["site-config"],
});
