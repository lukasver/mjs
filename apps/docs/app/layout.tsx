import { Head } from 'nextra/components';
// import 'nextra-theme-docs/style.css';
import '@/app/styles.css';
import { getDirection } from '../lib/i18n/get-dictionaries';
import { Metadata } from 'next';
import { fontClash, fontTeachers } from './fonts';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { PostHogProvider } from '@/components/posthog-provider';
import { unstable_ViewTransition as ViewTransition } from 'react';
import { genPageMetadata } from './seo';
import { metadata as siteConfig } from '@/lib/site-config';

export const metadata: Metadata = genPageMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
});

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const lang = (await params)?.lang || 'en';

  return (
    <html
      // Not required, but good for SEO
      lang={lang || 'en'}
      // Required to be set
      dir={getDirection(lang) || 'ltr'}
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
      className={`${fontClash.variable} ${fontTeachers.variable} scroll-smooth`}
    >
      <Head>
        {/* Your additional tags should be passed as `children` of `<Head>` element */}
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
        <meta name='generator' content='Shipixen' />
        <meta name='msapplication-TileColor' content='#000000' />
        <link rel='alternate' type='application/rss+xml' href='/feed.xml' />
      </Head>
      <body>
        <PostHogProvider>
          <ViewTransition>{children}</ViewTransition>
        </PostHogProvider>
        {process.env.NODE_ENV === 'production' && <SpeedInsights />}
      </body>
    </html>
  );
}
