"use client";

import { GlassyCard } from "@mjs/ui/components/cards";
import { Icons } from "@mjs/ui/components/icons";
import { cn } from "@mjs/ui/lib/utils";

interface TokenStatCardProps {
	data: {
		value: string;
		changeText?: string;
		changePercentage?: string;
		interval: string;
	};
	title: string;
	icon: string;
}
export const TokenStatCard = ({ data, title, icon }: TokenStatCardProps) => {
	const isPositive = !data?.changePercentage?.startsWith("-");
	return (
		<GlassyCard title={title} icon={icon}>
			<div className="text-2xl font-bold">{data?.value || "N/A"}</div>
			{data?.changeText && (
				<p className="text-xs text-secondary-400">{data.changeText}</p>
			)}
			{data?.changePercentage && (
				<div
					className={cn(
						"mt-4 flex items-center gap-2 text-xs",
						isPositive && "text-green-500",
						!isPositive && "text-red-500",
					)}
				>
					{isPositive ? (
						<Icons.arrowUp className="h-3 w-3" />
					) : (
						<Icons.arrowDown className="h-3 w-3" />
					)}
					<span>{data?.changePercentage}</span>
					{data?.interval && (
						<span className="text-secondary-400">vs last {data?.interval}</span>
					)}
				</div>
			)}
		</GlassyCard>
	);
};
