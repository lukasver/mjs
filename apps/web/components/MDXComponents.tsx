import BlogNewsletterForm from "@shipixen/pliny/ui/BlogNewsletterForm";
import Pre from "@shipixen/pliny/ui/Pre";
import TOCInline from "@shipixen/pliny/ui/TOCInline";
import type { MDXComponents } from "mdx/types";
import Image from "./Image";
import CustomLink from "./Link";

export const components: MDXComponents = {
	Image,
	TOCInline,
	a: CustomLink,
	pre: Pre,
	BlogNewsletterForm,
};
