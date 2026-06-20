"use client";

import { Plus, Save, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function NewCategoryCard() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    isActive: true,
    sortOrder: "0",
  });

  const reset = () => {
    setForm({ name: "", slug: "", description: "", icon: "", isActive: true, sortOrder: "0" });
    setOpen(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm((prev) => ({ ...prev, name, slug: slugify(name) }));
  };

  const save = async () => {
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.slug.trim()) return toast.error("Slug is required");

    setSaving(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          slug: form.slug.trim(),
          description: form.description || null,
          icon: form.icon || null,
          isActive: form.isActive,
          sortOrder: Number(form.sortOrder) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to create category");
      toast.success("Category created");
      reset();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex flex-col items-center justify-center gap-3 h-full min-h-[280px] border-2 border-dashed border-puratva-green/30 rounded-2xl text-puratva-green hover:bg-puratva-green/5 transition-colors"
      >
        <div className="w-12 h-12 rounded-full bg-puratva-green/10 flex items-center justify-center">
          <Plus className="w-6 h-6" />
        </div>
        <span className="font-medium text-sm">Add Category</span>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-2xl border overflow-hidden">
      <div className="h-40 bg-puratva-green/10 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl mb-1">{form.icon || "📦"}</div>
          <span className="text-xs text-muted-foreground">New Category</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">New Category</h3>
          <button type="button" onClick={reset} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Name *</label>
            <input
              autoFocus
              value={form.name}
              onChange={handleNameChange}
              placeholder="e.g. Oils & Ghee"
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
          <label className="block text-xs font-medium text-muted-foreground mb-1">Slug *</label>
          <input
            value={form.slug}
            onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
            placeholder="oils-and-ghee"
            className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-puratva-green/30"
          />
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
          <label className="block text-xs font-medium text-muted-foreground mb-1">Icon (emoji)</label>
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
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 bg-puratva-green text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-puratva-green-dark disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving ? "Creating…" : "Create Category"}
          </button>
        </div>
      </div>
    </div>
  );
}
