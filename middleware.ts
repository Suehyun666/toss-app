import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('is_logged_in');

  // If user is not logged in, redirect to login page
  if (!isLoggedIn) {
    // Pass the original URL so we can redirect back after login if we wanted to
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/insurance/contracts/:path*',
    '/insurance/claims/:path*'
  ],
};
