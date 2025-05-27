import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/lib/i18n/routing';

import '@/css/styles.css';
import { siteConfig } from '@/data/config/site.settings';
import { Metadata } from 'next';
import { ThemeProviders } from '../theme-providers';

import { AnalyticsWrapper } from '@/components/Analytics';
import { SearchProvider } from '@/components/SearchProvider';
import { fontClash, fontTeachers } from '../fonts';
import { getLangDir } from 'rtl-detect';

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
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
          color='#5bbad5'
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
        <NextIntlClientProvider>
          <ThemeProviders>
            <AnalyticsWrapper />

            <div className='w-full flex flex-col justify-between items-center font-sans'>
              <SearchProvider>
                <main className='w-full flex flex-col items-center mb-auto'>
                  {children}
                </main>
              </SearchProvider>
            </div>
          </ThemeProviders>
        </NextIntlClientProvider>
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
    images: [siteConfig.socialBanner],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteConfig.siteUrl}/feed.xml`,
    },
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
    images: [siteConfig.socialBanner],
  },
};
