"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/nav/marketing-nav";
import { signupSchema } from "@/lib/validations/auth";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const parsed = signupSchema.safeParse({ name, email, password });
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message ?? "Invalid input";
      setError(firstIssue);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(json.error ?? "Could not create account.");
        setSubmitting(false);
        return;
      }

      // Auto sign-in after successful signup
      const signInRes = await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false,
      });
      if (!signInRes || signInRes.error) {
        router.push("/login");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
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
              Create your account
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Start vibe-checking your creative work in seconds.
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="rounded-xl border border-border-default bg-bg-raised p-6 space-y-4"
          >
            <div>
              <Label htmlFor="name" required>Name</Label>
              <Input
                id="name"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div>
              <Label htmlFor="email" required>Email</Label>
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
              <Label htmlFor="password" required>Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 chars, with letter & number"
              />
              <p className="mt-1.5 text-xs text-text-tertiary">
                At least 8 characters, with a letter and a number.
              </p>
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
                  Creating account…
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-accent hover:text-accent-muted font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
