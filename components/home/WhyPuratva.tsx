"use client";

import { motion } from "framer-motion";
import { Leaf, Truck, ShieldCheck, Users, Award, Sprout } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "100% Natural",
    desc: "No artificial colours, flavours, or preservatives. Just pure, honest ingredients from nature.",
    color: "bg-green-100 text-green-700",
  },
  {
    icon: Sprout,
    title: "Farm Fresh",
    desc: "Sourced directly from certified organic farms across India. Fresh from harvest to your door.",
    color: "bg-lime-100 text-lime-700",
  },
  {
    icon: ShieldCheck,
    title: "No Chemicals",
    desc: "Zero pesticides, zero synthetic additives. Safe for your entire family, including children.",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: Award,
    title: "Traditional Processing",
    desc: "Ancient methods like cold-pressing and bilona churning preserve all natural nutrients.",
    color: "bg-amber-100 text-amber-700",
  },
  {
    icon: Users,
    title: "Direct From Farmers",
    desc: "We partner directly with 200+ farmers, ensuring fair prices and complete supply-chain transparency.",
    color: "bg-orange-100 text-orange-700",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "PAN-India delivery with temperature-controlled packaging to maintain freshness.",
    color: "bg-blue-100 text-blue-700",
  },
];

const stats = [
  { value: "10K+", label: "Happy Customers" },
  { value: "200+", label: "Partner Farmers" },
  { value: "50+", label: "Products" },
  { value: "4.9★", label: "Average Rating" },
];

export default function WhyPuratva() {
  return (
    <section className="py-20 bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-puratva-green text-sm font-semibold tracking-widest uppercase">
            Why Choose Us
          </span>
          <h2 className="font-display text-4xl font-bold mt-2 mb-4">
            The Puratva Promise
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We believe food should nourish, not harm. Every product we make is a
            testament to our commitment to purity, quality, and tradition.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-6 rounded-2xl border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 ${feat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feat.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">{feat.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-puratva-green rounded-3xl p-8 md:p-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center text-white"
              >
                <div className="font-display text-4xl md:text-5xl font-bold text-puratva-gold">
                  {stat.value}
                </div>
                <div className="text-sm mt-2 text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
