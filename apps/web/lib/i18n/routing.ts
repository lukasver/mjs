import { DEFAULT_LOCALES } from "@mjs/i18n";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	localeDetection: true,
	localePrefix: "as-needed",
	// A list of all locales that are supported
	locales: DEFAULT_LOCALES,

	// Used when no locale matches
	defaultLocale: "en",
});
