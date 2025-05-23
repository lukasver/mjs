import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { siteConfig } from "@/data/config/site.settings";
import ListLayout from "@/layouts/ListLayoutWithTags";
import { allCoreContent } from "@shipixen/pliny/utils/contentlayer";
import { genPageMetadata } from "app/seo";
import tagData from "app/tag-data.json";
import { allBlogs } from "contentlayer/generated";
import { slug } from "github-slugger";
import { Metadata } from "next";

export async function generateMetadata(props: {
	params: Promise<{ tag: string }>;
}): Promise<Metadata> {
	const params = await props.params;
	const tag = decodeURI(params.tag);
	return genPageMetadata({
		title: tag,
		description: `${siteConfig.title} ${tag} tagged content`,
		alternates: {
			canonical: "./",
			types: {
				"application/rss+xml": `${siteConfig.siteUrl}/tags/${tag}/feed.xml`,
			},
		},
	});
}

export const generateStaticParams = async () => {
	const tagCounts = tagData as Record<string, number>;
	const tagKeys = Object.keys(tagCounts);
	const paths = tagKeys.map((tag) => ({
		tag: tag,
	}));
	return paths;
};

export default async function TagPage(props: {
	params: Promise<{ tag: string }>;
}) {
	const params = await props.params;
	const tag = decodeURI(params.tag);
	// Capitalize first letter and convert space to dash
	const title = tag[0].toUpperCase() + tag.split(" ").join("-").slice(1);
	const filteredPosts = allCoreContent(
		allBlogs.filter(
			(post) => post.tags && post.tags.map((t) => slug(t)).includes(tag),
		),
	);
	return (
		<div className="flex flex-col w-full items-center justify-between">
			<Header />
			<ListLayout posts={filteredPosts} title={`${title} posts`} />
			<Footer />
		</div>
	);
}
