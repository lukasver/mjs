import MahjongStarsIcon from "@/public/static/favicons/favicon-48x48.png";
import MahjongStarsLogo from "@/public/static/images/logo-wt.webp";
import { cn } from "@mjs/ui/lib/utils";
import Image from "next/image";

export const Logo = ({
	variant = "logo",
	className,
}: {
	variant?: "logo" | "icon";
	className?: string;
}) => {
	const { blurHeight, blurWidth, ...rest } =
		variant === "logo" ? MahjongStarsLogo : MahjongStarsIcon;
	return (
		<figure className={cn(className, "dark:bg-none")}>
			<Image
				alt="Mahjong Stars Logo"
				{...rest}
				height={80}
				width={100}
				priority
			/>
		</figure>
	);
};
