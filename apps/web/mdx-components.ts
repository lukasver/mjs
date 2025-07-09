import type { MDXComponents } from "mdx/types";

/**
 * https://nextjs.org/docs/app/guides/mdx
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		...components,
	};
}
