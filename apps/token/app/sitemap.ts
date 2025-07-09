import { metadata as siteConfig } from "@/common/config/site";
import { MetadataRoute } from "next";
export const dynamic = "force-static";

type SitemapItem = MetadataRoute.Sitemap[number];

export default function sitemap(): MetadataRoute.Sitemap {
	const siteUrl = siteConfig.siteUrl;

	const routes = [""].map(
		(route) =>
			({
				url: `${siteUrl}${route === "" ? "" : `/${route}`}`,
				lastModified: new Date(),
				changeFrequency: "weekly",
				priority: getPriority(route),
				// alternates: {
				//   languages: routing.locales.reduce((acc, locale) => {
				//     if (locale === 'en') {
				//       return acc;
				//     }
				//     acc[locale] = `${siteUrl}/${locale}${
				//       route === '' ? '' : `/${route}`
				//     }`;
				//     return acc;
				//   }, {} as Record<string, string>),
				// },
			}) as SitemapItem,
	);

	return [...routes];
}

const getPriority = (route: string) => {
	switch (route) {
		case "":
			return 1;
		case "#home":
			return 0.9;
		case "#features":
			return 0.7;
		case "#game":
			return 0.6;
		case "#characters":
			return 0.5;
		case "contact":
			return 0.8;
		default:
			return 0.5;
	}
};
