"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  LayoutDashboard,
  FolderOpen,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

interface DashboardNavProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, active: true },
  { href: "#", label: "My Cases", icon: FolderOpen, disabled: true },
  { href: "#", label: "Documents", icon: FileText, disabled: true },
  { href: "#", label: "Settings", icon: Settings, disabled: true },
];

export function DashboardNav({ user }: DashboardNavProps) {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-background p-4">
      <Link href="/" className="flex items-center gap-2 mb-8 px-2">
        <Clock className="h-5 w-5 text-primary" />
        <span className="font-bold text-primary">Get More Hours</span>
      </Link>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              item.active
                ? "bg-primary/10 text-primary font-medium"
                : item.disabled
                ? "text-muted-foreground/50 cursor-not-allowed"
                : "text-muted-foreground hover:bg-muted"
            }`}
            onClick={item.disabled ? (e) => e.preventDefault() : undefined}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
            {item.disabled && (
              <Badge variant="secondary" className="ml-auto text-xs">
                Soon
              </Badge>
            )}
          </Link>
        ))}
      </nav>

      <div className="border-t pt-4 mt-4">
        <div className="px-3 mb-3">
          <p className="text-sm font-medium truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          <Badge variant="secondary" className="mt-1 text-xs">
            {user.role}
          </Badge>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
