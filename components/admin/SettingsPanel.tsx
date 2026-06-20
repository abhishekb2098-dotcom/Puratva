"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  Store, Palette, Type, Phone, Share2, Home, Info, ShoppingBag,
  Save, Upload, X, Check, Layers,
  Leaf, Sprout, ShieldCheck, Award, Users, Truck,
  Heart, Star, Package, Zap, Globe, Clock, CheckCircle,
  Flame, Droplets, Wheat, ThumbsUp, Sun, Wind, Gift, Coffee,
  AlignLeft, AlignCenter, AlignRight,
  ChevronUp, ChevronDown, GripVertical, Eye, EyeOff,
  type LucideIcon,
} from "lucide-react";

const ICON_OPTIONS: { name: string; Icon: LucideIcon }[] = [
  { name: "Leaf", Icon: Leaf }, { name: "Sprout", Icon: Sprout },
  { name: "ShieldCheck", Icon: ShieldCheck }, { name: "Award", Icon: Award },
  { name: "Users", Icon: Users }, { name: "Truck", Icon: Truck },
  { name: "Heart", Icon: Heart }, { name: "Star", Icon: Star },
  { name: "Package", Icon: Package }, { name: "Zap", Icon: Zap },
  { name: "Globe", Icon: Globe }, { name: "Clock", Icon: Clock },
  { name: "CheckCircle", Icon: CheckCircle }, { name: "Flame", Icon: Flame },
  { name: "Droplets", Icon: Droplets }, { name: "Wheat", Icon: Wheat },
  { name: "ThumbsUp", Icon: ThumbsUp }, { name: "Sun", Icon: Sun },
  { name: "Wind", Icon: Wind }, { name: "Gift", Icon: Gift },
  { name: "Coffee", Icon: Coffee },
];
import type { SiteConfig } from "@/lib/site-config";

const TABS = [
  { id: "brand",     label: "Brand",      icon: Store },
  { id: "colors",    label: "Colors",     icon: Palette },
  { id: "fonts",     label: "Fonts",      icon: Type },
  { id: "contact",   label: "Contact",    icon: Phone },
  { id: "social",    label: "Social",     icon: Share2 },
  { id: "structure", label: "Structure",  icon: Layers },
  { id: "home",      label: "Home Page",  icon: Home },
  { id: "whyus",     label: "Why Us",     icon: Info },
  { id: "about",     label: "About",      icon: Info },
  { id: "commerce",  label: "Commerce",   icon: ShoppingBag },
] as const;

type HomeSection = { id: string; enabled: boolean; size: string };

const SECTION_META: Record<string, { label: string; description: string; icon: LucideIcon }> = {
  hero:        { label: "Hero Banner",      description: "Full-width image/video banner carousel",       icon: Home },
  categories:  { label: "Categories Grid",  description: "Product category tiles with icons",            icon: Package },
  bestSellers: { label: "Best Sellers",     description: "Featured best-selling product grid",           icon: Star },
  whyUs:       { label: "Why Choose Us",    description: "Feature cards + stats bar",                    icon: ShieldCheck },
  newArrivals: { label: "New Arrivals",     description: "Recently added products grid",                 icon: Sprout },
  testimonials:{ label: "Testimonials",     description: "Customer review carousel / grid",              icon: Heart },
  newsletter:  { label: "Newsletter",       description: "Email subscription section",                   icon: Globe },
};

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

function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {ICON_OPTIONS.map(({ name, Icon }) => (
        <button
          key={name}
          type="button"
          title={name}
          onClick={() => onChange(name)}
          className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${
            value === name
              ? "bg-puratva-green text-white border-puratva-green"
              : "hover:bg-muted border-border text-muted-foreground"
          }`}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}

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

const DEFAULT_SECTIONS: HomeSection[] = [
  { id: "hero", enabled: true, size: "M" }, { id: "categories", enabled: true, size: "M" },
  { id: "bestSellers", enabled: true, size: "M" }, { id: "whyUs", enabled: true, size: "M" },
  { id: "newArrivals", enabled: true, size: "M" }, { id: "testimonials", enabled: true, size: "M" },
  { id: "newsletter", enabled: true, size: "M" },
];

function parseSections(raw: string): HomeSection[] {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map((s: any) => ({ size: "M", ...s }));
  } catch {}
  return DEFAULT_SECTIONS;
}

export default function SettingsPanel({ initial }: { initial: SiteConfig }) {
  const [tab, setTab] = useState<TabId>("brand");
  const [cfg, setCfg] = useState<SiteConfig>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Section structure state — derived from cfg.homePageSections
  const [sections, setSections] = useState<HomeSection[]>(() => parseSections(initial.homePageSections));

  const updateSections = useCallback((next: HomeSection[]) => {
    setSections(next);
    setCfg((c) => ({ ...c, homePageSections: JSON.stringify(next) }));
  }, []);

  const moveSectionUp = (i: number) => {
    if (i === 0) return;
    const next = [...sections];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    updateSections(next);
  };

  const moveSectionDown = (i: number) => {
    if (i === sections.length - 1) return;
    const next = [...sections];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    updateSections(next);
  };

  const toggleSection = (i: number) => {
    const next = sections.map((s, idx) => idx === i ? { ...s, enabled: !s.enabled } : s);
    updateSections(next);
  };

  const resetSections = () => updateSections(DEFAULT_SECTIONS);

  const resizeSection = (i: number, size: string) => {
    const next = sections.map((s, idx) => idx === i ? { ...s, size } : s);
    updateSections(next);
  };

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
              <Field label="Tagline" hint="Used in meta descriptions and as default for other fields">
                <Input value={cfg.tagline} onChange={(e) => set("tagline", e.target.value)} />
              </Field>
              <Field label="Navbar Tagline" hint="Shown below store name in the top navigation bar">
                <Input value={cfg.navTagline} onChange={(e) => set("navTagline", e.target.value)} placeholder="Pure. Natural. Authentic." />
              </Field>
              <Field label="Footer Description" hint="Text shown under the logo/name in the footer">
                <Textarea rows={2} value={cfg.footerDescription} onChange={(e) => set("footerDescription", e.target.value)} />
              </Field>
              <Field label="Logo" hint="Same logo appears in both navbar and footer">
                <LogoUpload value={cfg.logoUrl} onChange={(url) => set("logoUrl", url)} />
              </Field>
              <Field label="Logo Size (px)" hint="Controls logo display size in navbar and footer (32–80)">
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={32}
                    max={80}
                    step={4}
                    value={cfg.logoSize || "40"}
                    onChange={(e) => set("logoSize", e.target.value)}
                    className="flex-1 accent-puratva-green"
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={cfg.logoSize || "40"}
                      onChange={(e) => set("logoSize", e.target.value)}
                      className="w-20 text-center"
                      min={32}
                      max={80}
                    />
                    <span className="text-sm text-muted-foreground">px</span>
                  </div>
                </div>
                {/* Live preview */}
                <div className="mt-3 p-4 bg-muted/40 rounded-xl flex items-center gap-3">
                  {cfg.logoUrl ? (
                    <Image
                      src={cfg.logoUrl}
                      alt="Logo preview"
                      width={Number(cfg.logoSize) || 40}
                      height={Number(cfg.logoSize) || 40}
                      style={{ width: `${cfg.logoSize || 40}px`, height: `${cfg.logoSize || 40}px` }}
                      className="object-contain"
                    />
                  ) : (
                    <div
                      className="bg-puratva-green rounded-full flex items-center justify-center shrink-0"
                      style={{ width: `${cfg.logoSize || 40}px`, height: `${cfg.logoSize || 40}px` }}
                    >
                      <Store className="text-white" style={{ width: `${Math.round((Number(cfg.logoSize) || 40) * 0.5)}px`, height: `${Math.round((Number(cfg.logoSize) || 40) * 0.5)}px` }} />
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-lg leading-tight">{cfg.storeName}</p>
                    {cfg.navTagline && <p className="text-xs text-muted-foreground">{cfg.navTagline}</p>}
                  </div>
                </div>
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

          {tab === "structure" && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg">Home Page Structure</h2>
                  <p className="text-sm text-muted-foreground">Reorder with ↑↓, set spacing (S/M/L), or hide sections with the eye icon.</p>
                </div>
                <button
                  type="button"
                  onClick={resetSections}
                  className="text-xs text-muted-foreground border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors"
                >
                  Reset to Default
                </button>
              </div>

              <div className="space-y-2 mt-2">
                {sections.map((s, i) => {
                  const meta = SECTION_META[s.id];
                  if (!meta) return null;
                  const Icon = meta.icon;
                  return (
                    <div
                      key={s.id}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                        s.enabled ? "bg-white border-border" : "bg-muted/30 border-dashed border-muted-foreground/30 opacity-60"
                      }`}
                    >
                      {/* Drag handle (visual only) */}
                      <GripVertical className="w-4 h-4 text-muted-foreground/40 shrink-0" />

                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${s.enabled ? "bg-puratva-green/10" : "bg-muted"}`}>
                        <Icon className={`w-4 h-4 ${s.enabled ? "text-puratva-green" : "text-muted-foreground"}`} />
                      </div>

                      {/* Label */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold leading-tight">{meta.label}</p>
                        <p className="text-xs text-muted-foreground truncate">{meta.description}</p>
                      </div>

                      {/* Position badge */}
                      <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded-md text-muted-foreground w-6 text-center shrink-0">
                        {i + 1}
                      </span>

                      {/* Up / Down */}
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveSectionUp(i)}
                          disabled={i === 0}
                          className="p-1 rounded hover:bg-muted disabled:opacity-20 transition-colors"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSectionDown(i)}
                          disabled={i === sections.length - 1}
                          className="p-1 rounded hover:bg-muted disabled:opacity-20 transition-colors"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Size S/M/L */}
                      <div className="flex gap-0.5 shrink-0">
                        {["S", "M", "L"].map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => resizeSection(i, sz)}
                            className={`w-6 h-6 text-xs font-bold rounded transition-all ${
                              s.size === sz
                                ? "bg-puratva-green text-white"
                                : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>

                      {/* Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleSection(i)}
                        title={s.enabled ? "Hide section" : "Show section"}
                        className={`p-2 rounded-lg transition-all shrink-0 ${
                          s.enabled
                            ? "bg-puratva-green/10 text-puratva-green hover:bg-puratva-green/20"
                            : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                        }`}
                      >
                        {s.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Preview order */}
              <div className="mt-4 p-4 bg-muted/30 rounded-xl">
                <p className="text-xs font-semibold text-muted-foreground mb-2">VISIBLE SECTION ORDER (TOP → BOTTOM)</p>
                <div className="flex flex-wrap gap-2">
                  {sections
                    .filter((s) => s.enabled)
                    .map((s, i) => {
                      const meta = SECTION_META[s.id];
                      return (
                        <span key={s.id} className="flex items-center gap-1 text-xs bg-white border rounded-lg px-2.5 py-1 font-medium">
                          <span className="text-muted-foreground">{i + 1}.</span> {meta?.label ?? s.id}
                        </span>
                      );
                    })}
                </div>
              </div>
            </>
          )}

          {tab === "home" && (
            <>
              <h2 className="font-bold text-lg">Home Page Content</h2>

              {/* ── Announcement / Top Bar ── */}
              <div className="p-4 border rounded-xl space-y-4 bg-muted/20">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Announcement Bar</p>
                  <button
                    type="button"
                    onClick={() => set("topBarEnabled", cfg.topBarEnabled === "false" ? "true" : "false")}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      cfg.topBarEnabled !== "false"
                        ? "bg-puratva-green text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {cfg.topBarEnabled !== "false" ? "Visible" : "Hidden"}
                  </button>
                </div>
                <Field label="Left Text" hint="Free shipping notice (shown next to phone number)">
                  <Input value={cfg.topBarLeft} onChange={(e) => set("topBarLeft", e.target.value)} placeholder="Free shipping on orders above ₹499" />
                </Field>
                <Field label="Badge Text" hint="Right-side badge (e.g. certification)">
                  <Input value={cfg.topBarBadge} onChange={(e) => set("topBarBadge", e.target.value)} placeholder="100% Organic Certified" />
                </Field>
                <Field label="Animation Effect">
                  <div className="flex gap-2">
                    {([
                      { value: "none",    label: "Static",   desc: "No animation" },
                      { value: "marquee", label: "Marquee",  desc: "Scrolling text" },
                      { value: "pulse",   label: "Pulse",    desc: "Pulsing badge" },
                    ] as { value: string; label: string; desc: string }[]).map(({ value, label, desc }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => set("topBarAnimation", value)}
                        className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 rounded-xl border text-xs transition-all ${
                          cfg.topBarAnimation === value
                            ? "bg-puratva-green text-white border-puratva-green"
                            : "hover:bg-muted border-border text-muted-foreground"
                        }`}
                      >
                        <span className="font-semibold">{label}</span>
                        <span className={`text-[10px] ${cfg.topBarAnimation === value ? "text-white/70" : ""}`}>{desc}</span>
                      </button>
                    ))}
                  </div>
                </Field>
              </div>

              <hr className="my-1" />
              <Field label="Hero Tagline" hint="Displayed in the hero banner overlay">
                <Input value={cfg.heroTagline} onChange={(e) => set("heroTagline", e.target.value)} />
              </Field>
              <Field label="Free Shipping Threshold (₹)" hint="Shown in the top bar">
                <Input type="number" value={cfg.freeShippingThreshold} onChange={(e) => set("freeShippingThreshold", e.target.value)} />
              </Field>
              <hr className="my-1" />
              <p className="text-sm font-semibold text-muted-foreground">Testimonials Section</p>
              <Field label="Section Label" hint="Small uppercase label above the heading">
                <Input value={cfg.testimonialsLabel} onChange={(e) => set("testimonialsLabel", e.target.value)} />
              </Field>
              <Field label="Section Heading">
                <Input value={cfg.testimonialsTitle} onChange={(e) => set("testimonialsTitle", e.target.value)} />
              </Field>
              <Field label="Section Subtext">
                <Textarea rows={2} value={cfg.testimonialsSubtext} onChange={(e) => set("testimonialsSubtext", e.target.value)} />
              </Field>
              <Field label="Cards visible at once" hint="How many testimonials to display side by side">
                <div className="flex gap-2">
                  {["1", "2", "3", "4"].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => set("testimonialsPerView", n)}
                      className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all ${
                        cfg.testimonialsPerView === n
                          ? "bg-puratva-green text-white border-puratva-green"
                          : "hover:bg-muted border-border"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </Field>
              <hr className="my-1" />
              <p className="text-sm font-semibold text-muted-foreground">Newsletter Section</p>
              <Field label="Heading">
                <Input value={cfg.newsletterHeading} onChange={(e) => set("newsletterHeading", e.target.value)} />
              </Field>
              <Field label="Subtext">
                <Textarea rows={2} value={cfg.newsletterSubtext} onChange={(e) => set("newsletterSubtext", e.target.value)} />
              </Field>
            </>
          )}

          {tab === "whyus" && (
            <>
              <h2 className="font-bold text-lg">Why Choose Us Section</h2>
              <Field label="Section Label" hint="Small uppercase label above the heading">
                <Input value={cfg.whyLabel} onChange={(e) => set("whyLabel", e.target.value)} />
              </Field>
              <Field label="Section Heading">
                <Input value={cfg.whyTitle} onChange={(e) => set("whyTitle", e.target.value)} />
              </Field>
              <Field label="Section Subtext">
                <Textarea rows={2} value={cfg.whySubtext} onChange={(e) => set("whySubtext", e.target.value)} />
              </Field>
              <Field label="Card Content Alignment" hint="Controls text and icon alignment within each feature card">
                <div className="flex gap-2 mt-1">
                  {([
                    { value: "left",   label: "Left",   Icon: AlignLeft },
                    { value: "center", label: "Center", Icon: AlignCenter },
                    { value: "right",  label: "Right",  Icon: AlignRight },
                  ] as { value: string; label: string; Icon: LucideIcon }[]).map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => set("whyCardAlignment", value)}
                      className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-all ${
                        cfg.whyCardAlignment === value
                          ? "bg-puratva-green text-white border-puratva-green"
                          : "hover:bg-muted border-border text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </Field>
              <hr className="my-1" />
              <p className="text-sm font-semibold text-muted-foreground">Feature Cards</p>
              {([
                ["feat1Title", "feat1Desc", "feat1Icon", "Card 1"],
                ["feat2Title", "feat2Desc", "feat2Icon", "Card 2"],
                ["feat3Title", "feat3Desc", "feat3Icon", "Card 3"],
                ["feat4Title", "feat4Desc", "feat4Icon", "Card 4"],
                ["feat5Title", "feat5Desc", "feat5Icon", "Card 5"],
                ["feat6Title", "feat6Desc", "feat6Icon", "Card 6"],
              ] as [keyof typeof cfg, keyof typeof cfg, keyof typeof cfg, string][]).map(([titleKey, descKey, iconKey, cardLabel]) => {
                const SelectedIcon = ICON_OPTIONS.find(o => o.name === cfg[iconKey])?.Icon ?? Leaf;
                return (
                  <div key={titleKey} className="p-4 border rounded-xl space-y-3 bg-muted/20">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-puratva-green/10 rounded-lg flex items-center justify-center">
                        <SelectedIcon className="w-4 h-4 text-puratva-green" />
                      </div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{cardLabel}</p>
                    </div>
                    <Field label="Icon">
                      <IconPicker value={cfg[iconKey] as string} onChange={(v) => set(iconKey, v)} />
                    </Field>
                    <Field label="Title">
                      <Input value={cfg[titleKey] as string} onChange={(e) => set(titleKey, e.target.value)} />
                    </Field>
                    <Field label="Description">
                      <Textarea rows={2} value={cfg[descKey] as string} onChange={(e) => set(descKey, e.target.value)} />
                    </Field>
                  </div>
                );
              })}
              <hr className="my-1" />
              <p className="text-sm font-semibold text-muted-foreground">Stats Bar</p>
              <div className="grid grid-cols-2 gap-4">
                {([
                  ["stat1Value", "stat1Label", "Stat 1"],
                  ["stat2Value", "stat2Label", "Stat 2"],
                  ["stat3Value", "stat3Label", "Stat 3"],
                  ["stat4Value", "stat4Label", "Stat 4"],
                ] as [keyof typeof cfg, keyof typeof cfg, string][]).map(([valKey, lblKey, label]) => (
                  <div key={valKey} className="p-3 border rounded-xl space-y-2 bg-muted/20">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
                    <Field label="Value">
                      <Input value={cfg[valKey] as string} onChange={(e) => set(valKey, e.target.value)} placeholder="10K+" />
                    </Field>
                    <Field label="Label">
                      <Input value={cfg[lblKey] as string} onChange={(e) => set(lblKey, e.target.value)} placeholder="Happy Customers" />
                    </Field>
                  </div>
                ))}
              </div>
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
