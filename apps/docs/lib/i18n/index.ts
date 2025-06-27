import type EnglishLocale from '@mjs/i18n/docs/en.json';

export const i18n = {
  defaultLocale: 'en',
  // Configure the application locales here
  locales: ['en', 'es', 'fr', 'de', 'it', 'ja', 'ko', 'pt', 'ru', 'zh', 'cn'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

export type Dictionary = typeof EnglishLocale;

export type Dictionaries = Record<
  Locale,
  () => Promise<{ default: Dictionary }>
>;
