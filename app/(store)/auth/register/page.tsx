"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) { toast.error(data.error || "Registration failed"); return; }
      const loginResult = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (loginResult?.error) {
        toast.success("Account created! Please sign in.");
        router.push("/auth/login");
      } else {
        toast.success("Welcome to Puratva!");
        router.push("/");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-puratva-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-puratva-green rounded-full flex items-center justify-center mx-auto mb-3">
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold">Create Account</h1>
          <p className="text-muted-foreground mt-1">Join the Puratva organic family</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "Full Name", key: "name", type: "text", placeholder: "Your name" },
              { label: "Email", key: "email", type: "email", placeholder: "you@example.com" },
              { label: "Phone (optional)", key: "phone", type: "tel", placeholder: "+91 98765 43210" },
              { label: "Password", key: "password", type: "password", placeholder: "Min. 8 characters" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1">{label}</label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  required={key !== "phone"}
                  placeholder={placeholder}
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-puratva-green/30"
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-puratva-green text-white font-bold py-3 rounded-xl hover:bg-puratva-green-dark transition-colors disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-puratva-green font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
