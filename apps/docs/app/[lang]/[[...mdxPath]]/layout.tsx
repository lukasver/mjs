import { type ReactNode } from 'react';
import { Layout } from 'nextra-theme-docs';
import { Search } from 'nextra/components';
import { Banner } from '@/components/banner';
import { getPageMap } from 'nextra/page-map';
// import 'nextra-theme-docs/style.css';
import '@/app/styles.css';
import {
  getDictionary,
  getDirection,
  getLocaleNames,
  getTranslations,
} from '@/lib/i18n/get-dictionaries';
import { Navbar } from '@/components/header';
import { Footer } from '@/components/footer';
import { Locale } from '@/lib/i18n';
import remotePageMap from '@/data/remote-page-map.json';
import normalizePageMap from '@/lib/normalize-page-map';
import { PageMapItem } from 'nextra';
import { TranslationsProvider } from '@/lib/i18n/provider';

async function layout({
  children,
  params,
}: {
  children: ReactNode;
  params: { lang: string };
}) {
  const lang = (await params)?.lang || 'en';

  const [pageMap, t, dictionary] = await Promise.all([
    getPageMap(lang ? `/${lang}` : '/en')
      .then(async (pageMap) =>
        process.env.ENABLE_REMOTE === 'true'
          ? ([...pageMap, remotePageMap.pageMap] as PageMapItem[])
          : pageMap
      )
      .then(normalizePageMap(lang as Locale)),
    getTranslations(lang as Locale),
    getDictionary(lang as Locale),
  ]);

  return (
    <html
      // Not required, but good for SEO
      lang={lang || 'en'}
      // Required to be set
      dir={getDirection(lang) || 'ltr'}
    >
      <TranslationsProvider translations={dictionary}>
        <Layout
          i18n={getLocaleNames()}
          banner={<Banner lang={lang as Locale} />}
          navbar={<Navbar lang={lang as Locale} />}
          search={<Search placeholder={t('Global.search')} />}
          sidebar={{
            defaultOpen: true,
            defaultMenuCollapseLevel: 1,
          }}
          pageMap={pageMap}
          editLink={false}
          docsRepositoryBase='https://github.com/mahjongstars/docs'
          footer={<Footer locale={lang as Locale} />}
          navigation={true}
        >
          {children}
        </Layout>
      </TranslationsProvider>
    </html>
  );
}

export default layout;
