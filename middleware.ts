import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Use lightweight config for Edge Runtime (no DB adapter)
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding"],
};
