import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { verifyAuthToken } from './app/api/auth/login/route';

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath =
    pathname === '/login' ||
    pathname.startsWith('/login/') ||
    pathname === '/api/auth/login' ||
    pathname.startsWith('/_next') ||
    pathname.includes('favicon');

  if (isPublicPath) {
    return NextResponse.next();
  }

  const sitePassword = process.env.SITE_PASSWORD;
  if (!sitePassword) {
    // No password configured — site is public, skip auth check.
    return intlMiddleware(request);
  }

  const cookie = request.cookies.get('site_auth');
  const isAuthenticated = cookie?.value
    ? verifyAuthToken(cookie.value, sitePassword)
    : false;

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
