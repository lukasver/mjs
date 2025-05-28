import { routing } from '@/lib/i18n/routing';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import '@/css/styles.css';
import { siteConfig } from '@/data/config/site.settings';
import { Metadata } from 'next';
import { ThemeProviders } from '../theme-providers';

import { AnalyticsWrapper } from '@/components/Analytics';
import { getLangDir } from 'rtl-detect';

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
    <html dir={direction} lang={locale}>
      <body className='flex flex-col bg-white text-black antialiased dark:bg-gray-950 dark:text-white min-h-screen'>
        <NextIntlClientProvider>
          <ThemeProviders>
            <AnalyticsWrapper />

            <div className='w-full flex flex-col justify-between items-center font-sans'>
              {/* <SearchProvider> */}
              <main className='w-full flex flex-col items-center mb-auto'>
                {children}
              </main>
              {modals}
              {/* </SearchProvider> */}
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
    // images: [siteConfig.socialBanner],
    locale: 'en',
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
    // images: [siteConfig.socialBanner],
  },
};
