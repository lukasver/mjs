import { Skeleton } from "@mjs/ui/primitives/skeleton";

export function HeaderLoading() {
	return (
		<div className="flex items-center justify-between p-4 border-b border-border">
			<div className="flex items-center gap-4">
				<Skeleton className="h-8 w-8" />
				<Skeleton className="h-6 w-32" />
			</div>
			<div className="flex items-center gap-4">
				<Skeleton className="h-8 w-8" />
				<Skeleton className="h-10 w-24" />
				<Skeleton className="h-10 w-10 rounded-full" />
			</div>
		</div>
	);
}
