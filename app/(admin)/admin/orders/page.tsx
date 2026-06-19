import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-orange-100 text-orange-700",
};

export default async function AdminOrdersPage({ searchParams }: { searchParams: any }) {
  const page = parseInt(searchParams?.page || "1");
  const status = searchParams?.status;
  const limit = 20;

  const where: any = {};
  if (status) where.status = status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground text-sm">{total} total orders</p>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        <Link href="/admin/orders" className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${!status ? "bg-puratva-green text-white" : "bg-white border hover:border-puratva-green"}`}>
          All
        </Link>
        {statuses.map((s) => (
          <Link key={s} href={`/admin/orders?status=${s}`} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${status === s ? "bg-puratva-green text-white" : "bg-white border hover:border-puratva-green"}`}>
            {s}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Order</th>
              <th className="text-left px-4 py-3 font-medium">Customer</th>
              <th className="text-left px-4 py-3 font-medium">Items</th>
              <th className="text-left px-4 py-3 font-medium">Total</th>
              <th className="text-left px-4 py-3 font-medium">Date</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-muted/20">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-medium text-puratva-green hover:underline">
                    {o.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <div>{o.user?.name || "Guest"}</div>
                  <div className="text-xs text-muted-foreground">{o.user?.email}</div>
                </td>
                <td className="px-4 py-3">{o._count.items} items</td>
                <td className="px-4 py-3 font-medium">{formatPrice(o.total)}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(o.createdAt)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[o.status]}`}>{o.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <OrderStatusUpdater id={o.id} currentStatus={o.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
