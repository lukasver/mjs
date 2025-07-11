import { CreateSaleForm } from '@/components/admin/create-sales';
import AdminTransactions from '@/components/admin/transactions';

/**
 * AdminPage provides tabbed navigation for admin actions: Sales, New Sale, Transactions.
 */
const ADMIN_TAB_VALUES = {
  Create: 'create',
  Transactions: 'transactions',
} as const;

export default async function AdminPage({
  params,
}: {
  params: { slug: string };
}) {
  const tab = (await params)?.slug;

  if (tab === ADMIN_TAB_VALUES.Create) {
    return <CreateSaleForm />;
  }
  if (tab === ADMIN_TAB_VALUES.Transactions) {
    return <AdminTransactions />;
  }

  return null;
  // return redirect("/admin/sales");
}
