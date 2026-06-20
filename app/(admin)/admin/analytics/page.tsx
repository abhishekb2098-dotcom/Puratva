import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { TrendingUp, ShoppingBag, Users, Package, Star } from "lucide-react";

async function getData() {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return { label: d.toLocaleString("default", { month: "short" }), start: d, end: new Date(d.getFullYear(), d.getMonth() + 1, 1) };
  }).reverse();

  try {
    const [totalRevenue, totalOrders, totalCustomers, totalProducts, topProducts, monthlyData] = await Promise.all([
      prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } }),
      prisma.order.count(),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.orderItem.groupBy({
        by: ["productId", "name"],
        _sum: { quantity: true, total: true },
        orderBy: { _sum: { total: "desc" } },
        take: 5,
      }),
      Promise.all(
        months.map((m) =>
          prisma.order.aggregate({
            _sum: { total: true },
            _count: true,
            where: { paymentStatus: "PAID", createdAt: { gte: m.start, lt: m.end } },
          }).then((r) => ({ label: m.label, revenue: r._sum.total || 0, orders: r._count }))
        )
      ),
    ]);

    return { totalRevenue: totalRevenue._sum.total || 0, totalOrders, totalCustomers, totalProducts, topProducts, monthlyData };
  } catch {
    return { totalRevenue: 0, totalOrders: 0, totalCustomers: 0, totalProducts: 0, topProducts: [], monthlyData: [] };
  }
}

export default async function AnalyticsPage() {
  const { totalRevenue, totalOrders, totalCustomers, totalProducts, topProducts, monthlyData } = await getData();
  const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const maxRevenue = Math.max(...monthlyData.map((m) => m.revenue), 1);

  const stats = [
    { label: "Total Revenue", value: formatPrice(totalRevenue), icon: TrendingUp, color: "bg-green-100 text-green-600" },
    { label: "Total Orders", value: totalOrders, icon: ShoppingBag, color: "bg-blue-100 text-blue-600" },
    { label: "Customers", value: totalCustomers, icon: Users, color: "bg-orange-100 text-orange-600" },
    { label: "Avg. Order Value", value: formatPrice(avgOrder), icon: Star, color: "bg-purple-100 text-purple-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm">Sales and performance overview</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{label}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly revenue chart (bar) */}
        <div className="bg-white rounded-2xl border p-5">
          <h2 className="font-bold mb-4">Monthly Revenue (last 6 months)</h2>
          <div className="flex items-end gap-3 h-40">
            {monthlyData.map((m) => (
              <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground">{formatPrice(m.revenue)}</span>
                <div
                  className="w-full bg-puratva-green rounded-t-lg transition-all"
                  style={{ height: `${Math.max((m.revenue / maxRevenue) * 100, 4)}%` }}
                />
                <span className="text-xs font-medium">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-2xl border p-5">
          <h2 className="font-bold mb-4">Top Selling Products</h2>
          {topProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sales data yet.</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p: any, i) => (
                <div key={p.productId} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-puratva-green/10 text-puratva-green text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p._sum.quantity} units sold</div>
                  </div>
                  <div className="text-sm font-semibold">{formatPrice(p._sum.total || 0)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Monthly orders table */}
      <div className="bg-white rounded-2xl border p-5">
        <h2 className="font-bold mb-4">Monthly Breakdown</h2>
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr className="text-left text-muted-foreground">
              <th className="pb-3 font-medium">Month</th>
              <th className="pb-3 font-medium">Orders</th>
              <th className="pb-3 font-medium">Revenue</th>
              <th className="pb-3 font-medium">Avg. Order</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {monthlyData.map((m) => (
              <tr key={m.label}>
                <td className="py-3 font-medium">{m.label}</td>
                <td className="py-3">{m.orders}</td>
                <td className="py-3">{formatPrice(m.revenue)}</td>
                <td className="py-3">{m.orders > 0 ? formatPrice(m.revenue / m.orders) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
