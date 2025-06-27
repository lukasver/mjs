"use client";

import { searchLinks } from "@/data/config/searchLinks";
import { KBarSearchProvider } from "@shipixen/pliny/search/KBar";
import { CoreContent } from "@shipixen/pliny/utils/contentlayer";
import { formatDate } from "@shipixen/pliny/utils/formatDate";
import { Blog } from "contentlayer/generated";
import { useRouter } from "next/navigation";

export const SearchProvider = ({ children }) => {
	const router = useRouter();

	const makeRootPath = (path: string) => {
		if (!path.startsWith("/")) {
			return `/${path}`;
		}

		return path;
	};

	return (
		<KBarSearchProvider
			kbarConfig={{
				searchDocumentsPath: "search.json",
				onSearchDocumentsLoad(json) {
					return [
						...json.map((post: CoreContent<Blog>) => ({
							id: post.path,
							name: post.title,
							keywords: post?.summary || "",
							section: "Blog",
							subtitle: `${
								post.date ? `${formatDate(post.date, "en-US")} · ` : ""
							}${post.tags.join(", ")}`,
							perform: () => router.push(makeRootPath(post.path)),
						})),

						...searchLinks.map((link) => {
							return {
								id: link.id,
								name: link.name,
								keywords: link.keywords,
								section: link.section,
								perform: () => router.push(link.href),
							};
						}),
					];
				},
			}}
		>
			{children}
		</KBarSearchProvider>
	);
};
