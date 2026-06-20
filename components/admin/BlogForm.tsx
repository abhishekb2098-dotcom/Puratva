"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type BlogData = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  tags: string;
  isPublished: boolean;
  metaTitle: string;
  metaDesc: string;
  publishedAt: string;
};

const empty: BlogData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image: "",
  author: "Puratva Team",
  tags: "",
  isPublished: false,
  metaTitle: "",
  metaDesc: "",
  publishedAt: "",
};

function toSlug(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function BlogForm({ initial }: { initial?: BlogData }) {
  const router = useRouter();
  const [form, setForm] = useState<BlogData>(initial ?? empty);
  const [saving, setSaving] = useState(false);

  const set = (field: keyof BlogData, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleTitleChange = (val: string) => {
    setForm((f) => ({ ...f, title: val, slug: f.id ? f.slug : toSlug(val) }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.content) {
      toast.error("Title, slug and content are required");
      return;
    }
    setSaving(true);
    try {
      const tagsArray = form.tags
        ? JSON.stringify(form.tags.split(",").map((t) => t.trim()).filter(Boolean))
        : "[]";

      const payload = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt || null,
        content: form.content,
        image: form.image || null,
        author: form.author || "Puratva Team",
        tags: tagsArray,
        isPublished: form.isPublished,
        metaTitle: form.metaTitle || null,
        metaDesc: form.metaDesc || null,
        publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : form.isPublished ? new Date().toISOString() : null,
      };

      const isEdit = !!form.id;
      const res = await fetch(isEdit ? `/api/blogs/${form.id}` : "/api/blogs", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      toast.success(isEdit ? "Blog updated" : "Blog created");
      router.push("/admin/blogs");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6 max-w-3xl">
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green"
            placeholder="Blog post title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug *</label>
          <input
            value={form.slug}
            onChange={(e) => set("slug", toSlug(e.target.value))}
            className="w-full border rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-puratva-green"
            placeholder="my-blog-post-slug"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Excerpt</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            rows={2}
            className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green"
            placeholder="Short summary shown in blog listing"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content *</label>
          <textarea
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            rows={12}
            className="w-full border rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-puratva-green"
            placeholder="Full blog content (HTML or markdown supported)"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cover Image URL</label>
          <input
            value={form.image}
            onChange={(e) => set("image", e.target.value)}
            className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green"
            placeholder="https://..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Author</label>
            <input
              value={form.author}
              onChange={(e) => set("author", e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
            <input
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green"
              placeholder="health, ayurveda, ghee"
            />
          </div>
        </div>

        <div className="border-t pt-4 space-y-3">
          <p className="text-sm font-medium text-muted-foreground">SEO</p>
          <div>
            <label className="block text-sm font-medium mb-1">Meta Title</label>
            <input
              value={form.metaTitle}
              onChange={(e) => set("metaTitle", e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green"
              placeholder="Defaults to post title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Meta Description</label>
            <textarea
              value={form.metaDesc}
              onChange={(e) => set("metaDesc", e.target.value)}
              rows={2}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green"
              placeholder="Defaults to excerpt"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-sm font-medium mb-1">Publish Date</label>
            <input
              type="datetime-local"
              value={form.publishedAt}
              onChange={(e) => set("publishedAt", e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer mt-5">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => set("isPublished", e.target.checked)}
              className="w-4 h-4 accent-puratva-green"
            />
            <span className="text-sm font-medium">Published</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-puratva-green text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-puratva-green-dark transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : form.id ? "Update Post" : "Create Post"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blogs")}
          className="border px-6 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
