import Link from "next/link";
import { Leaf } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-puratva-cream flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-puratva-green rounded-full flex items-center justify-center mx-auto mb-6">
          <Leaf className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-8xl font-display font-bold text-puratva-green mb-2">404</h1>
        <h2 className="text-2xl font-bold text-puratva-green-dark mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          Looks like this page has gone back to nature. Let's get you back to something fresh.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="bg-puratva-green text-white px-6 py-3 rounded-xl font-medium hover:bg-puratva-green-dark transition-colors">
            Go Home
          </Link>
          <Link href="/shop" className="border border-puratva-green text-puratva-green px-6 py-3 rounded-xl font-medium hover:bg-puratva-green/5 transition-colors">
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
