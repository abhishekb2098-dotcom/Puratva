"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, Truck } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

// TODO: Uncomment when Razorpay credentials are available
// declare global {
//   interface Window { Razorpay: any }
// }

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"address" | "payment">("address");
  const [address, setAddress] = useState({
    fullName: session?.user?.name || "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const subtotal = totalPrice();
  const shipping = subtotal >= 499 ? 0 : 49;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (!session) router.push("/auth/login?redirect=/checkout");
    if (items.length === 0) router.push("/cart");
  }, [session, items]);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  // TODO: Uncomment and replace with real Razorpay integration when credentials are available
  const handlePayment = async () => {
    toast.error("Payment gateway not configured yet. Please check back soon.");
  };

  // const handlePayment = async () => {
  //   setLoading(true);
  //   try {
  //     const orderRes = await fetch("/api/payment", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ amount: total, items, address }),
  //     });
  //     const orderData = await orderRes.json();
  //     if (!orderData.success) throw new Error(orderData.error);

  //     const options = {
  //       key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  //       amount: orderData.razorpayOrder.amount,
  //       currency: "INR",
  //       name: "Puratva",
  //       description: "Organic Products Order",
  //       order_id: orderData.razorpayOrder.id,
  //       handler: async (response: any) => {
  //         const verifyRes = await fetch("/api/payment/verify", {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({
  //             ...response,
  //             orderId: orderData.orderId,
  //           }),
  //         });
  //         const verifyData = await verifyRes.json();
  //         if (verifyData.success) {
  //           clearCart();
  //           toast.success("Order placed successfully!");
  //           router.push(`/orders/${orderData.orderId}`);
  //         } else {
  //           toast.error("Payment verification failed");
  //         }
  //       },
  //       prefill: {
  //         name: address.fullName,
  //         email: session?.user?.email,
  //         contact: address.phone,
  //       },
  //       theme: { color: "#2d6a4f" },
  //     };

  //     const rzp = new window.Razorpay(options);
  //     rzp.open();
  //   } catch (err: any) {
  //     toast.error(err.message || "Payment failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <>
      {/* <script src="https://checkout.razorpay.com/v1/checkout.js" async /> */}
      <div className="container py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-3xl font-bold">Checkout</h1>
            <div className="flex items-center gap-3 text-sm">
              {["Address", "Payment"].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    (i === 0 && step === "address") || (i === 1 && step === "payment")
                      ? "bg-puratva-green text-white"
                      : i === 0 && step === "payment"
                      ? "bg-green-100 text-green-700"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {i + 1}
                  </div>
                  <span className={i === 0 ? "text-foreground" : step === "payment" ? "text-foreground" : "text-muted-foreground"}>{s}</span>
                  {i === 0 && <div className="w-8 h-px bg-border" />}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {step === "address" && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl border p-6">
                  <h2 className="font-display text-xl font-bold mb-5 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-puratva-green" /> Delivery Address
                  </h2>
                  <form onSubmit={handleAddressSubmit} className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Full Name", key: "fullName", span: 2 },
                      { label: "Phone", key: "phone", span: 1 },
                      { label: "Address Line 1", key: "line1", span: 2 },
                      { label: "Address Line 2 (Optional)", key: "line2", span: 2 },
                      { label: "City", key: "city", span: 1 },
                      { label: "State", key: "state", span: 1 },
                      { label: "PIN Code", key: "pincode", span: 1 },
                    ].map(({ label, key, span }) => (
                      <div key={key} className={`${span === 2 ? "col-span-2" : ""}`}>
                        <label className="block text-sm font-medium mb-1">{label}</label>
                        <input
                          type="text"
                          value={address[key as keyof typeof address]}
                          onChange={(e) => setAddress((a) => ({ ...a, [key]: e.target.value }))}
                          required={label !== "Address Line 2 (Optional)"}
                          className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-puratva-green/30"
                        />
                      </div>
                    ))}
                    <div className="col-span-2">
                      <button type="submit" className="w-full bg-puratva-green text-white font-bold py-3 rounded-xl hover:bg-puratva-green-dark transition-colors">
                        Continue to Payment
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === "payment" && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="bg-white rounded-2xl border p-6">
                    <h2 className="font-display text-xl font-bold mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-puratva-green" /> Secure Payment
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">Payment gateway coming soon. Your order details are saved.</p>
                    <div className="bg-puratva-cream rounded-xl p-4 text-sm space-y-1 mb-5">
                      <div className="font-medium">Delivering to:</div>
                      <div className="text-muted-foreground">{address.fullName}, {address.phone}</div>
                      <div className="text-muted-foreground">{address.line1}, {address.city}, {address.state} - {address.pincode}</div>
                      <button onClick={() => setStep("address")} className="text-puratva-green text-xs hover:underline mt-1">Change Address</button>
                    </div>
                    <button
                      onClick={handlePayment}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-puratva-green text-white font-bold py-4 rounded-xl hover:bg-puratva-green-dark transition-colors text-lg disabled:opacity-70"
                    >
                      <CreditCard className="w-5 h-5" />
                      {loading ? "Processing..." : `Pay ${formatPrice(total)}`}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl border p-6 h-fit">
              <h3 className="font-display font-bold mb-4">Order Summary</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex gap-3 items-center">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                      <Image src={item.image || "/images/placeholder.jpg"} alt={item.name} fill className="object-cover" />
                      <span className="absolute -top-1 -right-1 bg-puratva-green text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium line-clamp-1">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{formatPrice(item.price)}</p>
                    </div>
                    <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shipping)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">GST</span><span>{formatPrice(tax)}</span></div>
                <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                  <span>Total</span><span className="text-puratva-green-dark">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
