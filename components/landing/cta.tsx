import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 md:py-32 border-b border-border-subtle/60">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-2xl border border-border-default bg-bg-raised p-10 md:p-16 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(163,230,53,0.08),transparent_70%)]"
          />
          <div className="relative">
            <h2 className="text-display font-semibold tracking-tight text-balance">
              Stop guessing how your work will land.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-text-secondary text-balance">
              Get audience-style feedback in seconds and ship work that
              communicates exactly what you meant it to.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/signup">
                  Start your first VibeCheck
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="/login">I already have an account</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
