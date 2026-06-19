import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
