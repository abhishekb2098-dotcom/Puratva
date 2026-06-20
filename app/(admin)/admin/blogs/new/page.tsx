import BlogForm from "@/components/admin/BlogForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/blogs" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ChevronLeft className="w-4 h-4" /> Back to Blogs
        </Link>
        <h1 className="text-2xl font-bold">New Blog Post</h1>
        <p className="text-muted-foreground text-sm">Write and publish a new article</p>
      </div>
      <BlogForm />
    </div>
  );
}
