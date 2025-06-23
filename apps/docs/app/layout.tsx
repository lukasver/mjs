import { Layout } from 'nextra-theme-docs';
import { Head, Search } from 'nextra/components';
import { Banner } from '@/components/banner';
import { getPageMap } from 'nextra/page-map';
// import 'nextra-theme-docs/style.css';
import '@/app/styles.css';
import {
  getDictionary,
  getDirection,
  getLocaleNames,
  getTranslations,
} from '../lib/i18n/get-dictionaries';
import { Metadata } from 'next';
import { Navbar } from '@/components/header';
import { Footer } from '@/components/footer';
import { fontClash, fontTeachers } from './fonts';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { PostHogProvider } from '@/components/posthog-provider';
import { TranslationsProvider } from '@/lib/i18n/provider';
import { Locale } from '@/lib/i18n';
// import { unstable_ViewTransition as ViewTransition } from 'react';

export const metadata: Metadata = {
  // Define your metadata here
  // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const lang = (await params)?.lang || 'en';
  const [dictionary, pageMap, t] = await Promise.all([
    getDictionary(lang as Locale),
    getPageMap(`/${lang}`),
    getTranslations(lang as Locale),
  ]);

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
      <Head
      // ... Your additional head options
      >
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
          <TranslationsProvider translations={dictionary}>
            {/* <ViewTransition> */}
            <Layout
              i18n={getLocaleNames()}
              banner={<Banner />}
              navbar={<Navbar lang={lang as Locale} />}
              search={<Search placeholder={t('Global.search')} />}
              pageMap={pageMap}
              editLink={false}
              docsRepositoryBase='https://github.com/mahjongstars/docs'
              footer={<Footer />}
              navigation={true}

              // ... Your additional layout options
            >
              {children}
            </Layout>
            {/* </ViewTransition> */}
          </TranslationsProvider>
        </PostHogProvider>
        {process.env.NODE_ENV === 'production' && <SpeedInsights />}
      </body>
    </html>
  );
}
