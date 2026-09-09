"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <Button
      variant="danger"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </Button>
  );
}
