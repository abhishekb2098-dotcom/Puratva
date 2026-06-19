"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function TestimonialActions({ id, status, isFeatured }: { id: string; status: string; isFeatured: boolean }) {
  const router = useRouter();

  const update = async (data: any) => {
    await fetch(`/api/testimonials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    router.refresh();
  };

  return (
    <div className="flex gap-2">
      {status !== "APPROVED" && (
        <button onClick={() => { update({ status: "APPROVED" }); toast.success("Approved!"); }} className="p-1.5 hover:bg-green-50 rounded-lg group" title="Approve">
          <CheckCircle className="w-4 h-4 text-muted-foreground group-hover:text-green-500" />
        </button>
      )}
      {status !== "REJECTED" && (
        <button onClick={() => { update({ status: "REJECTED" }); toast.success("Rejected"); }} className="p-1.5 hover:bg-red-50 rounded-lg group" title="Reject">
          <XCircle className="w-4 h-4 text-muted-foreground group-hover:text-red-500" />
        </button>
      )}
      <button
        onClick={() => { update({ isFeatured: !isFeatured }); toast.success(isFeatured ? "Unfeatured" : "Featured!"); }}
        className={`p-1.5 rounded-lg ${isFeatured ? "bg-puratva-gold/20 text-puratva-gold" : "hover:bg-muted"}`}
        title={isFeatured ? "Remove from featured" : "Feature this"}
      >
        <Star className={`w-4 h-4 ${isFeatured ? "fill-puratva-gold text-puratva-gold" : "text-muted-foreground"}`} />
      </button>
    </div>
  );
}
