import ActiveLink from "@/components/ActiveLink";
import Image from "@/components/Image";
import { headerNavLinks } from "@/data/config/headerNavLinks";
import { siteConfig } from "@/data/config/site.settings";
import { cn } from "@mjs/ui/lib/utils";
import Link from "./Link";
import MobileNav from "./MobileNav";
import ThemeSwitch from "./ThemeSwitch";
import SearchButton from "./search/SearchButton";

const Header = ({ className }: { className?: string }) => {
	return (
		<header
			className={cn(
				"flex items-center justify-between py-10 flex-wrap w-full mb-20 lg:mb-32 pt-6 p-6 max-w-full container-wide",
				className,
			)}
		>
			<div>
				<Link href="/" aria-label={siteConfig.logoTitle}>
					<div className="flex items-center gap-3 justify-between">
						<Image
							src="/static/images/logo.svg"
							alt="Mahjong Stars logo"
							height={43}
							width={43}
							className="group-hover:animate-wiggle "
						/>

						<div className="hidden text-2xl font-semibold sm:flex h-full">
							Mahjong Stars
						</div>
					</div>
				</Link>
			</div>
			<div className="flex items-center leading-5 gap-4 sm:gap-6">
				{headerNavLinks.map((link) => (
					<ActiveLink
						key={link.title}
						href={link.href}
						className="nav-link hidden sm:block"
						activeClassName="nav-link-active"
					>
						<span>{link.title}</span>
					</ActiveLink>
				))}
				<SearchButton />
				<ThemeSwitch />
				<MobileNav />
			</div>
		</header>
	);
};

export default Header;
