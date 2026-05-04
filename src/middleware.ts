import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Simple middleware that checks for the presence of a __session cookie.
 * If the cookie is missing, the user is redirected to /auth.
 * Actual auth verification happens client-side via AuthContext.
 */
export function middleware(request: NextRequest) {
  const session = request.cookies.get("__session");

  if (!session) {
    const authUrl = new URL("/auth", request.url);
    return NextResponse.redirect(authUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
