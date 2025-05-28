import '@/css/styles.css';
import { siteConfig } from '@/data/config/site.settings';

import { fontClash, fontTeachers } from './fonts';
import { PostHogProvider } from '../components/PostHogProvider';
import { Toaster } from '@mjs/ui/primitives/sonner';

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <html
      lang={locale || siteConfig.language}
      className={`${fontClash.variable} ${fontTeachers.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel='apple-touch-icon'
          sizes='76x76'
          href='/static/favicons/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/static/favicons/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/static/favicons/favicon-16x16.png'
        />
        <link rel='manifest' href='/static/favicons/manifest.webmanifest' />
        <link
          rel='mask-icon'
          href='/static/favicons/safari-pinned-tab.svg'
          color='#4a0000'
        />
        <meta name='msapplication-TileColor' content='#000000' />
        <meta
          name='theme-color'
          media='(prefers-color-scheme: light)'
          content='#fff'
        />
        <meta
          name='theme-color'
          media='(prefers-color-scheme: dark)'
          content='#000'
        />
        <link rel='alternate' type='application/rss+xml' href='/feed.xml' />
      </head>
      <body>
        <PostHogProvider>{children}</PostHogProvider>
        <Toaster
          position='top-center'
          offset={10}
          toastOptions={{ duration: 2000 }}
        />
      </body>
    </html>
  );
}
