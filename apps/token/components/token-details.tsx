"use client";

import { client } from "@/lib/auth/thirdweb-client";
import { useActiveSale } from "@/lib/services/api";
import ErrorBoundary from "@mjs/ui/components/error-boundary";
import { cn } from "@mjs/ui/lib/utils";
import { Separator } from "@mjs/ui/primitives/separator";
import { defineChain } from "thirdweb";
import { bscTestnet } from "thirdweb/chains";
import { TokenProvider as TokenProviderThirdweb } from "thirdweb/react";
import { TokenIcon, TokenName, TokenSymbol } from "thirdweb/react";

interface TokenDetailsProps {
	classes?: {
		root: string;
		container: string;
	};
}
export function TokenDetails({ classes }: TokenDetailsProps) {
	const { data: activeSale, error } = useActiveSale();
	const sale = activeSale;
	const address = sale?.tokenContractAddress!;
	const chainId = sale?.tokenContractChainId || bscTestnet.id;

	if (!address || !chainId || error) return null;

	return (
		<ErrorBoundary fallback={null}>
			<TokenProviderThirdweb
				address={address}
				client={client}
				chain={defineChain(chainId)}
			>
				<div className={cn("flex items-center gap-2", classes?.root)}>
					<TokenIcon className="size-6" />
					<div className={cn(classes?.container, "flex items-center gap-2")}>
						<TokenSymbol className="text-sm font-head font-bold" />
						<Separator orientation="vertical" className="h-4" />
						<TokenName className="text-sm font-head" />
					</div>
				</div>
			</TokenProviderThirdweb>
		</ErrorBoundary>
	);
}
