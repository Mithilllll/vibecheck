import Link from "next/link";
import { Button } from "@/components/ui/button";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-subtle/50 bg-bg-base/70 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 focus-ring rounded-md"
        >
          <Logo />
          <span className="text-base font-semibold tracking-tight">
            VibeCheck
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-text-secondary">
          <Link href="#features" className="hover:text-text-primary transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="hover:text-text-primary transition-colors">
            How it works
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex h-7 w-7 items-center justify-center rounded-md bg-bg-elevated border border-border-default ${className}`}
    >
      <div className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_rgba(163,230,53,0.6)]" />
    </div>
  );
}
