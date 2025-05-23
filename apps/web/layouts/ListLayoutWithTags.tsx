"use client";

import Link from "@/components/Link";
import SectionContainer from "@/components/SectionContainer";
import { LandingBlogList } from "@/components/landing/blog/LandingBlogList";
import {
	BlogPost,
	LandingBlogPost,
} from "@/components/landing/blog/LandingBlogPost";
import { siteConfig } from "@/data/config/site.settings";
import { CoreContent } from "@shipixen/pliny/utils/contentlayer";
import { formatDate } from "@shipixen/pliny/utils/formatDate";
import tagData from "app/tag-data.json";
import type { Blog } from "contentlayer/generated";
import { slug } from "github-slugger";
import { usePathname } from "next/navigation";

const BLOG_URL = siteConfig.blogPath ? `/${siteConfig.blogPath}` : "/";

interface PaginationProps {
	totalPages: number;
	currentPage: number;
}

interface ListLayoutProps {
	posts: CoreContent<Blog>[];
	title: string;
	initialDisplayPosts?: CoreContent<Blog>[];
	pagination?: PaginationProps;
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
	const pathname = usePathname();
	const basePath = pathname.split("/")[1];
	const prevPage = currentPage - 1 > 0;
	const nextPage = currentPage + 1 <= totalPages;

	return (
		<div className="space-y-2 pb-8 pt-6 md:space-y-5">
			<nav className="flex justify-between">
				<span>
					{currentPage} of {totalPages} pages
				</span>

				<div className="flex gap-8">
					{prevPage && (
						<Link
							href={
								currentPage - 1 === 1
									? `/${basePath}/`
									: `/${basePath}/page/${currentPage - 1}`
							}
							rel="prev"
							className="font-semibold text-primary-500 hover:text-primary-700 transition-colors text-base"
						>
							◀ Previous
						</Link>
					)}

					{nextPage && (
						<Link
							href={`/${basePath}/page/${currentPage + 1}`}
							rel="next"
							className="font-semibold text-primary-500 hover:text-primary-700 transition-colors text-base"
						>
							Next ▶
						</Link>
					)}
				</div>
			</nav>
		</div>
	);
}

export default function ListLayoutWithTags({
	posts,
	title,
	initialDisplayPosts = [],
	pagination,
}: ListLayoutProps) {
	const pathname = usePathname();
	const tagCounts = tagData as Record<string, number>;
	const tagKeys = Object.keys(tagCounts);
	const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a]);

	const displayPosts =
		initialDisplayPosts.length > 0 ? initialDisplayPosts : posts;

	if (displayPosts.length === 0) {
		return (
			<div className="flex flex-col gap-1 p-6 mb-10">
				<h2 className="text-4xl">No posts found</h2>
				<p>Please check back later!</p>
			</div>
		);
	}

	const formattedPosts = displayPosts.map((post): BlogPost => {
		return {
			path: `/${post.path}`,
			slug: post.slug || "",
			date: formatDate(post.date, siteConfig.locale),
			title: post.title,
			summary: post.summary,
			tags: post.tags?.map((tag) => {
				return {
					url: `/tags/${slug(tag)}`,
					text: tag,
				};
			}),
			images: post.images || [],
			readingTime: post.readingTime?.text || "",
			author: {
				name: post.authors?.[0],
			},
		};
	});

	return (
		<>
			<SectionContainer type="ultrawide" className="fancy-overlay p-0!">
				<div className="flex sm:gap-12">
					<div className="w-full">
						<div className="px-6">
							<h1 className="text-2xl font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl sm:leading-10 md:text-4xl md:leading-14">
								{title}
							</h1>
						</div>

						<LandingBlogList display="list" variant="primary" className="pt-6!">
							{formattedPosts.map((post) => (
								<LandingBlogPost
									key={post.slug}
									post={post}
									imagePosition="right"
								/>
							))}
						</LandingBlogList>

						{pagination && pagination.totalPages > 1 && (
							<Pagination
								currentPage={pagination.currentPage}
								totalPages={pagination.totalPages}
							/>
						)}
					</div>

					<div className="hidden max-h-screen h-full lg:flex flex-wrap min-w-[280px] max-w-[280px] overflow-auto">
						<div className="py-4 px-6">
							{pathname.startsWith(BLOG_URL) ? (
								<h3 className="font-bold uppercase text-xl">Filter by topic</h3>
							) : (
								<Link
									href={BLOG_URL}
									className="font-bold uppercase text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-500"
								>
									Filter by topic
								</Link>
							)}
							<ul className="flex flex-col gap-2 mt-4">
								{sortedTags.map((t) => {
									return (
										<li key={t}>
											{pathname.split("/tags/")[1] === slug(t) ? (
												<h3 className="inline-block transition-all uppercase text-sm font-bold text-primary-500">
													{`${t} (${tagCounts[t]})`}
												</h3>
											) : (
												<Link
													href={`/tags/${slug(t)}`}
													className="inline-block translate-x-0 transition-all uppercase text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-500"
													aria-label={`View posts tagged ${t}`}
												>
													{`${t} (${tagCounts[t]})`}
												</Link>
											)}
										</li>
									);
								})}
							</ul>
						</div>
					</div>
				</div>
			</SectionContainer>
		</>
	);
}
