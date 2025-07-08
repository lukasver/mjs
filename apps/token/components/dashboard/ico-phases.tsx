import { Badge } from "@mjs/ui/primitives/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@mjs/ui/primitives/card";

export function IcoPhases() {
	return (
		<Card className="border-zinc-800 bg-zinc-900/50">
			<CardHeader>
				<CardTitle>ICO Phases</CardTitle>
				<CardDescription>Token sale schedule and pricing</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					<div className="relative space-y-5">
						<div className="absolute left-3 top-0 h-full w-px bg-zinc-800" />

						<div className="relative pl-8">
							<div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-purple-500 bg-zinc-900">
								<div className="h-2 w-2 rounded-full bg-purple-500" />
							</div>
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<h3 className="font-medium">Seed Round</h3>
									<Badge
										variant="outline"
										className="border-green-500 text-green-500"
									>
										Completed
									</Badge>
								</div>
								<p className="text-sm text-zinc-400">
									March 1 - March 15, 2023
								</p>
								<div className="text-sm">
									<span className="font-medium">Price:</span> $0.30 |{" "}
									<span className="font-medium">Raised:</span> $1,000,000
								</div>
							</div>
						</div>

						<div className="relative pl-8">
							<div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-purple-500 bg-zinc-900">
								<div className="h-2 w-2 rounded-full bg-purple-500" />
							</div>
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<h3 className="font-medium">Private Sale</h3>
									<Badge
										variant="outline"
										className="border-green-500 text-green-500"
									>
										Completed
									</Badge>
								</div>
								<p className="text-sm text-zinc-400">
									April 1 - April 30, 2023
								</p>
								<div className="text-sm">
									<span className="font-medium">Price:</span> $0.40 |{" "}
									<span className="font-medium">Raised:</span> $2,000,000
								</div>
							</div>
						</div>

						<div className="relative pl-8">
							<div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-purple-500 bg-purple-900/50">
								<div className="h-2 w-2 rounded-full bg-purple-500" />
							</div>
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<h3 className="font-medium">Public Sale - Round 1</h3>
									<Badge className="bg-purple-500 text-white">Active</Badge>
								</div>
								<p className="text-sm text-zinc-400">May 15 - May 30, 2023</p>
								<div className="text-sm">
									<span className="font-medium">Price:</span> $0.50 |{" "}
									<span className="font-medium">Target:</span> $3,000,000
								</div>
							</div>
						</div>

						<div className="relative pl-8">
							<div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900">
								<div className="h-2 w-2 rounded-full bg-zinc-700" />
							</div>
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<h3 className="font-medium text-zinc-500">
										Public Sale - Round 2
									</h3>
									<Badge
										variant="outline"
										className="border-zinc-700 text-zinc-500"
									>
										Upcoming
									</Badge>
								</div>
								<p className="text-sm text-zinc-600">June 15 - June 30, 2023</p>
								<div className="text-sm text-zinc-500">
									<span className="font-medium">Price:</span> $0.60 |{" "}
									<span className="font-medium">Target:</span> $4,000,000
								</div>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
