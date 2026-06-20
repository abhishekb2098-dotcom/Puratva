import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, Mail, Phone } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?callbackUrl=/profile");

  const user = session.user as any;

  return (
    <div className="container py-10 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="bg-white rounded-2xl border p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-puratva-green/10 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-puratva-green" />
          </div>
          <div>
            <p className="font-bold text-lg">{user.name || "User"}</p>
            <p className="text-sm text-muted-foreground capitalize">{user.role?.toLowerCase() || "customer"}</p>
          </div>
        </div>

        <div className="border-t pt-4 space-y-3 text-sm">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center gap-3 text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>{user.phone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
