"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@mjs/ui/primitives/card";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@mjs/ui/primitives/tabs";

export function TokenMetrics() {
	return (
		<Card className="border-zinc-800 bg-zinc-900/50">
			<CardHeader>
				<CardTitle>Token Metrics</CardTitle>
				<CardDescription>
					Distribution and allocation of NexusToken
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue="distribution">
					<TabsList className="grid w-full grid-cols-2 bg-zinc-800">
						<TabsTrigger value="distribution">Distribution</TabsTrigger>
						<TabsTrigger value="allocation">Allocation</TabsTrigger>
					</TabsList>
					<TabsContent value="distribution" className="mt-4 space-y-4">
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="h-3 w-3 rounded-full bg-purple-500" />
									<span className="text-sm">Public Sale</span>
								</div>
								<span className="text-sm font-medium">40%</span>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="h-3 w-3 rounded-full bg-blue-500" />
									<span className="text-sm">Team & Advisors</span>
								</div>
								<span className="text-sm font-medium">20%</span>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="h-3 w-3 rounded-full bg-green-500" />
									<span className="text-sm">Ecosystem Growth</span>
								</div>
								<span className="text-sm font-medium">15%</span>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="h-3 w-3 rounded-full bg-yellow-500" />
									<span className="text-sm">Marketing</span>
								</div>
								<span className="text-sm font-medium">10%</span>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="h-3 w-3 rounded-full bg-red-500" />
									<span className="text-sm">Liquidity</span>
								</div>
								<span className="text-sm font-medium">10%</span>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="h-3 w-3 rounded-full bg-pink-500" />
									<span className="text-sm">Reserve</span>
								</div>
								<span className="text-sm font-medium">5%</span>
							</div>
						</div>
						<div className="h-[180px] w-full rounded-md bg-zinc-800 p-4">
							<div className="flex h-full items-center justify-center text-sm text-zinc-400">
								Chart visualization would appear here
							</div>
						</div>
					</TabsContent>
					<TabsContent value="allocation" className="mt-4">
						<div className="space-y-4">
							<div className="space-y-2">
								<h3 className="text-sm font-medium">Total Supply</h3>
								<p className="text-2xl font-bold">100,000,000 NXT</p>
							</div>
							<div className="space-y-2">
								<h3 className="text-sm font-medium">Circulating Supply</h3>
								<p className="text-2xl font-bold">10,000,000 NXT</p>
								<p className="text-xs text-zinc-400">10% of total supply</p>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-1">
									<h4 className="text-xs font-medium text-zinc-400">
										Initial Circulating Market Cap
									</h4>
									<p className="text-sm font-medium">$5,000,000</p>
								</div>
								<div className="space-y-1">
									<h4 className="text-xs font-medium text-zinc-400">
										Fully Diluted Valuation
									</h4>
									<p className="text-sm font-medium">$50,000,000</p>
								</div>
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
