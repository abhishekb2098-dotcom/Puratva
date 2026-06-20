import { prisma } from "@/lib/prisma";
import BlogForm from "@/components/admin/BlogForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  const blog = await prisma.blog.findUnique({ where: { id } });
  if (!blog) notFound();

  const parsedTags = (() => {
    try { return (JSON.parse(blog.tags) as string[]).join(", "); }
    catch { return blog.tags; }
  })();

  const initial = {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt ?? "",
    content: blog.content,
    image: blog.image ?? "",
    author: blog.author,
    tags: parsedTags,
    isPublished: blog.isPublished,
    metaTitle: blog.metaTitle ?? "",
    metaDesc: blog.metaDesc ?? "",
    publishedAt: blog.publishedAt ? blog.publishedAt.toISOString().slice(0, 16) : "",
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/blogs" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ChevronLeft className="w-4 h-4" /> Back to Blogs
        </Link>
        <h1 className="text-2xl font-bold">Edit Post</h1>
        <p className="text-muted-foreground text-sm">{blog.title}</p>
      </div>
      <BlogForm initial={initial} />
    </div>
  );
}
