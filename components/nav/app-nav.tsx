"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Logo } from "./marketing-nav";
import { cn } from "@/lib/utils/cn";

interface AppNavProps {
  userName: string;
  userEmail: string;
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "New project", href: "/projects/new" },
  { label: "Settings", href: "/settings" },
];

export function AppNav({ userName, userEmail }: AppNavProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-subtle bg-bg-base/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 focus-ring rounded-md">
            <Logo />
            <span className="text-base font-semibold tracking-tight">VibeCheck</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    active
                      ? "text-text-primary bg-bg-elevated"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated/60"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span className="text-sm font-medium text-text-primary">{userName}</span>
            <span className="text-xs text-text-tertiary">{userEmail}</span>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border-default text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors focus-ring"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
