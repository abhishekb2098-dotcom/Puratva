"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Image as ImageIcon, Save, Upload } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  isActive: boolean;
  sortOrder: number;
  _count: { products: number };
};

type Props = {
  category: Category;
};

export default function CategoryEditor({ category }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: category.name,
    description: category.description || "",
    image: category.image || "",
    icon: category.icon || "",
    isActive: category.isActive,
    sortOrder: String(category.sortOrder),
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "puratva/categories");

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Upload failed");
      }

      setForm((prev) => ({ ...prev, image: data.url }));
      toast.success("Image uploaded");
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/categories/${category.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          image: form.image || null,
          icon: form.icon || null,
          isActive: form.isActive,
          sortOrder: Number(form.sortOrder) || 0,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Save failed");
      }

      router.refresh();
      toast.success("Category saved");
    } catch (error: any) {
      toast.error(error.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border overflow-hidden">
      <div className="relative h-40 bg-muted">
        {form.image ? (
          <Image src={form.image} alt={form.name} fill className="object-cover" />
        ) : (
          <div className="h-full flex items-center justify-center">
            <ImageIcon className="w-10 h-10 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-puratva-green shadow-sm">
          {category._count.products} products
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-[1fr_auto] gap-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Order</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: e.target.value }))}
              className="w-20 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green/30"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            rows={2}
            className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-puratva-green/30"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Image URL</label>
          <input
            value={form.image}
            onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
            placeholder="/uploads/categories/example.png"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green/30"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Icon (emoji or text)</label>
          <input
            value={form.icon}
            onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
            placeholder="🫒"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green/30"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
              className="rounded border-muted"
            />
            Active
          </label>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted cursor-pointer">
              <Upload className="w-4 h-4" />
              {uploading ? "Uploading" : "Upload"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadImage(file);
                  e.currentTarget.value = "";
                }}
              />
            </label>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 bg-puratva-green text-white rounded-lg px-3 py-2 text-sm font-medium hover:bg-puratva-green-dark disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
