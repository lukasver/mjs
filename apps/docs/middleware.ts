export { middleware } from 'nextra/locales';

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: [
    '/((?!api|web|.well-known|_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|manifest|_pagefind|ingest|static|public|favicons|manifest.webmanifest).*)',
  ],
};
