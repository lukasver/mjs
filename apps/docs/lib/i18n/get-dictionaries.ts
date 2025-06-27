import 'server-only';
import type { Dictionaries, Dictionary, Locale } from '.';
import { getLangDir } from 'rtl-detect';

// We enumerate all dictionaries here for better linting and TypeScript support
// We also get the default import for cleaner types
const dictionaries: Dictionaries = {
  en: () => import('@mjs/i18n/docs/en.json'),
  es: () => import('@mjs/i18n/docs/es.json'),
  fr: () => import('@mjs/i18n/docs/fr.json'),
  de: () => import('@mjs/i18n/docs/de.json'),
  it: () => import('@mjs/i18n/docs/it.json'),
  ja: () => import('@mjs/i18n/docs/ja.json'),
  ko: () => import('@mjs/i18n/docs/ko.json'),
  pt: () => import('@mjs/i18n/docs/pt.json'),
  ru: () => import('@mjs/i18n/docs/ru.json'),
  zh: () => import('@mjs/i18n/docs/zh.json'),
  cn: () => import('@mjs/i18n/docs/cn.json'),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
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
    { locale: 'it', name: 'Italiano' },
    { locale: 'ja', name: '日本語' },
    { locale: 'ko', name: '한국어' },
    { locale: 'pt', name: 'Português' },
    { locale: 'ru', name: 'Русский' },
    { locale: 'zh', name: '中文' },
    { locale: 'cn', name: '简体中文' },
  ];
};

export const getTranslations = async (lang: Locale) => {
  const dictionary = await getDictionary(lang as Locale);

  const t = (
    key: string,
    values?: { [key: string]: string | number }
  ): string => {
    const keys = key.split('.');
    let result: string | Dictionary | undefined = dictionary;

    for (const k of keys) {
      if (typeof result === 'object' && result !== null && k in result) {
        // @ts-expect-error fixme
        result = result[k as keyof typeof result] as string | Dictionary;
      } else {
        return key;
      }
    }

    if (typeof result === 'string') {
      if (!values) {
        return result;
      }

      return Object.entries(values).reduce(
        (str, [valueKey, value]) => str.replace(`{${valueKey}}`, String(value)),
        result
      );
    }

    return key;
  };

  return t;
};
