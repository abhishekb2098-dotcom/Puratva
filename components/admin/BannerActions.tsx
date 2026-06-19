"use client";

import { useRouter } from "next/navigation";
import { Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function BannerActions({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter();

  const toggle = async () => {
    await fetch(`/api/banners/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    router.refresh();
    toast.success(isActive ? "Banner deactivated" : "Banner activated");
  };

  const del = async () => {
    if (!confirm("Delete this banner?")) return;
    await fetch(`/api/banners/${id}`, { method: "DELETE" });
    router.refresh();
    toast.success("Banner deleted");
  };

  return (
    <div className="flex gap-2">
      <button onClick={toggle} className="p-1.5 hover:bg-muted rounded-lg" title={isActive ? "Deactivate" : "Activate"}>
        {isActive ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4 text-muted-foreground" />}
      </button>
      <Link href={`/admin/banners/${id}`} className="p-1.5 hover:bg-muted rounded-lg">
        <Edit className="w-4 h-4 text-muted-foreground" />
      </Link>
      <button onClick={del} className="p-1.5 hover:bg-red-50 rounded-lg group">
        <Trash2 className="w-4 h-4 text-muted-foreground group-hover:text-red-500" />
      </button>
    </div>
  );
}
