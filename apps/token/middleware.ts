import { COOKIE_PREFIX } from './common/config/constants';
import { getSessionCookie } from './lib/auth/thirdweb';
import log from './lib/services/logger.server';
import { type NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES: string[] = ['/', '/onboarding'];
const _PRIVATE_ROUTES: string[] = ['/dashboard'];

export default async (req: NextRequest) => {
  log('[MIDDLEWARE]', req.nextUrl.pathname);

  // if (PUBLIC_ROUTES.includes(req.nextUrl.pathname)) {
  //   return NextResponse.next();
  // }

  // This doesn't not check if the session cookie is valid, it only checks if it exists for faster perf
  const cookies = await getSessionCookie(req, {
    cookiePrefix: COOKIE_PREFIX,
  });

  // If no cookie is present, we should redirect to the login page
  if (!cookies) {
    if (PUBLIC_ROUTES.includes(req.nextUrl.pathname)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/', req.url));
  }

  switch (req.nextUrl.pathname) {
    case '/':
      return NextResponse.redirect(new URL('/dashboard', req.url));
    case '/dashboard':
      return NextResponse.next();
    default:
      return NextResponse.next();
  }
};

export const config = {
  matcher: [
    '/((?!api|static|sitemap|ingest|robots|manifest.webmanifest|opengraph-image|_next/static|_next/image|favicon.ico|icon*|apple-touch-*|public|static|workers|.well-known).*)',
  ],
};
