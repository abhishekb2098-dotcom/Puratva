"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function OrderStatusUpdater({ id, currentStatus }: { id: string; currentStatus: string }) {
  const router = useRouter();

  const update = async (status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
    toast.success(`Order marked as ${status}`);
  };

  return (
    <select
      value={currentStatus}
      onChange={(e) => update(e.target.value)}
      className="border rounded-lg px-2 py-1 text-xs focus:outline-none"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
