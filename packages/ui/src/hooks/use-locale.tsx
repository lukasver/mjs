'use client';
import { useState, useEffect } from 'react';

export function useLocale(
  defaultLocale: string = 'en-US',
  shouldDetect: boolean = true
): string {
  const [locale, setLocale] = useState<string>(defaultLocale);

  useEffect(() => {
    const detectLocale = (): string => {
      if (!shouldDetect) return defaultLocale;
      if (typeof window !== 'undefined' && window.navigator) {
        return (
          navigator.language ||
          (navigator.languages && navigator.languages[0]) ||
          defaultLocale
        );
      }
      return defaultLocale;
    };

    setLocale(detectLocale());
  }, [defaultLocale, shouldDetect]);

  return locale;
}
