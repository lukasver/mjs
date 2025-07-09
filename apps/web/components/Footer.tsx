import { getFooterLinks } from "@/data/config/footerLinks";
import { metadata } from "@/data/config/site.settings";
import { Footer as AppFooter } from "@mjs/ui/components/footer";
import { Skeleton } from "@mjs/ui/primitives/skeleton";
import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { cn } from "@mjs/ui/lib/utils";
import { Locale } from "next-intl";
import LocaleSwitcher from "./LocaleSwitcher";

export default async function Footer({
	className,
	locale,
}: {
	className?: string;
	locale?: Locale;
}) {
	const t = await getTranslations();
	return (
		<AppFooter
			links={getFooterLinks(t, locale)}
			copyright={t("Footer.copyright", { year: new Date().getFullYear() })}
			siteConfig={metadata}
			className={cn("bg-black", className)}
		>
			<Suspense fallback={<Skeleton className="w-[125px] h-8" />}>
				<LocaleSwitcherRSC />
			</Suspense>
		</AppFooter>
	);
}

const LocaleSwitcherRSC = async () => {
	const locale = await getLocale();
	return <LocaleSwitcher currentLocale={locale} />;
};
