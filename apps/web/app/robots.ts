import { siteConfig } from "@/data/config/site.settings";
import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
		host: siteConfig.siteUrl,
	};
}
