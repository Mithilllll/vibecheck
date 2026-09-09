import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "@/lib/auth/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user;
  const pathname = nextUrl.pathname;

  const isAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/projects") ||
    pathname.startsWith("/settings");

  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  if (isAppRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // Skip Next internals and static files; run on app pages and APIs.
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|uploads).*)"],
};
