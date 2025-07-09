import { cn } from "../lib/utils";
import { Button } from "../primitives/button";
import { Icons } from "./icons";

export type SocialFooterProps = {
	config: Partial<{
		twitter: string;
		instagram: string;
		tiktok: string;
		discord: string;
		github: string;
		linkedin: string;
		youtube: string;
		facebook: string;
		threads: string;
		mastodon: string;
	}>;
	className?: string;
};

/**
 * Socials for the footer
 */
export const SocialFooter = ({ config, className }: SocialFooterProps) => {
	return (
		<div
			className={cn("mb-3 flex flex-wrap sm:justify-center gap-4", className)}
		>
			{config.twitter && (
				<a href={config.twitter}>
					<Button
						variant="ghost"
						size="icon"
						aria-label="𝕏 (formerly Twitter)"
						className="size-12!"
					>
						<Icons.xTwitter className="size-full p-2" />
					</Button>
				</a>
			)}

			{config.instagram && (
				<a href={config.instagram}>
					<Button
						variant="ghost"
						size="icon"
						aria-label="Instagram"
						className="size-12!"
					>
						<Icons.instagram className="size-full p-2" />
					</Button>
				</a>
			)}

			{config.tiktok && (
				<a href={config.tiktok}>
					<Button
						variant="ghost"
						size="icon"
						aria-label="TikTok"
						className="size-12!"
					>
						<Icons.tiktok className="size-full p-2" />
					</Button>
				</a>
			)}

			{config.github && (
				<a href={config.github}>
					<Button
						variant="ghost"
						size="icon"
						aria-label="GitHub"
						className="size-12!"
					>
						<Icons.github className="size-full p-2" />
					</Button>
				</a>
			)}

			{config.discord && (
				<a href={config.discord}>
					<Button
						variant="ghost"
						size="icon"
						aria-label="Discord"
						className="size-12!"
					>
						<Icons.discord className="size-full p-2" />
					</Button>
				</a>
			)}

			{config.linkedin && (
				<a href={config.linkedin}>
					<Button
						variant="ghost"
						size="icon"
						aria-label="LinkedIn"
						className="size-12!"
					>
						<Icons.linkedin className="size-full p-2" />
					</Button>
				</a>
			)}

			{config.youtube && (
				<a href={config.youtube}>
					<Button
						variant="ghost"
						size="icon"
						aria-label="YouTube"
						className="size-12!"
					>
						<Icons.youtube className="size-full p-2" />
					</Button>
				</a>
			)}

			{config.facebook && (
				<a href={config.facebook}>
					<Button
						variant="ghost"
						size="icon"
						aria-label="Facebook"
						className="size-12!"
					>
						<Icons.facebook className="size-full p-2" />
					</Button>
				</a>
			)}

			{config.threads && (
				<a href={config.threads}>
					<Button
						variant="ghost"
						size="icon"
						aria-label="Threads"
						className="size-12!"
					>
						<Icons.threads className="size-full p-2" />
					</Button>
				</a>
			)}

			{config.mastodon && (
				<a href={config.mastodon}>
					<Button
						variant="ghost"
						size="icon"
						aria-label="Mastodon"
						className="size-12!"
					>
						<Icons.boxes className="size-full p-2" />
					</Button>
				</a>
			)}
		</div>
	);
};
