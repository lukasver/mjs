import {
	Bitcoin,
	DollarSign,
	HandCoins,
	type LucideIcon,
	Users,
	Wallet2,
} from "lucide-react";

export type Icon =
	| LucideIcon
	| ((props: React.SVGProps<SVGSVGElement>) => React.ReactElement);

export const Icons = {
	sale: HandCoins,
	transaction: Wallet2,
	dollar: DollarSign,
	bitcoin: Bitcoin,
	users: Users,
};

/**
 * Icon wrapper to render the icon from the Icons object
 */
export const Icon = ({
	icon,
	className,
}: {
	icon: string | undefined;
	className?: string;
}) => {
	if (!icon) return null;
	const El = Icons[icon as keyof typeof Icons];
	if (!El) return null;
	return <El className={className} />;
};
