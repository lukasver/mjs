import { cn } from "@mjs/ui/lib/utils";
import { Skeleton } from "@mjs/ui/primitives/skeleton";
import { MessageSquare } from "lucide-react";

export default function Loading() {
	return (
		<div className="min-h-screen bg-transparent flex items-center justify-center p-4">
			{/* Always open dialog */}
			<div
				className={cn(
					"bg-red-900 border-red-800 text-white max-w-2xl w-full sm:max-w-[500px] z-50",
					"bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
				)}
			>
				<div className="flex flex-col gap-2 text-center sm:text-left">
					<div className="flex items-center gap-2 text-lg leading-none font-semibold">
						<MessageSquare className="h-5 w-5" />
						<Skeleton className="h-8 w-32 bg-red-800" />
					</div>
					<div className="text-secondary-300 text-sm">
						<Skeleton className="h-5 w-3/4 bg-red-800" />
					</div>
				</div>

				{/* Form fields */}
				<div className="space-y-2">
					{/* Name and Email row */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Skeleton className="h-4 w-12 bg-red-800" />
							<Skeleton className="h-12 w-full bg-red-800 rounded-md" />
						</div>
						<div className="space-y-2">
							<Skeleton className="h-4 w-12 bg-red-800" />
							<Skeleton className="h-12 w-full bg-red-800 rounded-md" />
						</div>
					</div>

					{/* Subject field */}
					<div className="space-y-2">
						<Skeleton className="h-4 w-16 bg-red-800" />
						<Skeleton className="h-12 w-full bg-red-800 rounded-md" />
					</div>

					{/* Message field */}
					<div className="space-y-2">
						<Skeleton className="h-4 w-20 bg-red-800" />
						<Skeleton className="h-32 w-full bg-red-800 rounded-md" />
					</div>

					{/* CAPTCHA section */}
					<div className="border border-red-800 rounded-md p-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Skeleton className="h-6 w-6 bg-red-800" />
								<Skeleton className="h-4 w-32 bg-red-800" />
							</div>
							<Skeleton className="h-8 w-8 rounded-full bg-red-800" />
						</div>
						<div className="mt-2 text-right">
							<Skeleton className="h-3 w-32 bg-red-800 ml-auto" />
						</div>
					</div>

					{/* Action buttons */}
					<div className="flex gap-4">
						<Skeleton className="h-12 flex-1 bg-red-800 rounded-md" />
						<Skeleton className="h-12 flex-1 bg-red-700 rounded-md" />
					</div>
				</div>
			</div>
			{/* </Dialog> */}
			<div
				className={cn(
					"w-full h-full absolute inset-0 bg-repeat -z-1 bg-[url(/static/images/bg2.webp)]",
					"gradient-y-primary",
					"after:absolute after:inset-0 after:bg-gradient-to-t after:from-primary/80 after:from-5% after:to-transparent",
				)}
			/>
			<div id="overlay" className="fixed inset-0 z-50 bg-black/50" />
		</div>
	);
}
