import type EnglishLocale from '@mjs/i18n/docs/en.json';
import { DEFAULT_LOCALES } from '@mjs/i18n';

export const i18n = {
  defaultLocale: 'en',
  // Configure the application locales here
  locales: DEFAULT_LOCALES,
} as const;

export type Locale = (typeof i18n)['locales'][number];

export type Dictionary = typeof EnglishLocale;

export type Dictionaries = Record<
  Locale,
  () => Promise<{ default: Dictionary }>
>;
