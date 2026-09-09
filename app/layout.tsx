import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VibeCheck — Test your creative intent before you publish",
  description:
    "Upload a visual, define the vibe you want it to communicate, and get audience-style feedback, alignment scoring, and concrete suggestions to improve it.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    title: "VibeCheck",
    description: "Test your creative intent before you publish.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning is applied here because browser extensions
    // (Dark Reader, Grammarly, ColorZilla, etc.) routinely inject attributes
    // into <html> and <body> before React hydrates. Without this, the dev
    // overlay throws a hydration mismatch on every page load for users with
    // those extensions installed. This only suppresses the warning for the
    // root element itself — child components still hydrate strictly.
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className="min-h-screen bg-bg-base text-text-primary"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
