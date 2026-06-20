import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, BookOpen, Edit, Trash2 } from "lucide-react";
import BlogDeleteButton from "@/components/admin/BlogDeleteButton";

export const dynamic = 'force-dynamic';

export default async function AdminBlogsPage() {
  const blogs = await prisma.blog.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Blogs</h1>
          <p className="text-muted-foreground text-sm">Manage blog posts and articles</p>
        </div>
        <Link href="/admin/blogs/new" className="flex items-center gap-2 bg-puratva-green text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-puratva-green-dark transition-colors">
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        {blogs.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No blog posts yet.</p>
            <Link href="/admin/blogs/new" className="mt-3 inline-block text-puratva-green hover:underline text-sm">
              Write your first post â†’
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Author</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {blogs.map((b) => (
                <tr key={b.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <div className="font-medium">{b.title}</div>
                    <div className="text-muted-foreground text-xs">/blog/{b.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{b.author}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${b.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {b.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {(b.publishedAt ?? b.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/admin/blogs/${b.id}`} className="p-1.5 hover:bg-muted rounded-lg">
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </Link>
                      <BlogDeleteButton id={b.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
