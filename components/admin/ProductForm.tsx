"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import toast from "react-hot-toast";
import { Upload, X, Plus, Minus } from "lucide-react";
import { slugify } from "@/lib/utils";

const PRODUCT_STATUSES = [
  { value: "active",       label: "Active",       color: "bg-green-100 text-green-700"  },
  { value: "out_of_stock", label: "Out of Stock",  color: "bg-red-100 text-red-700"     },
  { value: "coming_soon",  label: "Coming Soon",   color: "bg-yellow-100 text-yellow-700" },
] as const;

const nanToUndefined = z.preprocess(
  (v) => (typeof v === "number" && isNaN(v)) ? undefined : v,
  z.number().positive().optional()
);

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  shortDesc: z.string().optional(),
  price: z.number().positive(),
  comparePrice: nanToUndefined,
  sku: z.string().optional(),
  stock: z.preprocess((v) => (typeof v === "number" && isNaN(v)) ? 0 : v, z.number().min(0)),
  unit: z.string().default("kg"),
  weight: nanToUndefined,
  categoryId: z.string().min(1),
  subCategoryId: z.string().optional(),
  status: z.enum(["active", "out_of_stock", "coming_soon"]).default("active"),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isOrganic: z.boolean().default(true),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  product?: any;
  categories: any[];
  isNew: boolean;
};

export default function ProductForm({ product, categories, isNew }: Props) {
  const router = useRouter();
  const [images, setImages] = useState<{ url: string; isPrimary: boolean; id?: string }[]>(
    product?.images || []
  );
  const [variants, setVariants] = useState<{ name: string; value: string; price: string; stock: string }[]>(
    product?.variants?.map((v: any) => ({ name: v.name, value: v.value, price: String(v.price || ""), stock: String(v.stock) })) || []
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(product?.categoryId || "");

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...product,
      price: product?.price || 0,
      stock: product?.stock || 0,
      status: product?.status || "active",
      // Normalize DB nulls so Zod doesn't receive null for string-optional fields
      sku:           product?.sku           ?? "",
      unit:          product?.unit          ?? "kg",
      subCategoryId: product?.subCategoryId ?? "",
      shortDesc:     product?.shortDesc     ?? "",
      metaTitle:     product?.metaTitle     ?? "",
      metaDesc:      product?.metaDesc      ?? "",
      comparePrice:  product?.comparePrice  ?? undefined,
      weight:        product?.weight        ?? undefined,
    },
  });

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) {
          setImages((prev) => [...prev, { url: data.url, isPrimary: prev.length === 0 }]);
        }
      }
      toast.success("Images uploaded!");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      const payload = { ...data, images, variants };
      const url = isNew ? "/api/products" : `/api/products/${product.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(isNew ? "Product created!" : "Product updated!");
        router.push("/admin/products");
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const nameValue = watch("name");
  const statusValue = watch("status");
  const isComingSoon = statusValue === "coming_soon";
  const isRestricted = statusValue === "coming_soon" || statusValue === "out_of_stock";

  const autofillSlug = () => {
    if (nameValue && isNew) setValue("slug", slugify(nameValue));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-6">
      {/* Main content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl border p-6 space-y-4">
          <h2 className="font-bold text-lg">Basic Information</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Product Name *</label>
            <input
              {...register("name")}
              onBlur={autofillSlug}
              className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-puratva-green/30"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug (URL) *</label>
            <input
              {...register("slug")}
              className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-puratva-green/30 font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Short Description</label>
            <input
              {...register("shortDesc")}
              className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-puratva-green/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Full Description *</label>
            <textarea
              {...register("description")}
              rows={6}
              className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-puratva-green/30"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl border p-6 space-y-4">
          <h2 className="font-bold text-lg">Pricing & Inventory</h2>
          {isRestricted && (
            <div className={`border rounded-xl px-4 py-2.5 text-sm ${isComingSoon ? "bg-yellow-50 border-yellow-200 text-yellow-700" : "bg-red-50 border-red-200 text-red-700"}`}>
              Stock, unit, SKU and weight are hidden for <strong>{isComingSoon ? "Coming Soon" : "Out of Stock"}</strong> products.
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price (₹) *</label>
              <input
                {...register("price", { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-puratva-green/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Compare Price (₹)</label>
              <input
                {...register("comparePrice", { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-puratva-green/30"
              />
            </div>
            {!isRestricted && (<>
            <div>
              <label className="block text-sm font-medium mb-1">Stock *</label>
              <input
                {...register("stock", { valueAsNumber: true })}
                type="number"
                className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-puratva-green/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Unit</label>
              <input
                {...register("unit")}
                placeholder="kg, litre, g, ml..."
                className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-puratva-green/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">SKU</label>
              <input {...register("sku")} className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-puratva-green/30" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Weight (g)</label>
              <input {...register("weight", { valueAsNumber: true })} type="number" className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-puratva-green/30" />
            </div>
            </>)}
          </div>
        </div>

        {/* Variants — hidden for Coming Soon and Out of Stock */}
        {!isRestricted && <div className="bg-white rounded-2xl border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Product Variants</h2>
            <button type="button" onClick={() => setVariants([...variants, { name: "", value: "", price: "", stock: "0" }])} className="flex items-center gap-1 text-sm text-puratva-green hover:underline">
              <Plus className="w-4 h-4" /> Add Variant
            </button>
          </div>
          {variants.map((v, i) => (
            <div key={i} className="flex gap-2 mb-2 items-end">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">Name (e.g. Size)</label>
                <input value={v.name} onChange={(e) => { const n = [...variants]; n[i].name = e.target.value; setVariants(n); }} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" placeholder="Size" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">Value (e.g. 500ml)</label>
                <input value={v.value} onChange={(e) => { const n = [...variants]; n[i].value = e.target.value; setVariants(n); }} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" placeholder="500ml" />
              </div>
              <div className="w-24">
                <label className="text-xs text-muted-foreground">Price (₹)</label>
                <input value={v.price} onChange={(e) => { const n = [...variants]; n[i].price = e.target.value; setVariants(n); }} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" placeholder="0" />
              </div>
              <div className="w-20">
                <label className="text-xs text-muted-foreground">Stock</label>
                <input value={v.stock} onChange={(e) => { const n = [...variants]; n[i].stock = e.target.value; setVariants(n); }} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" placeholder="0" />
              </div>
              <button type="button" onClick={() => setVariants(variants.filter((_, j) => j !== i))} className="pb-1">
                <X className="w-4 h-4 text-red-400" />
              </button>
            </div>
          ))}
        </div>}

        {/* Images */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-bold text-lg mb-4">Product Images</h2>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-puratva-green/30 rounded-xl p-8 cursor-pointer hover:bg-puratva-cream/50 transition-colors mb-4">
            <Upload className="w-8 h-8 text-puratva-green mb-2" />
            <span className="text-sm font-medium">{uploading ? "Uploading..." : "Click to upload images"}</span>
            <span className="text-xs text-muted-foreground">PNG, JPG, GIF, WebP up to 10MB each</span>
            <input type="file" accept="image/*,.gif" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
          </label>
          <div className="grid grid-cols-4 gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                <div className="relative aspect-square rounded-xl overflow-hidden border">
                  {img.url.toLowerCase().endsWith(".gif") ? (
                    // Use <img> for GIFs to preserve animation
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Image src={img.url} alt="" fill className="object-cover" unoptimized={img.url.includes("data:")} />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                  <button type="button" onClick={() => setImages(images.map((im, j) => ({ ...im, isPrimary: j === i })))} className="text-white text-xs bg-puratva-green px-2 py-1 rounded">
                    {img.isPrimary ? "✓ Primary" : "Set Primary"}
                  </button>
                  <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))} className="text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {img.isPrimary && (
                  <span className="absolute bottom-1 left-1 bg-puratva-green text-white text-xs px-1.5 py-0.5 rounded">Primary</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-2xl border p-6 space-y-4">
          <h2 className="font-bold text-lg">SEO</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Meta Title</label>
            <input {...register("metaTitle")} className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-puratva-green/30" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Meta Description</label>
            <textarea {...register("metaDesc")} rows={2} className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-puratva-green/30" />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-5">
        <div className="bg-white rounded-2xl border p-5">
          <h3 className="font-bold mb-4">Organization</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select
                {...register("categoryId")}
                onChange={(e) => { register("categoryId").onChange(e); setSelectedCategoryId(e.target.value); setValue("subCategoryId", ""); }}
                className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green/30"
              >
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            {selectedCategory?.subCategories?.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-1">Sub Category</label>
                <select {...register("subCategoryId")} className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green/30">
                  <option value="">None</option>
                  {selectedCategory.subCategories.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-5">
          <h3 className="font-bold mb-3">Availability</h3>
          <div className="grid grid-cols-1 gap-2">
            {PRODUCT_STATUSES.map(({ value, label, color }) => (
              <label key={value} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-muted/50">
                <input
                  type="radio"
                  value={value}
                  {...register("status")}
                  className="accent-puratva-green"
                />
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-5">
          <h3 className="font-bold mb-4">Product Flags</h3>
          <div className="space-y-3">
            {[
              { key: "isActive", label: "Active (visible in store)" },
              { key: "isOrganic", label: "Organic Certified" },
              { key: "isFeatured", label: "Featured" },
              { key: "isBestSeller", label: "Best Seller" },
              { key: "isNewArrival", label: "New Arrival" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...register(key as any)} className="w-4 h-4 accent-puratva-green" />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-puratva-green text-white font-bold py-3 rounded-xl hover:bg-puratva-green-dark transition-colors disabled:opacity-70"
        >
          {saving ? "Saving..." : isNew ? "Create Product" : "Update Product"}
        </button>
      </div>
    </form>
  );
}
