import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import BannerActions from "@/components/admin/BannerActions";

export const dynamic = 'force-dynamic';

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Banners</h1>
          <p className="text-muted-foreground text-sm">Manage homepage hero banners and promotions</p>
        </div>
        <Link href="/admin/banners/new" className="flex items-center gap-2 bg-puratva-green text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-puratva-green-dark transition-colors">
          <Plus className="w-4 h-4" /> Add Banner
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {banners.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl border overflow-hidden">
            <div className="relative h-40">
              {b.image ? (
                <Image src={b.image} alt={b.title} fill className="object-cover" />
              ) : (
                <div className="h-full bg-muted flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-5">
                <div className="text-white">
                  {b.badge && <span className="bg-puratva-gold text-puratva-green-dark text-xs font-bold px-2 py-0.5 rounded-full mb-2 block w-fit">{b.badge}</span>}
                  <h3 className="font-display font-bold text-xl">{b.title}</h3>
                  {b.subtitle && <p className="text-sm text-white/80">{b.subtitle}</p>}
                </div>
              </div>
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.isActive ? "bg-green-500 text-white" : "bg-gray-400 text-white"}`}>
                  {b.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {b.ctaText && <span>CTA: {b.ctaText}</span>}
                {b.startsAt && <span className="ml-2">From: {new Date(b.startsAt).toLocaleDateString()}</span>}
                {b.endsAt && <span className="ml-2">To: {new Date(b.endsAt).toLocaleDateString()}</span>}
              </div>
              <BannerActions id={b.id} isActive={b.isActive} />
            </div>
          </div>
        ))}
      </div>

      {banners.length === 0 && (
        <div className="text-center py-16 text-muted-foreground bg-white rounded-2xl border">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No banners yet. Add your first banner!</p>
          <Link href="/admin/banners/new" className="mt-3 inline-block text-puratva-green hover:underline text-sm">Create Banner â†’</Link>
        </div>
      )}
    </div>
  );
}
