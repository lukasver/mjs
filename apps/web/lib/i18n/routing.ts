import { defineRouting } from 'next-intl/routing';
import { DEFAULT_LOCALES } from '@mjs/i18n';

export const getLocales = () => {
  return DEFAULT_LOCALES;
};

export const routing = defineRouting({
  localeDetection: true,
  localePrefix: 'as-needed',
  // A list of all locales that are supported
  locales: getLocales(),

  // Used when no locale matches
  defaultLocale: 'en',
});
