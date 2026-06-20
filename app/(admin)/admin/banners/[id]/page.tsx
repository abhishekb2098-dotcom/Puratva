import { prisma } from "@/lib/prisma";
import BannerForm from "@/components/admin/BannerForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function EditBannerPage({ params }: Props) {
  const { id } = await params;
  const banner = await prisma.banner.findUnique({ where: { id } });
  if (!banner) notFound();

  const initial = {
    id: banner.id,
    title: banner.title,
    subtitle: banner.subtitle ?? "",
    description: banner.description ?? "",
    image: banner.image,
    mobileImage: banner.mobileImage ?? "",
    ctaText: banner.ctaText ?? "",
    ctaLink: banner.ctaLink ?? "",
    badge: banner.badge ?? "",
    isActive: banner.isActive,
    sortOrder: banner.sortOrder,
    startsAt: banner.startsAt ? banner.startsAt.toISOString().slice(0, 16) : "",
    endsAt: banner.endsAt ? banner.endsAt.toISOString().slice(0, 16) : "",
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/banners" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ChevronLeft className="w-4 h-4" /> Back to Banners
        </Link>
        <h1 className="text-2xl font-bold">Edit Banner</h1>
        <p className="text-muted-foreground text-sm">Update banner details</p>
      </div>
      <BannerForm initial={initial} />
    </div>
  );
}
