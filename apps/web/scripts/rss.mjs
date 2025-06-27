import { mkdirSync, writeFileSync } from "fs";
import { createRequire } from "module";
import path from "path";
import { escape } from "@shipixen/pliny/utils/htmlEscaper.js";
import { slug } from "github-slugger";
import { allBlogs } from "../.contentlayer/generated/index.mjs";
import { siteConfig } from "../data/config/site.settings.js";

const require = createRequire(import.meta.url);
const tagData = require("../app/tag-data.json");

const BLOG_URL = siteConfig.blogPath ? `/${siteConfig.blogPath}` : "";

const generateRssItem = (config, post) => `
  <item>
    <guid>${config.siteUrl}${BLOG_URL}/${post.path}</guid>
    <title>${escape(post.title)}</title>
    <link>${config.siteUrl}${BLOG_URL}/${post.path}</link>
    ${post.summary && `<description>${escape(post.summary)}</description>`}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${config.email} (${config.author})</author>
    ${post.tags && post.tags.map((t) => `<category>${t}</category>`).join("")}
  </item>
`;

const generateRss = (config, posts, page = "feed.xml") => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(config.title)}</title>
      <link>${config.siteUrl}${BLOG_URL}</link>
      <description>${escape(config.description)}</description>
      <language>${config.language}</language>
      <managingEditor>${config.email} (${config.author})</managingEditor>
      <webMaster>${config.email} (${config.author})</webMaster>
      <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="${
				config.siteUrl
			}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map((post) => generateRssItem(config, post)).join("")}
    </channel>
  </rss>
`;

async function generateRSS(config, allBlogs, page = "feed.xml") {
	const publishPosts = allBlogs
		.filter((post) => post.draft !== true)
		.sort((a, b) => new Date(b.date) - new Date(a.date));

	// RSS for post
	if (publishPosts.length > 0) {
		const rss = generateRss(config, publishPosts);
		writeFileSync(`./public/${page}`, rss);
	}

	if (publishPosts.length > 0) {
		for (const tag of Object.keys(tagData)) {
			const filteredPosts = allBlogs
				.filter((post) => post.tags.map((t) => slug(t)).includes(tag))
				.sort((a, b) => new Date(b.date) - new Date(a.date));
			const rss = generateRss(config, filteredPosts, `tags/${tag}/${page}`);
			const rssPath = path.join("public", "tags", tag);
			mkdirSync(rssPath, { recursive: true });
			writeFileSync(path.join(rssPath, page), rss);
		}
	}
}

const rss = () => {
	generateRSS(siteConfig, allBlogs);
	console.log("RSS feed generated...");
};
export default rss;
