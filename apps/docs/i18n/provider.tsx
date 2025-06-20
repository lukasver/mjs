'use client';

import { createContext, useContext, type ReactNode } from 'react';

/**
 * A recursive type for a dictionary, which can have string values or nested dictionaries.
 */
export type Dictionary = {
  [key: string]: string | Dictionary;
};

const TranslationsContext = createContext<Dictionary | null>(null);

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
export const useTranslations = (): { t: (key: string) => string } => {
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
  const t = (key: string): string => {
    const keys = key.split('.');
    let result: string | Dictionary | undefined = context;

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

  return { t };
};
