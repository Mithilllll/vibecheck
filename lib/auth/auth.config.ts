import type { NextAuthConfig } from "next-auth";

const authConfig = {
  // Providers are added in config.ts, which runs in the Node.js runtime.
  // Keeping this list empty makes the middleware bundle Edge-compatible.
  providers: [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = !!auth?.user;
      const isAppRoute =
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/projects") ||
        pathname.startsWith("/settings");

      if (isAppRoute && !isLoggedIn) return false;
      return true;
    },
  },
} satisfies NextAuthConfig;

export default authConfig;
