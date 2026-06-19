import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/shared/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://puratva.com"),
  title: {
    default: "Puratva – Pure. Traditional. Authentic.",
    template: "%s | Puratva",
  },
  description:
    "Puratva brings you 100% natural, farm-fresh organic products — oils, ghee, pickles, pulses, dairy, and more. Directly from farmers to your home.",
  keywords: [
    "organic products",
    "farm fresh",
    "natural oils",
    "cow ghee",
    "A2 ghee",
    "organic pickles",
    "traditional food",
    "Puratva",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://puratva.com",
    siteName: "Puratva",
    title: "Puratva – Pure. Traditional. Authentic.",
    description:
      "100% natural, farm-fresh organic products. Oils, Ghee, Pickles, Pulses, Dairy & more.",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Puratva – Pure. Traditional. Authentic.",
    description: "100% natural, farm-fresh organic products.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#2d6a4f",
                color: "#fefae0",
                borderRadius: "8px",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
