import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Users, Package, TrendingUp, Clock, CheckCircle, XCircle, Truck } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

async function getStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  try {
    const [
      totalOrders, monthOrders,
      totalRevenue, monthRevenue,
      totalProducts, totalCustomers,
      recentOrders, pendingTestimonials,
      lowStockProducts
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID", createdAt: { gte: startOfMonth } } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { user: { select: { name: true } } },
      }),
      prisma.testimonial.count({ where: { status: "PENDING" } }),
      prisma.product.findMany({
        where: { stock: { lte: 5 }, isActive: true },
        select: { id: true, name: true, stock: true },
        take: 5,
      }),
    ]);

    return {
      totalOrders, monthOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      monthRevenue: monthRevenue._sum.total || 0,
      totalProducts, totalCustomers,
      recentOrders, pendingTestimonials, lowStockProducts,
    };
  } catch {
    return {
      totalOrders: 0, monthOrders: 0, totalRevenue: 0, monthRevenue: 0,
      totalProducts: 0, totalCustomers: 0, recentOrders: [], pendingTestimonials: 0, lowStockProducts: [],
    };
  }
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default async function AdminDashboard() {
  const {
    totalOrders, monthOrders, totalRevenue, monthRevenue,
    totalProducts, totalCustomers, recentOrders, pendingTestimonials, lowStockProducts
  } = await getStats();

  const stats = [
    { label: "Total Revenue", value: formatPrice(totalRevenue), sub: `${formatPrice(monthRevenue)} this month`, icon: TrendingUp, color: "text-green-600 bg-green-100" },
    { label: "Total Orders", value: totalOrders, sub: `${monthOrders} this month`, icon: ShoppingBag, color: "text-blue-600 bg-blue-100" },
    { label: "Products", value: totalProducts, sub: "Active products", icon: Package, color: "text-purple-600 bg-purple-100" },
    { label: "Customers", value: totalCustomers, sub: "Registered users", icon: Users, color: "text-orange-600 bg-orange-100" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome to Puratva Admin Panel</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{label}</span>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-xs text-muted-foreground mt-1">{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-puratva-green hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentOrders.map((o: any) => (
                  <tr key={o.id}>
                    <td className="py-3">
                      <Link href={`/admin/orders/${o.id}`} className="font-medium text-puratva-green hover:underline">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 text-muted-foreground">{o.user?.name || "Guest"}</td>
                    <td className="py-3 font-medium">{formatPrice(o.total)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[o.status] || "bg-gray-100 text-gray-700"}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts */}
        <div className="space-y-4">
          {pendingTestimonials > 0 && (
            <div className="bg-white rounded-2xl border p-5">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-500" /> Pending Testimonials
              </h3>
              <p className="text-2xl font-bold text-yellow-600">{pendingTestimonials}</p>
              <p className="text-sm text-muted-foreground mt-1">awaiting review</p>
              <Link href="/admin/testimonials?status=PENDING" className="text-sm text-puratva-green hover:underline mt-2 block">
                Review now â†’
              </Link>
            </div>
          )}

          {lowStockProducts.length > 0 && (
            <div className="bg-white rounded-2xl border p-5">
              <h3 className="font-bold mb-3 flex items-center gap-2 text-red-600">
                <XCircle className="w-4 h-4" /> Low Stock
              </h3>
              <ul className="space-y-2">
                {lowStockProducts.map((p: any) => (
                  <li key={p.id} className="flex justify-between text-sm">
                    <Link href={`/admin/products/${p.id}`} className="hover:text-puratva-green line-clamp-1">{p.name}</Link>
                    <span className={`font-bold ${p.stock === 0 ? "text-red-600" : "text-orange-600"}`}>
                      {p.stock === 0 ? "Out" : p.stock}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white rounded-2xl border p-5">
            <h3 className="font-bold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/admin/products/new" className="block w-full bg-puratva-green text-white text-center py-2 rounded-lg text-sm font-medium hover:bg-puratva-green-dark transition-colors">
                + Add Product
              </Link>
              <Link href="/admin/banners/new" className="block w-full border border-puratva-green text-puratva-green text-center py-2 rounded-lg text-sm font-medium hover:bg-puratva-cream transition-colors">
                + Add Banner
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
