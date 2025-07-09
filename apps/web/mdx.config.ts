import type { NextMDXOptions } from "@next/mdx";
import {
	remarkCodeTitles,
	remarkExtractFrontmatter,
	remarkImgToJsx,
} from "@shipixen/pliny/mdx-plugins/index.js";
import rehypeKatex from "rehype-katex";
import rehypePresetMinify from "rehype-preset-minify";
// Rehype packages
import rehypeSlug from "rehype-slug";
// Remark packages
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

const root = process.cwd();

const options: NextMDXOptions["options"] = {
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
		// [rehypeCitation, { path: path.join(root, 'data') }],
		// [rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }],
		rehypePresetMinify,
	],
};

export default options;
