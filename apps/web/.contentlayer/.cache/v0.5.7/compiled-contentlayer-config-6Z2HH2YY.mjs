var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) =>
	function __require() {
		return (
			mod ||
				(0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod),
			mod.exports
		);
	};
var __copyProps = (to, from, except, desc) => {
	if ((from && typeof from === "object") || typeof from === "function") {
		for (let key of __getOwnPropNames(from))
			if (!__hasOwnProp.call(to, key) && key !== except)
				__defProp(to, key, {
					get: () => from[key],
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
				});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (
	(target = mod != null ? __create(__getProtoOf(mod)) : {}),
	__copyProps(
		// If the importer is in node compatibility mode or this is not an ESM
		// file that has been converted to a CommonJS file using a Babel-
		// compatible transform (i.e. "__esModule" has not been set), then set
		// "default" to the CommonJS "module.exports" for node compatibility.
		isNodeMode || !mod || !mod.__esModule
			? __defProp(target, "default", { value: mod, enumerable: true })
			: target,
		mod,
	)
);

// data/config/metadata.js
var require_metadata = __commonJS({
	"data/config/metadata.js"(exports, module) {
		var metadata = {
			title: "$MJS Token \u2013 Powering the Mahjong Stars Ecosystem",
			description:
				"$MJS is the core utility token of Mahjong Stars, enabling NFT trading, AI upgrades, tournament access, and revenue staking. Participate in a multi-billion dollar Web3 opportunity and fuel the first global social mahjong platform with real-world value and AI liquidity.",
			domain: "mahjongstars.xyz",
			logoTitle: "Mahjong Stars",
			businessName: "Mahjong Stars",
			siteUrl: "https://mahjongstars.xyz",
			siteRepo: "",
			socialBanner: "/api/og",
			supportEmail: "",
			email: "hi@mahjongstars.xyz",
			twitter: "https://x.com/mahjongstars",
			instagram: "https://instagram.com/@mahjongstars",
			tiktok: "https://tiktok.com/@mahjongstars",
			github: "https://github.com/mahjongstars",
			linkedin: "https://linkedin.com/in/mahjongstars",
			youtube: "https://youtube.com/@mahjongstars",
			facebook: "",
			threads: "",
			mastodon: "",
			author: "Mahjong Stars",
			language: "en-us",
			theme: "system",
			locale: "en-US",
		};
		module.exports = { metadata };
	},
});

// data/config/site.settings.js
var require_site_settings = __commonJS({
	"data/config/site.settings.js"(exports, module) {
		var { metadata } = require_metadata();
		var siteConfig2 = {
			...metadata,
			blogPath: "",
			// The location of all blog pages under 'data'. Empty string means 'data' (default). Best for SEO is to have articles under the root path.
			allArticlesPath: "/all-articles",
			// The name of the page where you can see a list of all articles (needs to match app/all-articles/page.tsx)
			// Configure analytics
			disableAnalytics: false,
			// Disable all analytics on the site
			analytics: {
				// By default Vercel analytics is enabled.
				//
				// If you want to use an analytics provider you have to add it to the
				// content security policy in the `next.config.js` file.
				// supports Plausible, Simple Analytics, Umami, Posthog or Google Analytics.
				// umamiAnalytics: {
				//   // We use an env variable for this site to avoid other users cloning our analytics ID
				//   umamiWebsiteId: '', // e.g. 123e4567-e89b-12d3-a456-426614174000
				// },
				// plausibleAnalytics: {
				//   plausibleDataDomain: '', // e.g. insert-business-name.vercel.app
				// },
				// simpleAnalytics: {},
				// posthogAnalytics: {
				//   posthogProjectApiKey: '', // e.g. 123e4567-e89b-12d3-a456-426614174000
				// },
				// googleAnalytics: {
				//   googleAnalyticsId: '', // e.g. G-XXXXXXX
				// },
			},
			newsletter: {
				// Optional: enable newsletter
				// provider: 'emailoctopus',
			},
			search: true,
			// Enable or disable search
		};
		module.exports = { siteConfig: siteConfig2 };
	},
});

import { writeFileSync } from "fs";
import path from "path";
// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import { slug } from "github-slugger";
import readingTime from "reading-time";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

// node_modules/@shipixen/pliny/chunk-4VSLFMH7.js
var __async = (__this, __arguments, generator) => {
	return new Promise((resolve, reject) => {
		var fulfilled = (value) => {
			try {
				step(generator.next(value));
			} catch (e) {
				reject(e);
			}
		};
		var rejected = (value) => {
			try {
				step(generator.throw(value));
			} catch (e) {
				reject(e);
			}
		};
		var step = (x) =>
			x.done
				? resolve(x.value)
				: Promise.resolve(x.value).then(fulfilled, rejected);
		step((generator = generator.apply(__this, __arguments)).next());
	});
};

import GithubSlugger from "github-slugger";
import { remark } from "remark";
// node_modules/@shipixen/pliny/chunk-X2DNTJVI.js
import { visit } from "unist-util-visit";
var emptyOptions = {};
function toString(value, options) {
	const settings = options || emptyOptions;
	const includeImageAlt =
		typeof settings.includeImageAlt === "boolean"
			? settings.includeImageAlt
			: true;
	const includeHtml =
		typeof settings.includeHtml === "boolean" ? settings.includeHtml : true;
	return one(value, includeImageAlt, includeHtml);
}
function one(value, includeImageAlt, includeHtml) {
	if (node(value)) {
		if ("value" in value) {
			return value.type === "html" && !includeHtml ? "" : value.value;
		}
		if (includeImageAlt && "alt" in value && value.alt) {
			return value.alt;
		}
		if ("children" in value) {
			return all(value.children, includeImageAlt, includeHtml);
		}
	}
	if (Array.isArray(value)) {
		return all(value, includeImageAlt, includeHtml);
	}
	return "";
}
function all(values, includeImageAlt, includeHtml) {
	const result = [];
	let index = -1;
	while (++index < values.length) {
		result[index] = one(values[index], includeImageAlt, includeHtml);
	}
	return result.join("");
}
function node(value) {
	return Boolean(value && typeof value === "object");
}
function remarkTocHeadings() {
	const slugger = new GithubSlugger();
	return (tree, file) => {
		const toc = [];
		visit(tree, "heading", (node2) => {
			const textContent = toString(node2);
			toc.push({
				value: textContent,
				url: "#" + slugger.slug(textContent),
				depth: node2.depth,
			});
		});
		file.data.toc = toc;
	};
}
function extractTocHeadings(markdown) {
	return __async(this, null, function* () {
		const vfile = yield remark().use(remarkTocHeadings).process(markdown);
		return vfile.data.toc;
	});
}

// node_modules/@shipixen/pliny/chunk-4HM7I3CS.js
import { visit as visit2 } from "unist-util-visit";
function remarkCodeTitles() {
	return (tree) =>
		visit2(tree, "code", (node2, index, parent) => {
			const nodeLang = node2.lang || "";
			let language = "";
			let title = "";
			if (nodeLang.includes(":")) {
				language = nodeLang.slice(0, nodeLang.search(":"));
				title = nodeLang.slice(nodeLang.search(":") + 1, nodeLang.length);
			}
			if (!title) {
				return;
			}
			const className = "remark-code-title";
			const titleNode = {
				type: "mdxJsxFlowElement",
				name: "div",
				attributes: [
					{ type: "mdxJsxAttribute", name: "className", value: className },
				],
				children: [{ type: "text", value: title }],
				data: { _xdmExplicitJsx: true },
			};
			parent.children.splice(index, 0, titleNode);
			node2.lang = language;
		});
}

import yaml from "js-yaml";
// node_modules/@shipixen/pliny/chunk-SNRZ24QP.js
import { visit as visit3 } from "unist-util-visit";
function remarkExtractFrontmatter() {
	return (tree, file) => {
		visit3(tree, "yaml", (node2) => {
			file.data.frontmatter = yaml.load(node2.value);
		});
	};
}

import fs from "fs";
import { sync } from "probe-image-size";
// node_modules/@shipixen/pliny/chunk-OP4P6NKC.js
import { visit as visit4 } from "unist-util-visit";
function remarkImgToJsx() {
	return (tree) => {
		visit4(
			tree,
			// only visit p tags that contain an img element
			(node2) =>
				node2.type === "paragraph" &&
				node2.children.some((n) => n.type === "image"),
			(node2) => {
				const imageNodeIndex = node2.children.findIndex(
					(n) => n.type === "image",
				);
				const imageNode = node2.children[imageNodeIndex];
				if (fs.existsSync(`${process.cwd()}/public${imageNode.url}`)) {
					const dimensions = sync(
						fs.readFileSync(`${process.cwd()}/public${imageNode.url}`),
					);
					(imageNode.type = "mdxJsxFlowElement"),
						(imageNode.name = "Image"),
						(imageNode.attributes = [
							{ type: "mdxJsxAttribute", name: "alt", value: imageNode.alt },
							{ type: "mdxJsxAttribute", name: "src", value: imageNode.url },
							{
								type: "mdxJsxAttribute",
								name: "width",
								value: dimensions.width,
							},
							{
								type: "mdxJsxAttribute",
								name: "height",
								value: dimensions.height,
							},
						]);
					node2.type = "div";
					node2.children[imageNodeIndex] = imageNode;
				}
			},
		);
	};
}

// contentlayer.config.ts
var import_site = __toESM(require_site_settings());
import rehypeCitation from "rehype-citation";
import rehypeKatex from "rehype-katex";
import rehypePresetMinify from "rehype-preset-minify";
import rehypePrismPlus from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";

// node_modules/@shipixen/pliny/utils/contentlayer.js
var isProduction = process.env.NODE_ENV === "production";
function dateSortDesc(a, b) {
	if (a > b) return -1;
	if (a < b) return 1;
	return 0;
}
function sortPosts(allBlogs, dateKey = "date") {
	return allBlogs.sort((a, b) => dateSortDesc(a[dateKey], b[dateKey]));
}
var omit = (obj, keys) => {
	const result = Object.assign({}, obj);
	keys.forEach((key) => {
		delete result[key];
	});
	return result;
};
function coreContent(content) {
	return omit(content, ["body", "_raw", "_id"]);
}
function allCoreContent(contents) {
	if (isProduction)
		return contents
			.map((c) => coreContent(c))
			.filter((c) => !("draft" in c && c.draft === true));
	return contents.map((c) => coreContent(c));
}

// contentlayer.config.ts
var root = process.cwd();
var isProduction2 = process.env.NODE_ENV === "production";
var computedFields = {
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
function createTagCount(allBlogs) {
	const tagCount = {};
	allBlogs.forEach((file) => {
		if (file.tags && (!isProduction2 || file.draft !== true)) {
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
	if (import_site.siteConfig?.search === true) {
		writeFileSync(
			`public/search.json`,
			JSON.stringify(allCoreContent(sortPosts(allBlogs))),
		);
		console.log("Local search index generated...");
	}
}
var BLOG_URL = import_site.siteConfig.blogPath
	? `${import_site.siteConfig.blogPath}/`
	: "";
var Blog = defineDocumentType(() => ({
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
				image: doc.images ? doc.images[0] : import_site.siteConfig.socialBanner,
				url: `${import_site.siteConfig.siteUrl}/${doc._raw.flattenedPath}`,
				author: doc.authors,
			}),
		},
	},
}));
var Authors = defineDocumentType(() => ({
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
var contentlayer_config_default = makeSource({
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
export { Authors, Blog, contentlayer_config_default as default };
//# sourceMappingURL=compiled-contentlayer-config-6Z2HH2YY.mjs.map
