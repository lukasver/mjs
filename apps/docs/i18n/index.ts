import type EnglishLocale from '@mjs/i18n/messages/en';

export const i18n = {
  defaultLocale: 'en',
  // Configure the application locales here
  locales: ['en', 'es', 'fr', 'de'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

export type Dictionary = typeof EnglishLocale;

export type Dictionaries = Record<
  Locale,
  () => Promise<{ default: Dictionary }>
>;
