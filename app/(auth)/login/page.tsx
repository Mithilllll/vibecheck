"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/nav/marketing-nav";
import { loginSchema } from "@/lib/validations/auth";
import { ArrowLeft, Loader2 } from "lucide-react";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError("Enter a valid email and password.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false,
      });
      if (!res || res.error) {
        setError("Incorrect email or password.");
        setSubmitting(false);
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container-page py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors focus-ring rounded-md"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center text-center mb-8">
            <Logo className="h-10 w-10" />
            <h1 className="mt-5 text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Log in to continue analyzing your creative work.
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="rounded-xl border border-border-default bg-bg-raised p-6 space-y-4"
          >
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@studio.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger"
              >
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Log in"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            New to VibeCheck?{" "}
            <Link
              href="/signup"
              className="text-accent hover:text-accent-muted font-medium"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}
