"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
            className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@email.com"
            className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+91 ..."
            className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subject *</label>
          <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="Order / Product / Other"
            className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Message *</label>
        <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Tell us how we can help…"
          className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green" />
      </div>
      <button type="submit" disabled={sending}
        className="w-full flex items-center justify-center gap-2 bg-puratva-green text-white py-3 rounded-xl font-medium hover:bg-puratva-green-dark transition-colors disabled:opacity-50">
        <Send className="w-4 h-4" /> {sending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
