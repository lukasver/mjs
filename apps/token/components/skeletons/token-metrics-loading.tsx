import { Skeleton } from "@mjs/ui/primitives/skeleton";

export function TokenMetricsLoading() {
	return (
		<div className="bg-card rounded-lg p-6 space-y-4 border border-border">
			<div className="space-y-2">
				<Skeleton className="h-6 w-32" />
				<Skeleton className="h-4 w-48" />
			</div>
			<div className="space-y-3">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="flex justify-between">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-16" />
					</div>
				))}
			</div>
		</div>
	);
}
