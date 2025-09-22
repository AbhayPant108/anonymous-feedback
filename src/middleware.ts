// middleware.ts
import { NextResponse, NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl

  // Try to decode JWT
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
    cookieName:
      process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
  })

  console.log("AUTH TOKEN:", token ? token : "missing")

  // Redirect logged-in users away from auth pages
  if (
    token &&
    (pathname.startsWith("/sign-in") ||
      pathname.startsWith("/sign-up") ||
      pathname.startsWith("/verify") ||
      pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", origin))
  }

  // Redirect unauthenticated users away from dashboard
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", origin))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/dashboard/:path*", "/verify/:path*"],
}
