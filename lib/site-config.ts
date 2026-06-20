import { prisma } from "./prisma";
import { unstable_cache } from "next/cache";

export type SiteConfig = {
  // Brand
  storeName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
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
  // Home page
  heroTagline: string;
  freeShippingThreshold: string;
  newsletterHeading: string;
  newsletterSubtext: string;
  // About page
  aboutHeroTitle: string;
  aboutHeroText: string;
  aboutStory: string;
  aboutMission: string;
  // Commerce
  currency: string;
  taxRate: string;
};

export const defaultConfig: SiteConfig = {
  storeName: "Puratva",
  tagline: "Pure. Natural. Authentic.",
  logoUrl: "",
  faviconUrl: "",
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
  heroTagline: "Pure. Natural. Authentic.",
  freeShippingThreshold: "499",
  newsletterHeading: "Join the Puratva Family",
  newsletterSubtext:
    "Get organic recipes, farm stories, and exclusive offers delivered to your inbox.",
  aboutHeroTitle: "About Puratva",
  aboutHeroText:
    'Puratva means "purity" — and that\'s exactly what we promise. Born from a love for traditional Indian flavours and a commitment to healthy living, we bring you the finest organic products straight from the farm.',
  aboutStory:
    "Puratva was founded with a simple idea: what if everyone could access the same pure, natural foods our grandparents grew up with? We saw a gap between modern consumers and the authentic, chemical-free produce that once filled every Indian kitchen.",
  aboutMission:
    "Today we partner with over 50 small farms across India, bringing you cold-pressed oils, traditional ghee, hand-picked pickles, stone-ground pulses, and dairy products made with love and time-tested recipes.",
  currency: "INR",
  taxRate: "18",
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
