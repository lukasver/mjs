import { redirect } from "next/navigation";
import CreateSale from "./create-sale";
import AdminSales from "./sales";
import AdminTransactions from "./transactions";

/**
 * AdminPage provides tabbed navigation for admin actions: Sales, New Sale, Transactions.
 */
const ADMIN_TAB_VALUES = {
	Sales: "sales",
	Create: "create",
	Transactions: "transactions",
} as const;

export default async function AdminPage({
	params,
}: {
	params: { slug: string };
}) {
	const tab = (await params)?.slug;
	if (tab === ADMIN_TAB_VALUES.Sales) {
		return <AdminSales />;
	}
	if (tab === ADMIN_TAB_VALUES.Create) {
		return <CreateSale />;
	}
	if (tab === ADMIN_TAB_VALUES.Transactions) {
		return <AdminTransactions />;
	}
	return redirect("/admin/sales");
}
