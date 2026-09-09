import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
        404
      </p>
      <h1 className="mt-3 text-display font-semibold tracking-tight">
        Signal lost.
      </h1>
      <p className="mt-3 max-w-md text-text-secondary">
        That route doesn&apos;t exist, or you don&apos;t have access to it.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
