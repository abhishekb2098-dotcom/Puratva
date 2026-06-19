"use client";

import { signOut } from "next-auth/react";
import { Bell, LogOut, User } from "lucide-react";
import { getInitials } from "@/lib/utils";

type Props = { user: any };

export default function AdminHeader({ user }: Props) {
  return (
    <header className="bg-white border-b h-14 flex items-center justify-between px-6 shrink-0">
      <div className="text-sm text-muted-foreground">
        Welcome back, <span className="font-semibold text-foreground">{user?.name || "Admin"}</span>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-muted rounded-lg relative">
          <Bell className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-puratva-green text-white rounded-full flex items-center justify-center text-xs font-bold">
            {getInitials(user?.name || "Admin")}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
