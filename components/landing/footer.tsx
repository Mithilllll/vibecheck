import Link from "next/link";
import { Logo } from "@/components/nav/marketing-nav";

export function Footer() {
  return (
    <footer className="py-12">
      <div className="container-page">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-sm font-semibold tracking-tight">
              VibeCheck
            </span>
          </Link>
          <div className="flex items-center gap-6 text-xs text-text-tertiary">
            <span>© {new Date().getFullYear()} VibeCheck</span>
            <Link href="#features" className="hover:text-text-secondary transition-colors">
              Features
            </Link>
            <Link href="/login" className="hover:text-text-secondary transition-colors">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
