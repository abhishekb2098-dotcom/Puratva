"use client";

import { motion } from "framer-motion";
import {
  Leaf, Truck, ShieldCheck, Users, Award, Sprout,
  Heart, Star, Package, Zap, Globe, Clock, CheckCircle,
  Flame, Droplets, Wheat, ThumbsUp, Sun, Wind, Gift, Coffee,
  type LucideIcon,
} from "lucide-react";

export const AVAILABLE_ICONS: Record<string, LucideIcon> = {
  Leaf, Sprout, ShieldCheck, Award, Users, Truck,
  Heart, Star, Package, Zap, Globe, Clock, CheckCircle,
  Flame, Droplets, Wheat, ThumbsUp, Sun, Wind, Gift, Coffee,
};

const COLORS = [
  "bg-green-100 text-green-700",
  "bg-lime-100 text-lime-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-orange-100 text-orange-700",
  "bg-blue-100 text-blue-700",
];

const SPACING = { S: "py-8 md:py-10", M: "py-16 md:py-20", L: "py-20 md:py-28" };

type Props = {
  whyLabel?: string;
  whyTitle?: string;
  whySubtext?: string;
  whyCardAlignment?: string;
  features?: { title: string; desc: string; icon: string }[];
  stats?: { value: string; label: string }[];
  spacing?: string;
};

export default function WhyPuratva({ whyLabel, whyTitle, whySubtext, whyCardAlignment = "left", features = [], stats = [], spacing = "M" }: Props) {
  const align = whyCardAlignment === "center" ? "items-center text-center" : whyCardAlignment === "right" ? "items-end text-right" : "items-start text-left";
  return (
    <section className={`${SPACING[spacing as keyof typeof SPACING] ?? SPACING.M} bg-white`}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12 px-4"
        >
          <span className="text-puratva-green text-sm font-semibold tracking-widest uppercase">
            {whyLabel}
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-4">
            {whyTitle}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            {whySubtext}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
          {features.map((feat, i) => {
            const Icon = AVAILABLE_ICONS[feat.icon] ?? Leaf;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group p-5 md:p-6 rounded-2xl border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col ${align}`}
              >
                <div className={`w-12 h-12 ${COLORS[i] ?? COLORS[0]} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-bold mb-2">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-puratva-green rounded-3xl p-6 md:p-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center text-white"
              >
                <div className="font-display text-3xl md:text-5xl font-bold text-puratva-gold">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm mt-2 text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
