"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Leaf, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      ...form,
      redirect: false,
    });
    if (result?.error) {
      toast.error("Invalid email or password");
    } else {
      toast.success("Welcome back!");
      router.push(redirect);
    }
    setLoading(false);
  };

  const handleGoogle = () => signIn("google", { callbackUrl: redirect });

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-puratva-green/30"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
              className="w-full border rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-puratva-green/30"
              placeholder="••••••••"
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-puratva-green text-white font-bold py-3 rounded-xl hover:bg-puratva-green-dark transition-colors disabled:opacity-70"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center"><div className="w-full border" /></div>
        <div className="relative text-center"><span className="bg-white px-3 text-sm text-muted-foreground">or</span></div>
      </div>

      <button
        onClick={handleGoogle}
        className="w-full border-2 border-border py-3 rounded-xl font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>

      <p className="text-center text-sm text-muted-foreground mt-5">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="text-puratva-green font-medium hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-puratva-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-puratva-green rounded-full flex items-center justify-center mx-auto mb-3">
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-1">Sign in to your Puratva account</p>
        </div>
        <Suspense fallback={<div className="bg-white rounded-2xl shadow-sm border p-8 animate-pulse h-80" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
