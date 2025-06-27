import Header from "@/components/Header";
import Image from "@/components/Image";
import Link from "@/components/Link";
import PageTitle from "@/components/PageTitle";
import ScrollTop from "@/components/ScrollTop";
import SectionContainer from "@/components/SectionContainer";
import Tag from "@/components/blog/Tag";
import { TOC } from "@/components/blog/Toc";
import { siteConfig } from "@/data/config/site.settings";
import { cn } from "@mjs/ui/lib/utils";
import { CoreContent } from "@shipixen/pliny/utils/contentlayer";
import type { Authors, Blog } from "contentlayer/generated";
import { ExternalLinkIcon } from "lucide-react";
import { ReactNode } from "react";

const postDateTemplate: Intl.DateTimeFormatOptions = {
	weekday: "long",
	year: "numeric",
	month: "long",
	day: "numeric",
};

interface LayoutProps {
	className?: string;
	content: CoreContent<Blog>;
	authorDetails: CoreContent<Authors>[];
	next?: { path: string; title: string };
	prev?: { path: string; title: string };
	children: ReactNode;
}

export default function PostLayout({
	className,
	content,
	authorDetails,
	next,
	prev,
	children,
}: LayoutProps) {
	const { date, images, title, lastmod, tags, toc } = content;
	const displayImage = images && images.length > 0 ? images[0] : null;

	// Metadata sections that appear in both mobile and desktop views
	const MetadataSections = () => (
		<>
			<div className="pt-4 xl:border-none">
				<h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">
					Table of Contents
				</h2>
				<TOC toc={toc} toHeading={2} />
			</div>

			<div className="pt-4">
				<h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">
					Authors
				</h2>
				<ul className="flex flex-wrap gap-4 sm:space-x-12 xl:block xl:space-x-0 xl:space-y-4">
					{authorDetails.map((author) => (
						<li className="flex items-center space-x-2" key={author.name}>
							{author.avatar && (
								<Image
									src={author.avatar}
									width={38}
									height={38}
									alt="avatar"
									className="h-10 w-10 rounded-full"
								/>
							)}
							<dl className="whitespace-nowrap text-sm font-medium leading-5">
								<dt className="sr-only">Name</dt>
								<dd className="text-gray-900 dark:text-gray-100">
									{author.name}
								</dd>
								<dt className="sr-only">Twitter</dt>
								<dd>
									{author.twitter && (
										<Link
											href={author.twitter}
											className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
										>
											{author.twitter.replace("https://twitter.com/", "@")}
										</Link>
									)}
								</dd>
							</dl>
						</li>
					))}
				</ul>
			</div>

			{(next || prev) && (
				<div className="pt-4 text-sm">
					<div className="flex justify-between xl:block xl:space-y-4">
						{prev && prev.path && (
							<div className="flex-1">
								<h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
									Previous Article
								</h2>
								<div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
									<Link href={`/${prev.path}`}>{prev.title}</Link>
								</div>
							</div>
						)}
						{next && next.path && (
							<div className="flex-1 text-right xl:text-left">
								<h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
									Next Article
								</h2>
								<div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
									<Link href={`/${next.path}`}>{next.title}</Link>
								</div>
							</div>
						)}
					</div>
				</div>
			)}

			<div className="pt-4 text-sm">
				<Link
					href={siteConfig.allArticlesPath}
					className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
					aria-label="More articles"
				>
					More articles &rarr;
				</Link>
			</div>

			{tags && (
				<div className="pt-4">
					<h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">
						Tags
					</h2>
					<div className="flex flex-wrap">
						{tags.map((tag) => (
							<Tag key={tag} text={tag} />
						))}
					</div>
					<a
						href="/tags"
						className="inline-block mt-2 text-xs capitalize font-medium text-primary-500 hover:text-primary-700 dark:hover:text-primary-400"
						target="_blank"
						rel="noopener noreferrer"
					>
						All tags
						<ExternalLinkIcon className="ml-1 inline-block w-3 h-3" />
					</a>
				</div>
			)}
		</>
	);

	return (
		<SectionContainer
			type="ultrawide"
			className={cn("fancy-overlay p-0!", className)}
		>
			<Header className="mb-4 lg:mb-12" />

			<ScrollTop />

			<article>
				<header className="p-6 xl:px-0">
					<div className="space-y-1 text-left">
						<dl className="space-y-10">
							{lastmod ? (
								<div>
									<dt className="sr-only">Updated on</dt>
									<dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
										<time dateTime={lastmod}>
											{new Date(lastmod).toLocaleDateString(
												siteConfig.locale,
												postDateTemplate,
											)}
										</time>
									</dd>
								</div>
							) : (
								<div>
									<dt className="sr-only">Published on</dt>
									<dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
										<time dateTime={date}>
											{new Date(date).toLocaleDateString(
												siteConfig.locale,
												postDateTemplate,
											)}
										</time>
									</dd>
								</div>
							)}
						</dl>
						<div>
							<PageTitle>{title}</PageTitle>
						</div>
					</div>
				</header>

				<div className="grid-rows-[auto_1fr] pb-8 xl:grid xl:grid-cols-4 xl:gap-x-6">
					<div
						className={cn(
							"lg:bg-white dark:lg:bg-slate-900 p-6 lg:px-10 lg:py-4 xl:col-span-3 xl:row-span-1 xl:pb-0 rounded-xl",
						)}
					>
						{displayImage ? (
							<Image
								src={displayImage}
								alt={title}
								className="h-auto w-full -mt-4 lg:mt-5 rounded-xl"
								width={1280}
								height={1280}
							/>
						) : null}

						<div className="prose max-w-none pb-8 pt-10 dark:prose-invert">
							{children}
						</div>
					</div>

					<div className="hidden xl:block xl:col-span-1 xl:row-span-1">
						<div className="sticky top-0 pt-6 space-y-4 divide-y divide-gray-200 dark:divide-gray-700">
							<MetadataSections />
						</div>
					</div>
				</div>

				<div className="xl:hidden p-6">
					<MetadataSections />
				</div>
			</article>
		</SectionContainer>
	);
}
