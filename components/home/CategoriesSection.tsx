"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

type CategoryCard = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  _count?: { products: number };
};

type Props = {
  categories: CategoryCard[];
};

const categoryStyles: Record<string, { bg: string; border: string; fallbackImage: string; fallbackIcon: string }> = {
  oils: {
    bg: "from-yellow-50 to-amber-100",
    border: "border-amber-200",
    fallbackImage: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80",
    fallbackIcon: "Oil",
  },
  ghee: {
    bg: "from-orange-50 to-amber-100",
    border: "border-orange-200",
    fallbackImage: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80",
    fallbackIcon: "Ghee",
  },
  pickles: {
    bg: "from-red-50 to-orange-100",
    border: "border-red-200",
    fallbackImage: "https://images.unsplash.com/photo-1568158879083-c42860933ed7?w=400&q=80",
    fallbackIcon: "Jar",
  },
  premixes: {
    bg: "from-green-50 to-emerald-100",
    border: "border-green-200",
    fallbackImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
    fallbackIcon: "Mix",
  },
  pulses: {
    bg: "from-yellow-50 to-lime-100",
    border: "border-yellow-200",
    fallbackImage: "/images/categories/pulses.png",
    fallbackIcon: "Dal",
  },
  "dairy-products": {
    bg: "from-blue-50 to-sky-100",
    border: "border-blue-200",
    fallbackImage: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80",
    fallbackIcon: "Milk",
  },
};

const defaultStyle = {
  bg: "from-stone-50 to-emerald-100",
  border: "border-emerald-200",
  fallbackImage: "/images/placeholder.jpg",
  fallbackIcon: "Shop",
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const SPACING = { S: "py-8 md:py-10", M: "py-16 md:py-20", L: "py-20 md:py-28" };

export default function CategoriesSection({ categories, spacing = "M" }: Props & { spacing?: string }) {
  if (!categories.length) return null;

  return (
    <section className={`${SPACING[spacing as keyof typeof SPACING] ?? SPACING.M} bg-puratva-cream`}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-puratva-green text-sm font-semibold tracking-widest uppercase">
            Our Categories
          </span>
          <h2 className="font-display text-4xl font-bold mt-2 mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explore our complete range of organic, farm-fresh products.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {categories.map((cat) => {
            const style = categoryStyles[cat.slug] || defaultStyle;
            const productCount = cat._count?.products || 0;
            const countLabel = `${productCount} ${productCount === 1 ? "product" : "products"}`;
            const image = cat.image || style.fallbackImage;
            const icon = cat.icon || style.fallbackIcon;

            return (
              <motion.div key={cat.id} variants={item}>
                <Link href={`/shop/${cat.slug}`} className="group block">
                  <div
                    className={`relative overflow-hidden rounded-2xl border ${style.border} bg-gradient-to-br ${style.bg} p-4 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                  >
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3">
                      <Image
                        src={image}
                        alt={cat.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-2 py-0.5 text-xs font-semibold text-puratva-green shadow-sm">
                        {icon}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-sm">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {cat.description}
                    </p>
                    <span className="inline-block mt-2 text-xs bg-puratva-green/10 text-puratva-green px-2 py-0.5 rounded-full">
                      {countLabel}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
