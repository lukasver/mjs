'use client';

import { createContext, useCallback, useContext, type ReactNode } from 'react';

/**
 * A recursive type for a dictionary, which can have string values or nested dictionaries.
 */
export type Dictionary = {
  [key: string]: string | Dictionary;
};

const TranslationsContext = createContext<Dictionary | null>(null);

type Tfn = (key: string, values?: { [key: string]: string | number }) => string;

/**
 * Provides the translations to its children components.
 * @param {object} props - The properties for the component.
 * @param {ReactNode} props.children - The child components.
 * @param {Dictionary} props.translations - The dictionary of translations.
 * @returns {JSX.Element} The provider component.
 */
export const TranslationsProvider = ({
  children,
  translations,
}: {
  children: ReactNode;
  translations: Dictionary;
}) => {
  return (
    <TranslationsContext.Provider value={translations}>
      {children}
    </TranslationsContext.Provider>
  );
};

/**
 * A hook to access the translations.
 * It must be used within a `TranslationsProvider`.
 * @returns {{ t: (key: string) => string }} An object with a `t` function.
 */
export const useTranslations = (): { t: Tfn } => {
  const context = useContext(TranslationsContext);

  if (context === null) {
    throw new Error(
      'useTranslations must be used within a TranslationsProvider'
    );
  }

  /**
   * Translates a given key into a string.
   * It uses dot notation to access nested translations.
   * @param {string} key - The key for the translation (e.g., 'home.title').
   * @returns {string} The translated string, or the key itself if not found.
   */
  const t = useCallback(
    (key: Parameters<Tfn>[0], values?: Parameters<Tfn>[1]): ReturnType<Tfn> => {
      const keys = key.split('.');
      let result: string | Dictionary | undefined = context;

      // console.debug('🚀 ~ provider.tsx:59 ~ context:', context);

      for (const k of keys) {
        if (typeof result === 'object' && result !== null && k in result) {
          result = result[k] as string | Dictionary;
        } else {
          return key;
        }
      }

      if (typeof result === 'string') {
        if (!values) {
          return result;
        }

        return Object.entries(values).reduce(
          (str, [valueKey, value]) =>
            str.replace(`{${valueKey}}`, String(value)),
          result
        );
      }

      return key;
    },
    [!!context]
  );

  return { t };
};
