'use client';

import { metadata } from '../common/config/site';
import { ThemeProvider } from 'next-themes';

export function ThemeProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute='class' defaultTheme={metadata.theme} enableSystem>
      {children}
    </ThemeProvider>
  );
}
