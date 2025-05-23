import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Image from "@/components/Image";
import Link from "@/components/Link";
import PageTitle from "@/components/PageTitle";
import ScrollTop from "@/components/ScrollTop";
import SectionContainer from "@/components/SectionContainer";
import { cn } from "@mjs/ui/lib/utils";
import Bleed from "@shipixen/pliny/ui/Bleed";
import { CoreContent } from "@shipixen/pliny/utils/contentlayer";
import type { Blog } from "contentlayer/generated";
import { ReactNode } from "react";

interface LayoutProps {
	className?: string;
	content: CoreContent<Blog>;
	children: ReactNode;
	next?: { path: string; title: string };
	prev?: { path: string; title: string };
}

export default function PostMinimal({
	className,
	content,
	next,
	prev,
	children,
}: LayoutProps) {
	const { slug, title, images } = content;
	const displayImage =
		images && images.length > 0 ? images[0] : "/static/images/backdrop-3.webp";

	return (
		<div className="flex flex-col w-full items-center">
			<Header className="mb-0 lg:mb-0" />

			<SectionContainer type="wide" className={cn(className)}>
				<ScrollTop />
				<article>
					<div>
						<div className="space-y-1 pb-10 text-center dark:border-gray-700">
							<div className="w-full">
								<Bleed>
									<div className="aspect-2/1 w-full relative">
										<Image
											src={displayImage}
											alt={title}
											fill
											className="object-cover"
										/>
									</div>
								</Bleed>
							</div>
							<div className="pt-10 relative">
								<PageTitle>{title}</PageTitle>
							</div>
						</div>
						<div className="prose max-w-none py-4 dark:prose-invert">
							{children}
						</div>

						<footer>
							<div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
								{prev && prev.path && (
									<div className="pt-4 xl:pt-8">
										<Link
											href={`/${prev.path}`}
											className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
											aria-label={`Previous post: ${prev.title}`}
										>
											&larr; {prev.title}
										</Link>
									</div>
								)}
								{next && next.path && (
									<div className="pt-4 xl:pt-8">
										<Link
											href={`/${next.path}`}
											className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
											aria-label={`Next post: ${next.title}`}
										>
											{next.title} &rarr;
										</Link>
									</div>
								)}
							</div>
						</footer>
					</div>
				</article>
			</SectionContainer>

			<Footer />
		</div>
	);
}
