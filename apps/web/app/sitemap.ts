import { siteConfig } from "@/data/config/site.settings";
import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
	const siteUrl = siteConfig.siteUrl;
	// const blogRoutes = allBlogs
	// 	.filter((post) => !post.draft)
	// 	.map((post) => ({
	// 		url: `${siteUrl}/${post.path}`,
	// 		lastModified: post.lastmod || post.date,
	// 	}));

	const routes = ["", "overview", "features", "faq", "blog", "contact"].map(
		(route) => ({
			url: `${siteUrl}/${route}`,
			lastModified: new Date().toISOString().split("T")[0],
		}),
	);

	return [...routes];
}
