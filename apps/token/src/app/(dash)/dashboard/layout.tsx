import { DashboardSidebar } from "@/components/sidebar";
import { SidebarProvider } from "@mjs/ui/primitives/sidebar";
import { Suspense } from "react";
import AdminSidebar from "./admin-sidebar";
import { DashboardHeader } from "./header";

/**
 * Layout component for the dashboard section
 * Provides Wagmi context and ensures wallet connectivity
 */
export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<DashboardSidebar>
				<Suspense fallback={null}>
					<AdminSidebar />
				</Suspense>
			</DashboardSidebar>
			<section className="flex-1 grid grid-rows-[auto_1fr_auto]">
				<DashboardHeader />
				{children}
				<footer className="invisible" />
			</section>
		</SidebarProvider>
	);
}
