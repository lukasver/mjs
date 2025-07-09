import { siteConfig } from "@/data/config/site.settings";
import { Metadata } from "next";

interface PageSEOProps {
	title: string;
	description?: string;
	image?: string;
	canonical?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}

export function genPageMetadata({
	title,
	description,
	image,
	canonical,
	...rest
}: PageSEOProps): Metadata {
	return {
		title,
		description,
		openGraph: {
			title: `${title} | ${siteConfig.title}`,
			description: description || siteConfig.description,
			url: "./",
			siteName: siteConfig.title,
			images: image ? [image] : undefined,
			locale: "en_US",
			type: "website",
		},
		twitter: {
			title: `${title} | ${siteConfig.title}`,
			card: "summary_large_image",
			images: image ? [image] : undefined,
		},
		...(canonical
			? {
					alternates: {
						canonical,
					},
				}
			: {}),
		...rest,
	};
}
