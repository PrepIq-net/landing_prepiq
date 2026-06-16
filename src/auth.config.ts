import type { NextAuthConfig } from "next-auth";

// Edge-compatible auth config — no DB imports here
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isLoginPage = nextUrl.pathname === "/admin/login";

      if (isOnAdmin && !isLoginPage) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn && isLoginPage) {
        return Response.redirect(new URL("/admin", nextUrl));
      }
      return true;
    },
  },
  providers: [], // filled in auth.ts
};
