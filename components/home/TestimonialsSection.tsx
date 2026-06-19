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
    isFeatured: true,
    status: "APPROVED",
    userId: null,
    email: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Rajesh Kumar",
    location: "Delhi",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    rating: 5,
    content: "I have been buying cold-pressed mustard oil from Puratva for 6 months now. The quality is consistent, the packaging is great, and it arrives fresh every time. Highly recommended!",
    isFeatured: true,
    status: "APPROVED",
    userId: null,
    email: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Anjali Patel",
    location: "Ahmedabad",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    rating: 5,
    content: "Their mango pickle is straight out of a grandmother's kitchen. The balance of spices is perfect and it pairs wonderfully with everything. Already on my fourth jar!",
    isFeatured: true,
    status: "APPROVED",
    userId: null,
    email: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Dr. Meena Nair",
    location: "Bangalore",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
    rating: 5,
    content: "As a nutritionist, I often recommend Puratva to my clients. The cold-pressed oils and A2 ghee are nutritionally superior. It is rare to find products with such transparency and quality.",
    isFeatured: true,
    status: "APPROVED",
    userId: null,
    email: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

type Props = {
  testimonials?: Testimonial[];
};

export default function TestimonialsSection({ testimonials }: Props) {
  const data = testimonials?.length ? testimonials : fallbackTestimonials;
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + data.length) % data.length);
  const next = () => setCurrent((c) => (c + 1) % data.length);

  const t = data[current] as any;

  return (
    <section className="py-20 bg-puratva-cream overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-puratva-green text-sm font-semibold tracking-widest uppercase">
            Testimonials
          </span>
          <h2 className="font-display text-4xl font-bold mt-2 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Real stories from real people who made the switch to pure, organic living.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-lg relative"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-puratva-green/10" />

              <div className="flex items-center gap-1 mb-6">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-puratva-gold text-puratva-gold" />
                ))}
              </div>

              <p className="text-lg md:text-xl text-foreground leading-relaxed mb-8 italic">
                "{t.content}"
              </p>

              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-puratva-green/20">
                  <Image
                    src={t.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=2d6a4f&color=fefae0`}
                    alt={t.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.location}</div>
                </div>
                <div className="ml-auto">
                  <span className="bg-puratva-green/10 text-puratva-green text-xs px-3 py-1 rounded-full font-medium">
                    Verified Purchase
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:bg-puratva-green hover:text-white hover:border-puratva-green transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {data.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`transition-all rounded-full ${
                    i === current ? "w-6 h-2 bg-puratva-green" : "w-2 h-2 bg-border"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 border border-border rounded-full flex items-center justify-center hover:bg-puratva-green hover:text-white hover:border-puratva-green transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
