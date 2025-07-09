"use client";

import { client } from "@/lib/auth/thirdweb-client";
import { useActiveSale } from "@/lib/services/api";
import {
	TokenProvider as TokenProviderThirdweb,
	useActiveWalletChain,
} from "thirdweb/react";

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
	const chain = useActiveWalletChain();
	const { data: activeSale } = useActiveSale();

	return (
		<TokenProviderThirdweb
			address={activeSale?.tokenContractAddress || ""}
			client={client}
			chain={chain}
		>
			{children}
		</TokenProviderThirdweb>
	);
};
