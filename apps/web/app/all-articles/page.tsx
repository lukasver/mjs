import { POSTS_PER_PAGE } from "@/app/all-articles/settings";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ListLayout from "@/layouts/ListLayoutWithTags";
import { allCoreContent, sortPosts } from "@shipixen/pliny/utils/contentlayer";
import { genPageMetadata } from "app/seo";
import { allBlogs } from "contentlayer/generated";

export const metadata = genPageMetadata({ title: "Blog" });

export default function BlogPage() {
	const posts = allCoreContent(sortPosts(allBlogs));
	const pageNumber = 1;
	const initialDisplayPosts = posts.slice(
		POSTS_PER_PAGE * (pageNumber - 1),
		POSTS_PER_PAGE * pageNumber,
	);
	const pagination = {
		currentPage: pageNumber,
		totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
	};

	return (
		<div className="flex flex-col w-full items-center justify-between">
			<Header />
			<ListLayout
				posts={posts}
				initialDisplayPosts={initialDisplayPosts}
				pagination={pagination}
				title="All Articles"
			/>
			<Footer />
		</div>
	);
}
