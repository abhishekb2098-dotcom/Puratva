import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blog.findUnique({ where: { slug, isPublished: true } });
  if (!post) notFound();

  return (
    <div className="container py-10 max-w-3xl mx-auto">
      <Link href="/blog" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="w-4 h-4" /> Back to Blog
      </Link>

      {post.image && (
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
          <Image src={post.image} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <span>{post.author}</span>
        <span>·</span>
        <span>{(post.publishedAt ?? post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
      </div>

      <h1 className="text-3xl font-display font-bold text-puratva-green-dark mb-6">{post.title}</h1>

      <div
        className="prose prose-green max-w-none text-muted-foreground leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
