import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    cookieName: process.env.NODE_ENV === 'production'
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token',
  });

  console.log(token ? "token available" : "token missing");

  const url = request.nextUrl.pathname;

  if (token && (url.startsWith('/sign-in') || url.startsWith('/sign-up') || url.startsWith('/verify') || url === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl.origin));
  }
  
  if (!token && url.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'
  ]
};