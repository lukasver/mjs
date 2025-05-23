import Link from "@/components/Link";
import { LandingBlogList } from "@/components/landing/blog/LandingBlogList";
import { LandingBlogPost } from "@/components/landing/blog/LandingBlogPost";
import { siteConfig } from "@/data/config/site.settings";
import NewsletterForm from "@shipixen/pliny/ui/NewsletterForm";
import { allCoreContent, sortPosts } from "@shipixen/pliny/utils/contentlayer";
import { formatDate } from "@shipixen/pliny/utils/formatDate";
import { allBlogs } from "contentlayer/generated";

const MAX_DISPLAY = 3;

export default function LatestArticles({
	numberOfPosts = MAX_DISPLAY,
	showImage = true,
	showNewsletter = true,
}: {
	numberOfPosts?: number;
	showImage?: boolean;
	showNewsletter?: boolean;
}) {
	const sortedPosts = sortPosts(allBlogs);
	const posts = allCoreContent(sortedPosts);

	return (
		<>
			{posts.length > 0 ? (
				<LandingBlogList title="Latest articles" display="list">
					{posts.slice(0, numberOfPosts).map((post) => {
						const {
							path,
							slug,
							date,
							title,
							summary,
							tags,
							images,
							readingTime,
							authors,
						} = post;

						const author = authors?.[0];

						return (
							<LandingBlogPost
								key={slug}
								post={{
									path: `/${path}`,
									slug,
									date: formatDate(date, siteConfig.locale),
									title,
									summary,
									tags,
									images: showImage ? images : [],
									readingTime: readingTime.text,
									author: {
										name:
											author || siteConfig.author || siteConfig.businessName,
									},
								}}
							/>
						);
					})}
				</LandingBlogList>
			) : (
				<div className="flex flex-col items-center justify-center gap-1 p-6 mb-10">
					<h2 className="text-4xl text-center">No posts found</h2>
					<p>Please check back later!</p>
				</div>
			)}

			{posts.length > MAX_DISPLAY && (
				<div className="mt-12 flex text-base font-medium leading-6">
					<Link
						href={siteConfig.allArticlesPath}
						className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
						aria-label="See all articles"
					>
						See all articles &rarr;
					</Link>
				</div>
			)}

			{showNewsletter && siteConfig.newsletter?.provider && (
				<div className="flex items-center justify-center pt-4">
					<NewsletterForm />
				</div>
			)}
		</>
	);
}
