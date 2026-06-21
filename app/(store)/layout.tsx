import { getSiteConfig } from "@/lib/site-config";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

export const dynamic = "force-dynamic";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [config, dbCategories] = await Promise.all([
    getSiteConfig(),
    prisma.category.findMany({
      where: { isActive: true },
      select: { name: true, slug: true, icon: true },
      orderBy: { sortOrder: "asc" },
    }).catch(() => []),
  ]);

  const categories = dbCategories.map((c) => ({ name: c.name, slug: c.slug, icon: c.icon ?? "" }));

  return (
    <>
      <Navbar
        storeName={config.storeName}
        tagline={config.navTagline}
        logoUrl={config.logoUrl}
        logoSize={config.logoSize}
        phone={config.phone}
        topBarEnabled={config.topBarEnabled}
        topBarLeft={config.topBarLeft}
        topBarBadge={config.topBarBadge}
        topBarAnimation={config.topBarAnimation}
        navLinks={config.navLinks}
        categories={categories}
      />
      <CartDrawer />
      <main className="min-h-screen">{children}</main>
      <Footer config={config} categories={categories} />
    </>
  );
}
