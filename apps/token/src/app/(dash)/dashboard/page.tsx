import { FundraisingProgress } from "@/components/dashboard/fundraising-progress";
import { IcoPhases } from "@/components/dashboard/ico-phases";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { TokenMetrics } from "@/components/dashboard/token-metrics";
import { TokenStats } from "@/components/dashboard/token-stats";
import { VisuallyHidden } from "@mjs/ui/primitives/visually-hidden";
import Image from "next/image";

export default async function DashboardPage(_props: PageProps) {
	return (
		<main className="p-2 relative">
			<div className="mx-auto max-w-7xl space-y-8">
				<VisuallyHidden>
					<h1 className="text-2xl font-bold tracking-tight md:text-3xl">
						Dashboard
					</h1>
				</VisuallyHidden>

				<FundraisingProgress />

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					<TokenStats />
				</div>

				<div className="grid gap-6 lg:grid-cols-2">
					<TokenMetrics />
					<IcoPhases />
				</div>

				<RecentTransactions />
			</div>
			<Image
				src="/assets/bg2.png"
				alt=""
				priority
				fill
				sizes="100vw"
				style={{
					objectFit: "cover",
					zIndex: -1,
				}}
			/>
		</main>
	);
}
