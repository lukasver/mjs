"use client";

import { ThemeProvider } from "next-themes";
import { metadata } from "../common/config/site";

export function ThemeProviders({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider attribute="class" defaultTheme={metadata.theme} enableSystem>
			{children}
		</ThemeProvider>
	);
}
