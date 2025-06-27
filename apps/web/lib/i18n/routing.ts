import { defineRouting } from 'next-intl/routing';

export const getLocales = () => {
  return ['en', 'de', 'es', 'fr', 'cn', 'pt', 'it', 'ja', 'ko', 'ru', 'zh'];
};

export const routing = defineRouting({
  localeDetection: true,
  localePrefix: 'as-needed',
  // A list of all locales that are supported
  locales: getLocales(),

  // Used when no locale matches
  defaultLocale: 'en',
});
