import BannerForm from "@/components/admin/BannerForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewBannerPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/banners" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ChevronLeft className="w-4 h-4" /> Back to Banners
        </Link>
        <h1 className="text-2xl font-bold">Add Banner</h1>
        <p className="text-muted-foreground text-sm">Create a new homepage banner</p>
      </div>
      <BannerForm />
    </div>
  );
}
