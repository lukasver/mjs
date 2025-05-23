import { writeFileSync } from "fs";
import path from "path";
import {
	extractTocHeadings,
	remarkCodeTitles,
	remarkExtractFrontmatter,
	remarkImgToJsx,
} from "@shipixen/pliny/mdx-plugins/index.js";
import {
	allCoreContent,
	sortPosts,
} from "@shipixen/pliny/utils/contentlayer.js";
import {
	ComputedFields,
	defineDocumentType,
	makeSource,
} from "contentlayer2/source-files";
import { slug } from "github-slugger";
import readingTime from "reading-time";
import rehypeCitation from "rehype-citation";
import rehypeKatex from "rehype-katex";
import rehypePresetMinify from "rehype-preset-minify";
import rehypePrismPlus from "rehype-prism-plus";
// Rehype packages
import rehypeSlug from "rehype-slug";
// Remark packages
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { siteConfig } from "./data/config/site.settings";

const root = process.cwd();
const isProduction = process.env.NODE_ENV === "production";

const computedFields: ComputedFields = {
	readingTime: { type: "json", resolve: (doc) => readingTime(doc.body.raw) },
	slug: {
		type: "string",
		resolve: (doc) => doc._raw.flattenedPath.replace(/^.+?(\/)/, ""),
	},
	path: {
		type: "string",
		resolve: (doc) => doc._raw.flattenedPath,
	},
	filePath: {
		type: "string",
		resolve: (doc) => doc._raw.sourceFilePath,
	},
	toc: { type: "json", resolve: (doc) => extractTocHeadings(doc.body.raw) },
};

/**
 * Count the occurrences of all tags across blog posts and write to json file
 */
function createTagCount(allBlogs) {
	const tagCount: Record<string, number> = {};
	allBlogs.forEach((file) => {
		if (file.tags && (!isProduction || file.draft !== true)) {
			file.tags.forEach((tag) => {
				const formattedTag = slug(tag);
				if (formattedTag in tagCount) {
					tagCount[formattedTag] += 1;
				} else {
					tagCount[formattedTag] = 1;
				}
			});
		}
	});
	writeFileSync("./app/tag-data.json", JSON.stringify(tagCount));
}

function createSearchIndex(allBlogs) {
	if (siteConfig?.search === true) {
		writeFileSync(
			`public/search.json`,
			JSON.stringify(allCoreContent(sortPosts(allBlogs))),
		);
		console.log("Local search index generated...");
	}
}

const BLOG_URL = siteConfig.blogPath ? `${siteConfig.blogPath}/` : "";

export const Blog = defineDocumentType(() => ({
	name: "Blog",
	filePathPattern: `${BLOG_URL}**/*.mdx`,
	contentType: "mdx",
	fields: {
		title: { type: "string", required: true },
		date: { type: "date", required: true },
		tags: { type: "list", of: { type: "string" }, default: [] },
		lastmod: { type: "date" },
		draft: { type: "boolean" },
		summary: { type: "string" },
		images: { type: "json" },
		authors: { type: "list", of: { type: "string" } },
		layout: { type: "string" },
		bibliography: { type: "string" },
		canonicalUrl: { type: "string" },
	},
	computedFields: {
		...computedFields,
		structuredData: {
			type: "json",
			resolve: (doc) => ({
				"@context": "https://schema.org",
				"@type": "BlogPosting",
				headline: doc.title,
				datePublished: doc.date,
				dateModified: doc.lastmod || doc.date,
				description: doc.summary,
				image: doc.images ? doc.images[0] : siteConfig.socialBanner,
				url: `${siteConfig.siteUrl}/${doc._raw.flattenedPath}`,
				author: doc.authors,
			}),
		},
	},
}));

export const Authors = defineDocumentType(() => ({
	name: "Authors",
	filePathPattern: "authors/**/*.md",
	contentType: "mdx",
	fields: {
		name: { type: "string", required: true },
		avatar: { type: "string" },
		occupation: { type: "string" },
		company: { type: "string" },
		email: { type: "string" },
		twitter: { type: "string" },
		linkedin: { type: "string" },
		github: { type: "string" },
		layout: { type: "string" },
	},
	computedFields,
}));

export default makeSource({
	contentDirPath: "data",
	documentTypes: [Blog, Authors],
	mdx: {
		cwd: process.cwd(),
		remarkPlugins: [
			remarkExtractFrontmatter,
			remarkGfm,
			remarkCodeTitles,
			remarkMath,
			remarkImgToJsx,
		],
		rehypePlugins: [
			rehypeSlug,
			rehypeKatex,
			[rehypeCitation, { path: path.join(root, "data") }],
			[rehypePrismPlus, { defaultLanguage: "js", ignoreMissing: true }],
			rehypePresetMinify,
		],
	},
	onMissingOrIncompatibleData: "skip-warn",
	onSuccess: async (importData) => {
		const { allBlogs } = await importData();
		createTagCount(allBlogs);
		createSearchIndex(allBlogs);
	},
});
