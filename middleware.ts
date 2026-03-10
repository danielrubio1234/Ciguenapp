import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Privy auth is handled client-side via React hooks.
// This middleware does a lightweight cookie check as a first pass.
// Full auth validation happens inside each protected page/component via usePrivy().
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for Privy session cookie
  const privyToken = request.cookies.get("privy-token")?.value;

  if (!privyToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding"],
};
