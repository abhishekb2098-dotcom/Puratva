"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Product deleted");
        router.refresh();
      } else {
        toast.error("Failed to delete product");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <button onClick={handleDelete} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group">
      <Trash2 className="w-4 h-4 text-muted-foreground group-hover:text-red-500" />
    </button>
  );
}
