import fs from "node:fs";
import { isFolder } from "@/lib/normalize-page-map";
import { metadata as siteConfig } from "@/lib/site-config";
import { getLocaleNames } from "@mjs/i18n";
import { MetadataRoute } from "next";
import { PageMapItem } from "nextra";
import { getPageMap } from "nextra/page-map";
export const dynamic = "force-static";

type SitemapItem = MetadataRoute.Sitemap[number];

const BASE_PRIORITY = 1;
const PRIORITY_DECREMENT = 0.1;
const MIN_PRIORITY = 0.1;

interface ParseSitemapOptions {
	page: PageMapItem;
	locales: string[];
	depth?: number;
}

const getRouteFromPage = (page: PageMapItem): string => {
	if (!("route" in page)) {
		return "";
	}

	let route = page.route.startsWith("/") ? page.route : `/${page.route}`;

	// remove trailing slash
	if (route.endsWith("/")) {
		route = route.slice(0, -1);
	}

	return route;
};

const calculatePriority = (depth: number = 0): number => {
	const priority = BASE_PRIORITY - depth * PRIORITY_DECREMENT;
	return Math.max(priority, MIN_PRIORITY);
};

const parseSitemapItem = ({
	page,
	locales,
	depth = 0,
}: ParseSitemapOptions): SitemapItem[] => {
	const siteUrl = siteConfig.siteUrl;
	const route = getRouteFromPage(page);

	// Skip special routes and non-searchable pages
	if (
		!route ||
		route.startsWith("/_") ||
		route.startsWith("_") ||
		(page && "frontMatter" in page && page.frontMatter?.searchable === false)
	) {
		return [];
	}

	if (isFolder(page)) {
		return page.children.flatMap((child) =>
			parseSitemapItem({
				page: child,
				locales,
				depth: depth + 1,
			}),
		);
	}

	return [
		{
			url: `${siteUrl}${route}`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: calculatePriority(route === "/" ? 1 : depth + 1),
			alternates: {
				languages: locales.reduce(
					(acc, locale) => {
						if (locale === "en") {
							return acc;
						}
						acc[locale] = `${siteUrl}/${locale}${route}`;
						return acc;
					},
					{} as Record<string, string>,
				),
			},
		},
	];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const locales = getLocaleNames()
		.map((locale) => locale.locale)
		.filter((locale) => locale !== "en");

	// Filter relevant pages
	const pageMap = (await getPageMap(`/en`))?.filter(
		(page) => page && "route" in page,
	);

	const routes = pageMap.flatMap((page) =>
		parseSitemapItem({
			page,
			locales,
		}),
	);

	const result: MetadataRoute.Sitemap = [
		{
			url: siteConfig.siteUrl,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
			alternates: {
				languages: locales.reduce(
					(acc, locale) => {
						if (locale === "en") {
							return acc;
						}
						acc[locale] = `${siteConfig.siteUrl}/${locale}`;
						return acc;
					},
					{} as Record<string, string>,
				),
			},
		},
		...routes.sort((a, b) => (b?.priority ?? 0) - (a?.priority ?? 0)),
	];

	if (process.env.DEBUG === "true") {
		fs.writeFileSync("./test.json", JSON.stringify(result, null, 2));
	}
	return result;
}
