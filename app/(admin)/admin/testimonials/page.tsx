import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Star, MessageSquare } from "lucide-react";
import TestimonialActions from "@/components/admin/TestimonialActions";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminTestimonialsPage({ searchParams }: { searchParams: any }) {
  const status = searchParams?.status || "PENDING";
  const testimonials = await prisma.testimonial.findMany({
    where: status !== "ALL" ? { status: status as any } : {},
    orderBy: { createdAt: "desc" },
  });

  const counts = await prisma.testimonial.groupBy({
    by: ["status"],
    _count: { status: true },
  });
  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count.status]));

  const tabs = ["PENDING", "APPROVED", "REJECTED", "ALL"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <p className="text-muted-foreground text-sm">Review and approve customer testimonials</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <Link
            key={tab}
            href={`/admin/testimonials?status=${tab}`}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              status === tab ? "bg-puratva-green text-white" : "bg-white border hover:border-puratva-green"
            }`}
          >
            {tab} {countMap[tab] !== undefined ? `(${countMap[tab]})` : ""}
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl border p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-puratva-cream shrink-0">
                  {t.image ? (
                    <Image src={t.image} alt={t.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-puratva-green text-white font-bold">
                      {t.name[0]}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.location}</div>
                  <div className="flex mt-1">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className={`w-3 h-3 ${s <= t.rating ? "fill-puratva-gold text-puratva-gold" : "text-muted"}`} />
                    ))}
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${
                t.status === "APPROVED" ? "bg-green-100 text-green-700"
                : t.status === "REJECTED" ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
              }`}>
                {t.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-3 line-clamp-3 italic">"{t.content}"</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</span>
              <TestimonialActions id={t.id} status={t.status} isFeatured={t.isFeatured} />
            </div>
          </div>
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-16 text-muted-foreground bg-white rounded-2xl border">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No {status.toLowerCase()} testimonials</p>
        </div>
      )}
    </div>
  );
}
