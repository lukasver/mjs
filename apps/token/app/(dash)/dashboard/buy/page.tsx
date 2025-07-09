import { getActiveSale } from "@/lib/actions";
import ErrorBoundary from "@mjs/ui/components/error-boundary";
import { QueryClient } from "@tanstack/react-query";
import { ComingSoon } from "./coming-soon";
import { TokenSale } from "./sale";

export default async function BuyPage() {
	const queryClient = new QueryClient();
	queryClient.prefetchQuery({
		queryKey: ["sale::active"],
		queryFn: () => getActiveSale(),
	});

	return (
		<ErrorBoundary fallback={<ComingSoon />}>
			<TokenSale />
		</ErrorBoundary>
	);
}
