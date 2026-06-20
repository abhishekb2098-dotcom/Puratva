"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Leaf } from "lucide-react";
import toast from "react-hot-toast";

const SPACING = { S: "py-8 md:py-10", M: "py-14 md:py-16", L: "py-20 md:py-24" };

export default function NewsletterSection({
  heading,
  subtext,
  spacing = "M",
}: {
  heading?: string;
  subtext?: string;
  spacing?: string;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast.success("Subscribed! Welcome to the Puratva family.");
        setEmail("");
      } else {
        toast.error("Already subscribed or something went wrong.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`${SPACING[spacing as keyof typeof SPACING] ?? SPACING.M} bg-puratva-green-dark`}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center text-white px-4"
        >
          <div className="w-14 h-14 bg-puratva-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7 text-puratva-gold" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
            {heading ?? "Join the Puratva Family"}
          </h2>
          <p className="text-white/75 mb-8 text-sm md:text-base">
            {subtext ?? "Get exclusive offers, healthy recipes, and farm stories straight to your inbox. Unsubscribe anytime."}
          </p>

          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded-xl px-4 py-3 focus:outline-none focus:border-puratva-gold transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-puratva-gold hover:bg-puratva-gold-light text-puratva-green-dark font-bold px-6 py-3 rounded-xl transition-colors disabled:opacity-70 whitespace-nowrap"
            >
              {loading ? "Joining..." : "Subscribe"}
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-white/60">
            <Leaf className="w-4 h-4" />
            <span>No spam. Only organic goodness.</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
