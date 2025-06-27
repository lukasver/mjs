export { middleware } from 'nextra/locales';

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: [
    '/((?!api|opengraph-image|sitemap|web|_vercel/speed-insights/script.js|speed-insights|.well-known|_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|manifest|_pagefind|ingest|static|public|favicons|manifest.webmanifest).*)',
  ],
};
