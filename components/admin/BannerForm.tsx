"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

type BannerData = {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  mobileImage: string;
  ctaText: string;
  ctaLink: string;
  badge: string;
  isActive: boolean;
  sortOrder: number;
  startsAt: string;
  endsAt: string;
};

const empty: BannerData = {
  title: "",
  subtitle: "",
  description: "",
  image: "",
  mobileImage: "",
  ctaText: "",
  ctaLink: "",
  badge: "",
  isActive: true,
  sortOrder: 0,
  startsAt: "",
  endsAt: "",
};

function ImageUploadField({
  label,
  required,
  value,
  onChange,
  folder,
  placeholder,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (url: string) => void;
  folder: string;
  placeholder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      onChange(data.url);
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Upload zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="relative border-2 border-dashed border-puratva-green/30 rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-puratva-cream/40 transition-colors mb-2"
      >
        {value ? (
          <div className="relative w-full h-36">
            <Image src={value} alt="Preview" fill className="object-cover rounded-lg" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <>
            {uploading ? (
              <div className="w-8 h-8 border-2 border-puratva-green border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-puratva-green/60" />
            )}
            <span className="text-sm font-medium text-muted-foreground">
              {uploading ? "Uploading…" : "Click or drag & drop to upload"}
            </span>
            <span className="text-xs text-muted-foreground">PNG, JPG, WebP up to 5MB</span>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
        />
      </div>

      {/* URL fallback */}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Or paste an image URL"}
        className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green"
      />
    </div>
  );
}

export default function BannerForm({ initial }: { initial?: BannerData }) {
  const router = useRouter();
  const [form, setForm] = useState<BannerData>(initial ?? empty);
  const [saving, setSaving] = useState(false);

  const set = (field: keyof BannerData, value: string | boolean | number) =>
    setForm((f) => ({ ...f, [field]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.image) {
      toast.error("Title and image are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        sortOrder: Number(form.sortOrder),
        startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null,
        endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
        subtitle: form.subtitle || null,
        description: form.description || null,
        mobileImage: form.mobileImage || null,
        ctaText: form.ctaText || null,
        ctaLink: form.ctaLink || null,
        badge: form.badge || null,
      };

      const isEdit = !!form.id;
      const res = await fetch(isEdit ? `/api/banners/${form.id}` : "/api/banners", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      toast.success(isEdit ? "Banner updated" : "Banner created");
      router.push("/admin/banners");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6 max-w-2xl">
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title <span className="text-red-500">*</span></label>
          <input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green"
            placeholder="Banner headline"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subtitle</label>
          <input
            value={form.subtitle}
            onChange={(e) => set("subtitle", e.target.value)}
            className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green"
            placeholder="Short tagline below the title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green"
            placeholder="Optional longer description"
          />
        </div>

        <ImageUploadField
          label="Banner Image"
          required
          value={form.image}
          onChange={(url) => set("image", url)}
          folder="puratva/banners"
          placeholder="Or paste image URL (https://...)"
        />

        <ImageUploadField
          label="Mobile Image"
          value={form.mobileImage}
          onChange={(url) => set("mobileImage", url)}
          folder="puratva/banners"
          placeholder="Optional — falls back to main image on mobile"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">CTA Button Text</label>
            <input
              value={form.ctaText}
              onChange={(e) => set("ctaText", e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green"
              placeholder="Shop Now"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CTA Link</label>
            <input
              value={form.ctaLink}
              onChange={(e) => set("ctaLink", e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green"
              placeholder="/shop"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Badge Text</label>
            <input
              value={form.badge}
              onChange={(e) => set("badge", e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green"
              placeholder="NEW  /  SALE"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sort Order</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => set("sortOrder", e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Starts At</label>
            <input
              type="datetime-local"
              value={form.startsAt}
              onChange={(e) => set("startsAt", e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ends At</label>
            <input
              type="datetime-local"
              value={form.endsAt}
              onChange={(e) => set("endsAt", e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => set("isActive", e.target.checked)}
            className="w-4 h-4 accent-puratva-green"
          />
          <span className="text-sm font-medium">Active</span>
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-puratva-green text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-puratva-green-dark transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : form.id ? "Update Banner" : "Create Banner"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/banners")}
          className="border px-6 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
