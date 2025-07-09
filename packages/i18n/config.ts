/**
 * Returns an array of supported locales with their display names.
 * Each locale object contains a locale code and its corresponding name in the native language.
 * @returns Array of objects containing locale codes and display names
 */
export function getLocaleNames(): { locale: string; name: string }[] {
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
  ];
}

/**
 * Gets an array of all supported locale codes except English ('en').
 * This is used to determine which locales need translation.
 * @returns Array of locale codes excluding 'en'
 */
export const DEFAULT_LOCALES = getLocaleNames()
  .map((locale) => locale.locale)
  .filter((locale) => locale !== 'en');
