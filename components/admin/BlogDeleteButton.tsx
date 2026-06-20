"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function BlogDeleteButton({ id }: { id: string }) {
  const router = useRouter();

  const del = async () => {
    if (!confirm("Delete this blog post?")) return;
    const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      toast.success("Post deleted");
      router.refresh();
    } else {
      toast.error(json.error ?? "Failed to delete");
    }
  };

  return (
    <button onClick={del} className="p-1.5 hover:bg-red-50 rounded-lg group">
      <Trash2 className="w-4 h-4 text-muted-foreground group-hover:text-red-500" />
    </button>
  );
}
