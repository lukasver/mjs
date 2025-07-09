"use client";

import { usePrevious } from "@mjs/ui/hooks";
import { useEffect } from "react";
import useActiveAccount from "./hooks/use-active-account";

export const SyncConnectedWallet = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const { signout, activeAccount } = useActiveAccount();
	const prev = usePrevious(activeAccount?.address);

	useEffect(() => {
		// If prev exists but is different than current, we need force the user to log in again to ensure session is updated with active account
		// TODO: find a better way to do this in future
		if (prev && prev !== activeAccount?.address) {
			signout?.();
		}
	}, [prev]);

	return children;
};
