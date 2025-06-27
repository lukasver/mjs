import { NavAdmin } from "@/components/nav/nav-admin";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
} from "@mjs/ui/primitives/sidebar";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const items = [
	{
		title: "Sales",
		url: "/admin/sales",
		icon: "sale",
		items: [
			{
				title: "Sale list",
				url: "/admin/sales",
			},
			{
				title: "New sale",
				url: "/admin/sales/details",
			},
		],
	},
	{
		title: "Transactions",
		url: "/admin/transactions",
		icon: "transaction",
		items: [
			{
				title: "Transaction list",
				url: "/admin/transactions",
			},
		],
	},
];
export default async function AdminSidebar() {
	await sleep(1000);
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Administration</SidebarGroupLabel>
			<SidebarMenu>
				<NavAdmin items={items} />
			</SidebarMenu>
		</SidebarGroup>
	);
}
