"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  Store, Palette, Type, Phone, Share2, Home, Info, ShoppingBag,
  Save, Upload, X, Check,
} from "lucide-react";
import type { SiteConfig } from "@/lib/site-config";

const TABS = [
  { id: "brand",     label: "Brand",     icon: Store },
  { id: "colors",    label: "Colors",    icon: Palette },
  { id: "fonts",     label: "Fonts",     icon: Type },
  { id: "contact",   label: "Contact",   icon: Phone },
  { id: "social",    label: "Social",    icon: Share2 },
  { id: "home",      label: "Home Page", icon: Home },
  { id: "about",     label: "About",     icon: Info },
  { id: "commerce",  label: "Commerce",  icon: ShoppingBag },
] as const;

type TabId = typeof TABS[number]["id"];

const HEADING_FONTS = ["Playfair Display", "Cormorant Garamond", "Merriweather", "Libre Baskerville", "Lora"];
const BODY_FONTS    = ["Inter", "Lato", "Nunito", "Poppins", "Roboto"];

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    {hint && <p className="text-xs text-muted-foreground mb-1">{hint}</p>}
    {children}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green ${props.className ?? ""}`}
  />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green ${props.className ?? ""}`}
  />
);

const Select = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green"
  >
    {options.map((o) => <option key={o} value={o}>{o}</option>)}
  </select>
);

function ColorField({ label, hint, value, onChange }: { label: string; hint?: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label} hint={hint}>
      <div className="flex gap-2 items-center">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded-lg border cursor-pointer p-0.5"
          />
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="font-mono"
        />
        <div className="w-8 h-8 rounded-lg border shrink-0" style={{ backgroundColor: value }} />
      </div>
    </Field>
  );
}

function LogoUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "puratva/brand");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      onChange(data.url);
      toast.success("Logo uploaded");
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative w-24 h-24 border rounded-xl overflow-hidden bg-muted flex items-center justify-center">
            <Image src={value} alt="Logo" fill className="object-contain p-2" />
            <button type="button" onClick={() => onChange("")}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-red-600">
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => ref.current?.click()}
            className="w-24 h-24 border-2 border-dashed border-puratva-green/30 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-puratva-cream/40 transition-colors"
          >
            {uploading
              ? <div className="w-5 h-5 border-2 border-puratva-green border-t-transparent rounded-full animate-spin" />
              : <Upload className="w-5 h-5 text-puratva-green/50" />}
            <span className="text-xs text-muted-foreground">Upload</span>
          </div>
        )}
        <div className="flex-1">
          <button type="button" onClick={() => ref.current?.click()}
            className="flex items-center gap-2 border rounded-xl px-3 py-2 text-sm hover:bg-muted transition-colors mb-2">
            <Upload className="w-4 h-4" /> {uploading ? "Uploading…" : "Upload Logo"}
          </button>
          <input ref={ref} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
          <p className="text-xs text-muted-foreground">PNG, SVG, WebP. Shown in navbar & emails.</p>
        </div>
      </div>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Or paste logo URL" />
    </div>
  );
}

export default function SettingsPanel({ initial }: { initial: SiteConfig }) {
  const [tab, setTab] = useState<TabId>("brand");
  const [cfg, setCfg] = useState<SiteConfig>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof SiteConfig, value: string) =>
    setCfg((c) => ({ ...c, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/site-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cfg),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success("Settings saved — changes apply within ~60 seconds");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      toast.error(err.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Site Configuration</h1>
          <p className="text-muted-foreground text-sm">Control every aspect of your storefront appearance and content</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-puratva-green text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-puratva-green-dark transition-colors disabled:opacity-50"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <aside className="w-44 shrink-0">
          <nav className="space-y-0.5">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  tab === id
                    ? "bg-puratva-green text-white"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Panel */}
        <div className="flex-1 bg-white rounded-2xl border p-6 space-y-5 min-h-[520px]">

          {tab === "brand" && (
            <>
              <h2 className="font-bold text-lg">Brand Identity</h2>
              <Field label="Store Name">
                <Input value={cfg.storeName} onChange={(e) => set("storeName", e.target.value)} />
              </Field>
              <Field label="Tagline" hint="Shown in the footer and meta descriptions">
                <Input value={cfg.tagline} onChange={(e) => set("tagline", e.target.value)} />
              </Field>
              <Field label="Logo" hint="Replaces the leaf icon in the navbar">
                <LogoUpload value={cfg.logoUrl} onChange={(url) => set("logoUrl", url)} />
              </Field>
            </>
          )}

          {tab === "colors" && (
            <>
              <h2 className="font-bold text-lg">Color Scheme</h2>
              <p className="text-sm text-muted-foreground">Changes apply across all pages — no rebuild needed.</p>
              <div className="grid grid-cols-2 gap-5">
                <ColorField label="Primary Color" hint="Navbar, buttons, highlights" value={cfg.colorPrimary} onChange={(v) => set("colorPrimary", v)} />
                <ColorField label="Dark Shade" hint="Navbar background, footer" value={cfg.colorDark} onChange={(v) => set("colorDark", v)} />
                <ColorField label="Accent / Gold" hint="Badges, CTA accents" value={cfg.colorAccent} onChange={(v) => set("colorAccent", v)} />
                <ColorField label="Background / Cream" hint="Page background, light sections" value={cfg.colorBg} onChange={(v) => set("colorBg", v)} />
              </div>
              {/* Live preview */}
              <div className="border rounded-xl p-4 mt-2">
                <p className="text-xs text-muted-foreground mb-3 font-medium">Live Preview</p>
                <div className="flex gap-3 flex-wrap">
                  <div className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: cfg.colorPrimary }}>Primary Button</div>
                  <div className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: cfg.colorAccent, color: cfg.colorDark }}>Accent Badge</div>
                  <div className="px-4 py-2 rounded-lg text-sm border" style={{ backgroundColor: cfg.colorBg, borderColor: cfg.colorPrimary, color: cfg.colorPrimary }}>Outline Button</div>
                  <div className="px-4 py-2 rounded-lg text-white text-sm" style={{ backgroundColor: cfg.colorDark }}>Dark Section</div>
                </div>
              </div>
            </>
          )}

          {tab === "fonts" && (
            <>
              <h2 className="font-bold text-lg">Typography</h2>
              <p className="text-sm text-muted-foreground">Google Fonts are loaded automatically when a non-default font is selected.</p>
              <div className="grid grid-cols-2 gap-5">
                <Field label="Heading Font" hint="h1–h6, titles, display text">
                  <Select value={cfg.fontHeading} onChange={(v) => set("fontHeading", v)} options={HEADING_FONTS} />
                  <p className="mt-2 text-lg font-bold" style={{ fontFamily: `"${cfg.fontHeading}", serif` }}>
                    The quick brown fox
                  </p>
                </Field>
                <Field label="Body Font" hint="Paragraphs, labels, UI text">
                  <Select value={cfg.fontBody} onChange={(v) => set("fontBody", v)} options={BODY_FONTS} />
                  <p className="mt-2 text-sm" style={{ fontFamily: `"${cfg.fontBody}", sans-serif` }}>
                    The quick brown fox jumps over the lazy dog.
                  </p>
                </Field>
              </div>
            </>
          )}

          {tab === "contact" && (
            <>
              <h2 className="font-bold text-lg">Contact Information</h2>
              <p className="text-sm text-muted-foreground">Used in the navbar, footer, and contact page.</p>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Phone">
                  <Input value={cfg.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98765 43210" />
                </Field>
                <Field label="Email">
                  <Input type="email" value={cfg.email} onChange={(e) => set("email", e.target.value)} placeholder="hello@example.com" />
                </Field>
              </div>
              <Field label="Address">
                <Textarea rows={2} value={cfg.address} onChange={(e) => set("address", e.target.value)} />
              </Field>
              <Field label="Business Hours">
                <Input value={cfg.hours} onChange={(e) => set("hours", e.target.value)} placeholder="Mon–Sat: 9am – 6pm IST" />
              </Field>
            </>
          )}

          {tab === "social" && (
            <>
              <h2 className="font-bold text-lg">Social Media Links</h2>
              <p className="text-sm text-muted-foreground">Leave empty or as # to hide the icon in the footer.</p>
              {(["facebook", "instagram", "twitter", "youtube"] as const).map((key) => (
                <Field key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
                  <Input value={(cfg as any)[key]} onChange={(e) => set(key, e.target.value)} placeholder={`https://www.${key}.com/yourpage`} />
                </Field>
              ))}
            </>
          )}

          {tab === "home" && (
            <>
              <h2 className="font-bold text-lg">Home Page Content</h2>
              <Field label="Hero Tagline" hint="Displayed in the hero banner overlay">
                <Input value={cfg.heroTagline} onChange={(e) => set("heroTagline", e.target.value)} />
              </Field>
              <Field label="Free Shipping Threshold (₹)" hint="Shown in the top bar">
                <Input type="number" value={cfg.freeShippingThreshold} onChange={(e) => set("freeShippingThreshold", e.target.value)} />
              </Field>
              <Field label="Newsletter Section Heading">
                <Input value={cfg.newsletterHeading} onChange={(e) => set("newsletterHeading", e.target.value)} />
              </Field>
              <Field label="Newsletter Subtext">
                <Textarea rows={2} value={cfg.newsletterSubtext} onChange={(e) => set("newsletterSubtext", e.target.value)} />
              </Field>
            </>
          )}

          {tab === "about" && (
            <>
              <h2 className="font-bold text-lg">About Page Content</h2>
              <Field label="Hero Title">
                <Input value={cfg.aboutHeroTitle} onChange={(e) => set("aboutHeroTitle", e.target.value)} />
              </Field>
              <Field label="Hero Paragraph">
                <Textarea rows={3} value={cfg.aboutHeroText} onChange={(e) => set("aboutHeroText", e.target.value)} />
              </Field>
              <Field label="Our Story">
                <Textarea rows={4} value={cfg.aboutStory} onChange={(e) => set("aboutStory", e.target.value)} />
              </Field>
              <Field label="Our Mission">
                <Textarea rows={4} value={cfg.aboutMission} onChange={(e) => set("aboutMission", e.target.value)} />
              </Field>
            </>
          )}

          {tab === "commerce" && (
            <>
              <h2 className="font-bold text-lg">Commerce Settings</h2>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Currency">
                  <Select value={cfg.currency} onChange={(v) => set("currency", v)} options={["INR", "USD", "EUR", "GBP"]} />
                </Field>
                <Field label="Tax Rate (%)" hint="Applied at checkout">
                  <Input type="number" value={cfg.taxRate} onChange={(e) => set("taxRate", e.target.value)} />
                </Field>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
