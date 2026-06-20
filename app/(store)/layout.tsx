import { getSiteConfig } from "@/lib/site-config";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const config = await getSiteConfig();
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
      />
      <CartDrawer />
      <main className="min-h-screen">{children}</main>
      <Footer config={config} />
    </>
  );
}
