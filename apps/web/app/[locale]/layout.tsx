import { PostHogProvider } from '@/components/PostHogProvider';
import { routing } from '@/lib/i18n/routing';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import '@/css/styles.css';
import { siteConfig } from '@/data/config/site.settings';
import { Metadata } from 'next';
import { ThemeProviders } from '../theme-providers';

import { AnalyticsWrapper } from '@/components/Analytics';
import { Toaster } from '@mjs/ui/primitives/sonner';
import { getLangDir } from 'rtl-detect';
import { fontClash, fontTeachers } from '../fonts';
import { SpeedInsights } from '@vercel/speed-insights/next';

/**
 * Generate language alternates for SEO metadata
 */
function generateLanguageAlternates() {
  const languages: Record<string, string> = {};
  routing.locales.forEach((locale) => {
    if (locale !== routing.defaultLocale) {
      // For other locales, include the locale prefix
      languages[locale] = `/${locale}`;
    }
  });
  return languages;
}

export default async function RootLayout({
  children,
  params,
  modals,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
  modals: React.ReactNode;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  const direction = getLangDir(locale);
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html
      lang={locale || siteConfig.language}
      dir={direction}
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
        <meta name='generator' content='Shipixen' />
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
      <body className='flex flex-col bg-white text-black antialiased dark:bg-gray-950 dark:text-white min-h-screen'>
        <PostHogProvider>
          <NextIntlClientProvider>
            <ThemeProviders>
              <AnalyticsWrapper />

              <div className='w-full flex flex-col justify-between items-center font-sans'>
                {/* <SearchProvider> */}
                <div className='w-full flex flex-col items-center mb-auto'>
                  {children}
                </div>
                {modals}
                {/* </SearchProvider> */}
              </div>
            </ThemeProviders>
          </NextIntlClientProvider>
        </PostHogProvider>
        {process.env.NODE_ENV === 'production' && <SpeedInsights />}
        <Toaster position='top-center' duration={2000} />
      </body>
    </html>
  );
}

// https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing#static-rendering
export function generateStaticParams() {
  const locales = routing.locales.map((locale) => ({ locale }));
  return locales;
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: './',
    siteName: siteConfig.title,
    // Commented to use opengraph-image.tsx static gen instead of api/og
    // images: [siteConfig.socialBanner],
    locale: 'en',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteConfig.siteUrl}/feed.xml`,
    },
    languages: generateLanguageAlternates(),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteConfig.title,
    card: 'summary_large_image',
    // Commented to use opengraph-image.tsx static gen instead of api/og
    // images: [siteConfig.socialBanner],
  },
};
