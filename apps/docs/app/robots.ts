import { metadata } from "@/lib/site-config";
import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: ["/", "/api/og/*"],
			disallow: ["/api/*"],
		},
		sitemap: `${metadata.siteUrl}/sitemap.xml`,
		host: metadata.siteUrl,
	};
}
