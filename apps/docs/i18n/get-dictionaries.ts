import 'server-only';
import type { Dictionaries, Dictionary, Locale } from '.';
import { getLangDir } from 'rtl-detect';

// We enumerate all dictionaries here for better linting and TypeScript support
// We also get the default import for cleaner types
const dictionaries: Dictionaries = {
  en: () => import('@mjs/i18n/messages/en').then((module) => module.default),
  es: () => import('@mjs/i18n/messages/es').then((module) => module.default),
  fr: () => import('@mjs/i18n/messages/fr').then((module) => module.default),
  de: () => import('@mjs/i18n/messages/de').then((module) => module.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  console.log('DICTS', dictionaries);
  const { default: dictionary } = await (
    dictionaries[locale] || dictionaries.en
  )();

  return dictionary;
}

export function getDirection(locale: string | Locale): 'ltr' | 'rtl' {
  return getLangDir(locale);
}

export const getLocaleNames = (): { locale: string; name: string }[] => {
  return [
    { locale: 'en', name: 'English' },
    { locale: 'es', name: 'Español' },
    { locale: 'fr', name: 'Français' },
    { locale: 'de', name: 'Deutsch' },
  ];
};

export const getTranslations = async () => {
  const lang = 'en';

  const dictionary = await getDictionary(lang as Locale);

  const t = (key: string): string => {
    const keys = key.split('.');
    let result: string | Dictionary | undefined = dictionary;

    for (const k of keys) {
      if (typeof result === 'object' && result !== null && k in result) {
        result = result[k] as string | Dictionary;
      } else {
        return key;
      }
    }

    if (typeof result === 'string') {
      return result;
    }

    return key;
  };

  return t;
};
