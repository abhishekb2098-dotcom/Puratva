"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Image as ImageIcon, Plus, Save, Trash2, Upload, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

type SubCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  isActive: boolean;
  sortOrder: number;
  subCategories: SubCategory[];
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
  const [deleting, setDeleting] = useState(false);
  const [showSubs, setShowSubs] = useState(false);
  const [subs, setSubs] = useState<SubCategory[]>(category.subCategories);
  const [newSub, setNewSub] = useState({ name: "", slug: "", isActive: true });
  const [addingSub, setAddingSub] = useState(false);
  const [showAddSub, setShowAddSub] = useState(false);

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "puratva/categories");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Upload failed");
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
      if (!res.ok || !data.success) throw new Error(data.error || "Save failed");
      router.refresh();
      toast.success("Category saved");
    } catch (error: any) {
      toast.error(error.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async () => {
    if (!confirm(`Delete "${form.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/categories/${category.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Delete failed");
      toast.success("Category deleted");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeleting(false);
    }
  };

  const addSubCategory = async () => {
    if (!newSub.name.trim()) return toast.error("Name is required");
    const slug = newSub.slug || slugify(newSub.name);
    setAddingSub(true);
    try {
      const res = await fetch("/api/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSub.name, slug, categoryId: category.id, isActive: newSub.isActive }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed");
      setSubs((prev) => [...prev, data.data]);
      setNewSub({ name: "", slug: "", isActive: true });
      setShowAddSub(false);
      toast.success("Sub-category added");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setAddingSub(false);
    }
  };

  const deleteSubCategory = async (subId: string, subName: string) => {
    if (!confirm(`Delete sub-category "${subName}"?`)) return;
    try {
      const res = await fetch(`/api/subcategories/${subId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Delete failed");
      setSubs((prev) => prev.filter((s) => s.id !== subId));
      toast.success("Sub-category deleted");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const toggleSubActive = async (sub: SubCategory) => {
    try {
      const res = await fetch(`/api/subcategories/${sub.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !sub.isActive }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed");
      setSubs((prev) => prev.map((s) => (s.id === sub.id ? { ...s, isActive: !s.isActive } : s)));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl border overflow-hidden">
      {/* Image banner */}
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
        <button
          type="button"
          onClick={deleteCategory}
          disabled={deleting}
          title="Delete category"
          className="absolute top-3 right-3 rounded-full bg-white/90 p-1.5 text-red-500 hover:bg-red-50 shadow-sm disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
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
              {uploading ? "Uploading…" : "Upload"}
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
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>

        {/* Sub-categories section */}
        <div className="border-t pt-3">
          <button
            type="button"
            onClick={() => setShowSubs(!showSubs)}
            className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <span>Sub-categories ({subs.length})</span>
            {showSubs ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {showSubs && (
            <div className="mt-3 space-y-2">
              {subs.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between gap-2 bg-muted/40 rounded-lg px-3 py-2">
                  <span className={`text-sm flex-1 ${!sub.isActive ? "line-through text-muted-foreground" : ""}`}>
                    {sub.name}
                  </span>
                  <label className="text-xs text-muted-foreground flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sub.isActive}
                      onChange={() => toggleSubActive(sub)}
                      className="rounded"
                    />
                    Active
                  </label>
                  <button
                    type="button"
                    onClick={() => deleteSubCategory(sub.id, sub.name)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {showAddSub ? (
                <div className="border rounded-lg p-3 space-y-2 bg-muted/20">
                  <input
                    autoFocus
                    placeholder="Sub-category name"
                    value={newSub.name}
                    onChange={(e) => setNewSub((prev) => ({ ...prev, name: e.target.value, slug: slugify(e.target.value) }))}
                    className="w-full border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green/30"
                  />
                  <input
                    placeholder="Slug (auto-filled)"
                    value={newSub.slug}
                    onChange={(e) => setNewSub((prev) => ({ ...prev, slug: e.target.value }))}
                    className="w-full border rounded-md px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-puratva-green/30"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={addSubCategory}
                      disabled={addingSub}
                      className="flex-1 bg-puratva-green text-white rounded-md py-1.5 text-sm font-medium disabled:opacity-60"
                    >
                      {addingSub ? "Adding…" : "Add"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowAddSub(false); setNewSub({ name: "", slug: "", isActive: true }); }}
                      className="px-3 border rounded-md text-sm hover:bg-muted"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddSub(true)}
                  className="flex items-center gap-1 text-sm text-puratva-green hover:underline"
                >
                  <Plus className="w-4 h-4" /> Add sub-category
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
