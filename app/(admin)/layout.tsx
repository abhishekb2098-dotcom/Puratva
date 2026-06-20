import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSiteConfig } from "@/lib/site-config";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [session, config] = await Promise.all([auth(), getSiteConfig()]);
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/auth/login?redirect=/admin");
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar
        storeName={config.storeName}
        logoUrl={config.logoUrl}
        logoSize={config.logoSize}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader user={session.user} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
