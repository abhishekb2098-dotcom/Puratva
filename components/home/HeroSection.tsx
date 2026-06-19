"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Leaf, Star } from "lucide-react";
import type { Banner } from "@prisma/client";

const fallbackSlides = [
  {
    id: "1",
    title: "From Nature To Your Home",
    subtitle: "Pure. Traditional. Authentic.",
    description: "100% organic, farm-fresh products crafted using age-old traditions. No chemicals, no preservatives — just pure goodness.",
    ctaText: "Shop Now",
    ctaLink: "/shop",
    badge: "New Arrival",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1400&q=80",
    bg: "from-puratva-green-dark/80 to-puratva-green/40",
  },
  {
    id: "2",
    title: "A2 Cow Ghee — Nature's Gold",
    subtitle: "Traditional Bilona Method",
    description: "Hand-churned from desi cow milk using the ancient bilona process. Rich in nutrients, flavour, and tradition.",
    ctaText: "Buy Ghee",
    ctaLink: "/shop/ghee",
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1400&q=80",
    bg: "from-puratva-brown/80 to-puratva-gold/30",
  },
  {
    id: "3",
    title: "Cold-Pressed Oils",
    subtitle: "Extracted Without Heat",
    description: "Our groundnut, sesame, and coconut oils are cold-pressed to retain maximum nutrition. Pure taste, every drop.",
    ctaText: "Explore Oils",
    ctaLink: "/shop/oils",
    badge: "Organic Certified",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1400&q=80",
    bg: "from-puratva-green/80 to-puratva-gold/20",
  },
  {
    id: "4",
    title: "Handcrafted Pickles",
    subtitle: "Grandma's Secret Recipe",
    description: "Sun-dried mangoes, fresh lemons, and garden-fresh garlic — all pickled in cold-pressed oils with traditional spices.",
    ctaText: "Shop Pickles",
    ctaLink: "/shop/pickles",
    badge: "Fan Favourite",
    image: "https://images.unsplash.com/photo-1568158879083-c42860933ed7?w=1400&q=80",
    bg: "from-orange-900/70 to-puratva-orange/30",
  },
];

type Props = {
  banners?: Banner[];
};

export default function HeroSection({ banners }: Props) {
  const slides = banners?.length ? banners : fallbackSlides;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  const slide = slides[current] as any;

  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image || "/images/hero-1.jpg"}
            alt={slide.title}
            fill
            className="object-cover"
            priority
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg || "from-puratva-green-dark/70 to-transparent"}`} />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 container h-full flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl text-white"
          >
            {slide.badge && (
              <span className="inline-flex items-center gap-1.5 bg-puratva-gold/90 text-puratva-green-dark text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                <Leaf className="w-3 h-3" /> {slide.badge}
              </span>
            )}
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-3">
              {slide.title}
            </h1>
            <p className="font-display text-xl md:text-2xl font-medium text-puratva-gold mb-4">
              {slide.subtitle}
            </p>
            <p className="text-base md:text-lg text-white/85 mb-8 max-w-lg">
              {slide.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={slide.ctaLink || "/shop"}
                className="bg-puratva-gold hover:bg-puratva-gold-light text-puratva-green-dark font-bold px-8 py-3 rounded-full transition-all hover:scale-105 active:scale-95"
              >
                {slide.ctaText || "Shop Now"}
              </Link>
              <Link
                href="/about"
                className="border-2 border-white/60 text-white hover:bg-white/10 font-medium px-8 py-3 rounded-full transition-all"
              >
                Our Story
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-8">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-puratva-gold text-puratva-gold" />
                <span className="text-sm font-medium">4.9/5 Rating</span>
              </div>
              <div className="text-sm font-medium">10,000+ Happy Customers</div>
              <div className="text-sm font-medium">100% Organic</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all rounded-full ${
              i === current ? "w-8 h-2 bg-puratva-gold" : "w-2 h-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
