"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import type { Testimonial } from "@prisma/client";

const fallbackTestimonials = [
  {
    id: "1",
    name: "Priya Sharma",
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    rating: 5,
    content: "The A2 Cow Ghee is absolutely divine! You can taste the difference immediately — rich, aromatic, and exactly how ghee should be. My family now refuses to use any other brand.",
    isFeatured: true, status: "APPROVED", userId: null, email: null,
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Rajesh Kumar",
    location: "Delhi",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    rating: 5,
    content: "I have been buying cold-pressed mustard oil from Puratva for 6 months now. The quality is consistent, the packaging is great, and it arrives fresh every time. Highly recommended!",
    isFeatured: true, status: "APPROVED", userId: null, email: null,
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Anjali Patel",
    location: "Ahmedabad",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    rating: 5,
    content: "Their mango pickle is straight out of a grandmother's kitchen. Already on my fourth jar!",
    isFeatured: true, status: "APPROVED", userId: null, email: null,
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Dr. Meena Nair",
    location: "Bangalore",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
    rating: 5,
    content: "As a nutritionist, I often recommend Puratva to my clients. The cold-pressed oils and A2 ghee are nutritionally superior.",
    isFeatured: true, status: "APPROVED", userId: null, email: null,
    createdAt: new Date(), updatedAt: new Date(),
  },
];

function TestimonialCard({ t, compact = false }: { t: any; compact?: boolean }) {
  return (
    <div className={`bg-white rounded-2xl shadow-md relative flex flex-col h-full ${compact ? "p-5" : "p-5 md:p-10"}`}>
      <Quote className="absolute top-4 right-4 w-8 h-8 text-puratva-green/10" />
      <div className="flex items-center gap-1 mb-4">
        {[...Array(t.rating || 5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-puratva-gold text-puratva-gold" />
        ))}
      </div>
      <p className={`text-foreground leading-relaxed italic flex-1 mb-5 ${compact ? "text-sm" : "text-base md:text-lg"}`}>
        "{t.content}"
      </p>
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-puratva-green/20 shrink-0">
          <Image
            src={t.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=2d6a4f&color=fefae0`}
            alt={t.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-sm truncate">{t.name}</div>
          <div className="text-xs text-muted-foreground truncate">{t.location}</div>
        </div>
        <span className="ml-auto shrink-0 bg-puratva-green/10 text-puratva-green text-xs px-2 py-0.5 rounded-full font-medium">
          Verified
        </span>
      </div>
    </div>
  );
}

const SPACING = { S: "py-8 md:py-10", M: "py-14 md:py-20", L: "py-20 md:py-28" };

type Props = {
  testimonials?: Testimonial[];
  label?: string;
  title?: string;
  subtext?: string;
  perView?: number;
  spacing?: string;
};

export default function TestimonialsSection({ testimonials, label, title, subtext, perView = 1, spacing = "M" }: Props) {
  const data = (testimonials?.length ? testimonials : fallbackTestimonials) as any[];
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(data.length / perView);
  const prevPage = () => setPage((p) => (p - 1 + totalPages) % totalPages);
  const nextPage = () => setPage((p) => (p + 1) % totalPages);

  const gridCols =
    perView === 1 ? "grid-cols-1" :
    perView === 2 ? "grid-cols-1 sm:grid-cols-2" :
    perView === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" :
    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  const visibleItems = data.slice(page * perView, page * perView + perView);
  const wrapperClass = perView === 1 ? "max-w-3xl mx-auto" : "max-w-7xl mx-auto";

  return (
    <section className={`${SPACING[spacing as keyof typeof SPACING] ?? SPACING.M} bg-puratva-cream overflow-hidden`}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12 px-4"
        >
          <span className="text-puratva-green text-sm font-semibold tracking-widest uppercase">
            {label ?? "Testimonials"}
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-4">
            {title ?? "What Our Customers Say"}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            {subtext ?? "Real stories from real people who made the switch to pure, organic living."}
          </p>
        </motion.div>

        <div className={wrapperClass}>
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className={`grid ${gridCols} gap-4 md:gap-6`}
            >
              {visibleItems.map((t: any) => (
                <TestimonialCard key={t.id} t={t} compact={perView > 2} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Navigation — only show if more pages exist */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prevPage}
                className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:bg-puratva-green hover:text-white hover:border-puratva-green transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`transition-all rounded-full ${
                      i === page ? "w-6 h-2 bg-puratva-green" : "w-2 h-2 bg-border"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextPage}
                className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:bg-puratva-green hover:text-white hover:border-puratva-green transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
