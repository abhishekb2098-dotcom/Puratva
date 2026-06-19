"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    name: "Oils",
    slug: "oils",
    icon: "🫒",
    desc: "Cold-pressed natural oils",
    count: "5+ products",
    bg: "from-yellow-50 to-amber-100",
    border: "border-amber-200",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80",
  },
  {
    name: "Ghee",
    slug: "ghee",
    icon: "🧈",
    desc: "Traditional & A2 Bilona Ghee",
    count: "3+ products",
    bg: "from-orange-50 to-amber-100",
    border: "border-orange-200",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80",
  },
  {
    name: "Pickles",
    slug: "pickles",
    icon: "🥭",
    desc: "Handcrafted Indian pickles",
    count: "4+ products",
    bg: "from-red-50 to-orange-100",
    border: "border-red-200",
    image: "https://images.unsplash.com/photo-1568158879083-c42860933ed7?w=400&q=80",
  },
  {
    name: "Premixes",
    slug: "premixes",
    icon: "🍲",
    desc: "Ready-to-cook healthy mixes",
    count: "4+ products",
    bg: "from-green-50 to-emerald-100",
    border: "border-green-200",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  },
  {
    name: "Pulses",
    slug: "pulses",
    icon: "🌾",
    desc: "Farm-fresh lentils & dals",
    count: "4+ products",
    bg: "from-yellow-50 to-lime-100",
    border: "border-yellow-200",
    image: "https://images.unsplash.com/photo-1585664811641-5b51bb30e4e8?w=400&q=80",
  },
  {
    name: "Dairy",
    slug: "dairy-products",
    icon: "🥛",
    desc: "Fresh farm dairy products",
    count: "10+ products",
    bg: "from-blue-50 to-sky-100",
    border: "border-blue-200",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function CategoriesSection() {
  return (
    <section className="py-20 bg-puratva-cream">
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
            Explore our complete range of organic, farm-fresh products — each
            crafted with care and tradition.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {categories.map((cat) => (
            <motion.div key={cat.slug} variants={item}>
              <Link
                href={`/shop/${cat.slug}`}
                className="group block"
              >
                <div
                  className={`relative overflow-hidden rounded-2xl border ${cat.border} bg-gradient-to-br ${cat.bg} p-4 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                >
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-3xl">
                      {cat.icon}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-sm">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{cat.desc}</p>
                  <span className="inline-block mt-2 text-xs bg-puratva-green/10 text-puratva-green px-2 py-0.5 rounded-full">
                    {cat.count}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
