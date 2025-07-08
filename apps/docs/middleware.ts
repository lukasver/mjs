import { middleware as nextraMiddleware } from 'nextra/locales';
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.includes('_vercel')) {
    return NextResponse.next();
  }
  return nextraMiddleware(req);
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: [
    '/((?!api|opengraph-image|sitemap|web|_vercel/speed-insights/script.js|speed-insights|.well-known|_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|manifest|_pagefind|ingest|static|public|favicons|manifest.webmanifest).*)',
  ],
};
